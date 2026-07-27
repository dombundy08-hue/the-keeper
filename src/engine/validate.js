/* Curiosity Hour engine — content validation.
   One set of checks, two homes: in the browser via ?validate=1, and in
   build.js (which runs this same file in Node and ABORTS the deploy on
   any error). Every message is written for the person who edits the
   content files, not for a programmer. */

window.CH = window.CH || {};

CH.validate = (function () {

  function run() {
    var errors = [];
    var todos = [];

    var story = window.STORY || {};
    var rooms = window.ROOMS || {};
    var puzzles = window.PUZZLES || {};
    var assets = window.ASSETS || {};
    var art = assets.art || {};
    var audio = assets.audio || {};

    var chapters = story.chapters || [];
    var fragments = story.fragments || [];

    function err(what, how) { errors.push({ what: what, how: how }); }
    function todo(what) { todos.push({ what: what }); }

    /* ---- index everything ---- */
    var sceneIds = {};      /* 'chapterId:sceneId' and per-chapter lookup */
    var chapterIds = {};
    var fragmentIds = {};
    var i, j, k;

    for (i = 0; i < chapters.length; i++) {
      var ch = chapters[i];
      if (!ch.id) { err('A chapter has no id', 'Every chapter in story.js needs an id.'); continue; }
      if (chapterIds[ch.id]) err('Two chapters share the id "' + ch.id + '"', 'Chapter ids must be unique. Rename one in story.js.');
      chapterIds[ch.id] = ch;
      var seen = {};
      for (j = 0; j < (ch.scenes || []).length; j++) {
        var sc = ch.scenes[j];
        if (!sc.id) { err('A scene in chapter "' + ch.id + '" has no id', 'Every scene needs an id.'); continue; }
        if (seen[sc.id]) err('Two scenes in "' + ch.id + '" share the id "' + sc.id + '"', 'Scene ids must be unique inside a chapter.');
        seen[sc.id] = true;
        sceneIds[ch.id + ':' + sc.id] = true;
      }
    }
    for (i = 0; i < fragments.length; i++) {
      if (fragments[i].id) fragmentIds[fragments[i].id] = true;
    }

    function checkSceneRef(chapterId, sceneId, where) {
      if (!sceneIds[chapterId + ':' + sceneId]) {
        err('“' + where + '” points at scene "' + sceneId + '" in chapter "' + chapterId + '", which does not exist',
            'Check the spelling on both ends in story.js.');
      }
    }
    function checkPuzzleRef(id, where) {
      if (!puzzles[id] || id === 'OVERRIDE') {
        err('“' + where + '” points at puzzle "' + id + '", which is not defined',
            'Check the spelling on both ends in puzzles.js.');
      }
    }
    function checkArtRef(id, where) {
      if (id && !art[id]) {
        err('“' + where + '” uses picture "' + id + '", which is not in the asset list',
            'Add it to the art section of manifest.js.');
      }
    }
    function checkAudioRef(id, where) {
      if (id && !audio[id]) {
        err('“' + where + '” uses recording "' + id + '", which is not in the asset list',
            'Add it to the audio section of manifest.js.');
      }
    }

    /* ---- chapters and scenes ---- */
    for (i = 0; i < chapters.length; i++) {
      var ch2 = chapters[i];
      if (!ch2.id) continue;
      if (ch2.unlockedBy) checkPuzzleRef(ch2.unlockedBy, 'chapter ' + ch2.id + ' unlockedBy');
      var scenes = ch2.scenes || [];
      if (!scenes.length) err('Chapter "' + ch2.id + '" has no scenes', 'Every chapter needs at least one scene.');
      for (j = 0; j < scenes.length; j++) {
        var s = scenes[j];
        if (!s.id) continue;
        var where = 'scene ' + ch2.id + '/' + s.id;
        checkArtRef(s.art, where);
        checkAudioRef(s.audio, where);
        if (typeof s.text === 'string' && s.text.indexOf('TODO') !== -1) todo(where + ' text is a TODO');
        var next = s.next;
        if (next == null) continue;
        if (typeof next === 'string') checkSceneRef(ch2.id, next, where + ' next');
        else if (next.room) {
          if (!rooms[next.room]) err('“' + where + '” sends the player to room "' + next.room + '", which does not exist', 'Check the room id in rooms.js.');
        }
        else if (next.puzzle) checkPuzzleRef(next.puzzle, where + ' next');
        else if (!next.end) err('“' + where + '” has a next the game cannot follow', "next must be a scene id, { room: 'id' }, { puzzle: 'ID' }, or { end: true }.");
      }
    }

    /* ---- rooms ---- */
    var reachable = {};
    var roots = [];
    for (i = 0; i < chapters.length; i++) {
      var scs = (chapters[i].scenes || []);
      for (j = 0; j < scs.length; j++) {
        var nx = scs[j].next;
        if (nx && nx.room && rooms[nx.room]) roots.push(nx.room);
      }
    }
    function walk(roomId) {
      if (!roomId || reachable[roomId] || !rooms[roomId]) return;
      reachable[roomId] = true;
      var exits = rooms[roomId].exits || [];
      for (var e = 0; e < exits.length; e++) {
        if (exits[e].to) walk(exits[e].to);
      }
    }
    for (i = 0; i < roots.length; i++) walk(roots[i]);

    for (var roomId in rooms) {
      var room = rooms[roomId];
      var rwhere = 'room ' + roomId;
      if (!reachable[roomId]) {
        err('Room "' + roomId + '" can never be reached',
            'No episode sends the player there and no exit leads there. Check exits in rooms.js.');
      }
      checkArtRef(room.art, rwhere);
      if (room.resolvedArt) checkArtRef(room.resolvedArt, rwhere + ' resolvedArt');
      var exits = room.exits || [];
      for (j = 0; j < exits.length; j++) {
        var ex = exits[j];
        if (ex.to && !rooms[ex.to]) err('“' + rwhere + '” has an exit to "' + ex.to + '", which does not exist', 'Check the room id in rooms.js.');
        checkBox(ex.box, rwhere + ' exit "' + (ex.label || ex.to) + '"');
      }
      var objects = room.objects || [];
      for (j = 0; j < objects.length; j++) {
        var obj = objects[j];
        var owhere = rwhere + ' object "' + (obj.name || obj.id) + '"';
        if (!obj.look) err('“' + owhere + '” has no look text', 'Every object needs a look line in rooms.js.');
        if (typeof obj.look === 'string' && obj.look.indexOf('TODO') !== -1) todo(owhere + ' look is a TODO');
        checkBox(obj.box, owhere);
        checkAudioRef(obj.audio, owhere);
        if (obj.anomaly) {
          var list = Object.prototype.toString.call(obj.anomaly) === '[object Array]' ? obj.anomaly : [obj.anomaly];
          for (k = 0; k < list.length; k++) {
            var an = list[k];
            var awhere = owhere + ' anomaly';
            if (!an.chapter || !chapterIds[an.chapter]) err('“' + awhere + '” names chapter "' + an.chapter + '", which does not exist', 'Check the chapter id in rooms.js.');
            if (an.solves) checkPuzzleRef(an.solves, awhere + ' solves'); else err('“' + awhere + '” has no solves', 'An anomaly must name the puzzle it solves.');
            checkAudioRef(an.audio, awhere);
          }
        }
      }
    }

    function checkBox(box, where) {
      if (!box || box.length !== 4) {
        err('“' + where + '” has no usable box', 'box must be [x, y, width, height] in rooms.js.');
        return;
      }
      var x = box[0], y = box[1], w = box[2], h = box[3];
      if (x < 0 || y < 0 || w <= 0 || h <= 0 || x + w > 640 || y + h > 360) {
        err('“' + where + '” has a box outside the 640x360 screen',
            'box is [x, y, width, height]; x+width must stay under 640 and y+height under 360.');
      }
    }

    /* ---- puzzles ---- */
    for (var pid in puzzles) {
      if (pid === 'OVERRIDE') continue;
      var p = puzzles[pid];
      var pwhere = 'puzzle ' + pid;
      if (!p.hints || p.hints.length !== 3) {
        err('“' + pwhere + '” does not have exactly three hints',
            'Every puzzle needs exactly three: a nudge, a direction, and the answer.');
      } else {
        for (j = 0; j < 3; j++) {
          if (typeof p.hints[j] === 'string' && p.hints[j].indexOf('TODO') !== -1) todo(pwhere + ' hint ' + (j + 1) + ' is a TODO');
        }
      }
      if (['text', 'sequence', 'grid', 'audio-reverse'].indexOf(p.type) === -1) {
        err('“' + pwhere + '” has type "' + p.type + '"', 'type must be text, sequence, grid, or audio-reverse.');
      }
      if (p.type === 'sequence' && (!p.items || !p.items.length)) {
        err('“' + pwhere + '” is a sequence with no items', "Add items: [ { id: 'red', label: 'Red lens' }, ... ] in puzzles.js.");
      }
      if (p.type === 'audio-reverse') checkAudioRef(p.audio, pwhere);
      var on = p.onSolve || {};
      if (on.unlock && !chapterIds[on.unlock]) err('“' + pwhere + '” unlocks chapter "' + on.unlock + '", which does not exist', 'Check the chapter id.');
      if (on.goto && on.goto.scene) checkSceneRef(on.goto.chapter, on.goto.scene, pwhere + ' onSolve goto');
      if (on.fragment && !fragmentIds[on.fragment]) err('“' + pwhere + '” reveals fragment "' + on.fragment + '", which does not exist', 'Check the fragments list in story.js.');
      if (!p.acceptedHashes || !p.acceptedHashes.length) todo(pwhere + ' has no accepted answers yet (fine only if it is click-solved)');
    }
    if (!puzzles.OVERRIDE || !puzzles.OVERRIDE.phraseHashes || !puzzles.OVERRIDE.phraseHashes.length) {
      err('The parent override has no master phrase', 'puzzles.js needs OVERRIDE: { phraseHashes: [ ... ] }.');
    }

    /* ---- fragments ---- */
    for (i = 0; i < fragments.length; i++) {
      var fr = fragments[i];
      var fwhere = 'fragment ' + (fr.id || '#' + i);
      if (!fr.id) err('A fragment has no id', 'Every fragment in story.js needs an id.');
      checkAudioRef(fr.audio, fwhere);
      if (fr.puzzle) checkPuzzleRef(fr.puzzle, fwhere);
      if (typeof fr.text === 'string' && fr.text.indexOf('TODO') !== -1) todo(fwhere + ' text is a TODO');
    }

    return { errors: errors, todos: todos };
  }

  return { run: run };
})();
