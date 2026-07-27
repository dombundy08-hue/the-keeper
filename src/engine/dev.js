/* Curiosity Hour engine — dev screen.
   Opens with ?dev=1, and ONLY on file:// or localhost, so the public
   deployment never exposes it. The build also strips this file.
   Shows: every TODO left in content, an asset load report, a hash tool
   for authoring acceptedHashes, jump-to-scene, and the audio log. */

window.CH = window.CH || {};

CH.dev = (function () {

  function isDevHost() {
    return location.protocol === 'file:' ||
           location.hostname === 'localhost' ||
           location.hostname === '127.0.0.1';
  }

  /* Walk any content object and collect every string containing TODO,
     with a path that tells the author exactly where it lives. */
  function collectTodos(value, path, out) {
    if (typeof value === 'string') {
      if (value.indexOf('TODO') !== -1) out.push({ path: path, text: value });
      return;
    }
    if (Array.isArray(value)) {
      for (var i = 0; i < value.length; i++) {
        collectTodos(value[i], path + '[' + i + ']', out);
      }
      return;
    }
    if (value && typeof value === 'object') {
      for (var k in value) collectTodos(value[k], path + '.' + k, out);
    }
  }

  function el(id) { return document.getElementById(id); }

  function renderTodos() {
    var out = [];
    collectTodos(window.STORY, 'story', out);
    collectTodos(window.ROOMS, 'rooms', out);
    collectTodos(window.PUZZLES, 'puzzles', out);
    var box = el('dev-todos');
    box.innerHTML = '';
    var head = document.createElement('p');
    head.textContent = out.length + ' TODO item(s) remaining in content:';
    box.appendChild(head);
    for (var i = 0; i < out.length; i++) {
      var p = document.createElement('p');
      p.className = 'dev-line';
      p.textContent = out[i].path + ' — ' + out[i].text.slice(0, 90);
      box.appendChild(p);
    }
    /* Typed puzzles with no accepted answers are unfinished even without
       TODO text. Puzzles solved by clicking an anomaly are exempt. */
    var anomalySolved = {};
    var rooms = window.ROOMS || {};
    for (var r in rooms) {
      var objs = rooms[r].objects || [];
      for (var oi = 0; oi < objs.length; oi++) {
        var an = objs[oi].anomaly;
        if (!an) continue;
        var list = Array.isArray(an) ? an : [an];
        for (var ai = 0; ai < list.length; ai++) {
          if (list[ai].solves) anomalySolved[list[ai].solves] = true;
        }
      }
    }
    var all = window.PUZZLES || {};
    for (var key in all) {
      if (key === 'OVERRIDE') continue;
      var p2 = all[key];
      if ((!p2.acceptedHashes || !p2.acceptedHashes.length) && !anomalySolved[key]) {
        var q = document.createElement('p');
        q.className = 'dev-line';
        q.textContent = 'puzzles.' + key + ' — acceptedHashes is empty (cannot be typed yet)';
        box.appendChild(q);
      }
    }
  }

  function renderAssetReport() {
    var box = el('dev-assets');
    box.innerHTML = '';
    var assets = window.ASSETS || {};
    function line(id, kind, ok) {
      var p = document.createElement('p');
      p.className = 'dev-line ' + (ok ? 'dev-ok' : 'dev-missing');
      p.textContent = (ok ? 'OK      ' : 'MISSING ') + kind + '  ' + id;
      box.appendChild(p);
    }
    var art = assets.art || {};
    for (var a in art) {
      (function (id, entry) {
        var img = new Image();
        img.onload = function () { line(id, 'art  ', true); };
        img.onerror = function () { line(id, 'art  ', false); };
        img.src = entry.file;
      })(a, art[a]);
    }
    var audio = assets.audio || {};
    for (var u in audio) {
      (function (id, entry) {
        var probe = new Audio();
        probe.oncanplaythrough = function () { line(id, 'audio', true); probe.oncanplaythrough = null; };
        probe.onerror = function () { line(id, 'audio', false); };
        probe.preload = 'auto';
        probe.src = entry.file;
      })(u, audio[u]);
    }
  }

  function renderJump() {
    var box = el('dev-jump');
    box.innerHTML = '';
    var chapters = (window.STORY && window.STORY.chapters) || [];
    for (var i = 0; i < chapters.length; i++) {
      (function (ch) {
        for (var j = 0; j < ch.scenes.length; j++) {
          (function (sc) {
            var b = document.createElement('button');
            b.className = 'menu-btn seq-btn';
            b.textContent = sc.id;
            b.addEventListener('click', function () {
              CH.state.markUnlocked(ch.id);
              CH.scenes.show(ch.id, sc.id);
            });
            box.appendChild(b);
          })(ch.scenes[j]);
        }
      })(chapters[i]);
    }
  }

  return {
    isDevHost: isDevHost,

    open: function () {
      if (!isDevHost()) { CH.screens.show('title'); return; }
      renderTodos();
      renderJump();
      renderAssetReport();
      el('dev-hash-out').textContent = '';
      CH.screens.show('dev');
    },

    hashTool: function () {
      var raw = el('dev-hash-in').value;
      var norm = CH.hash.normalize(raw);
      el('dev-hash-out').textContent =
        'normalized: "' + norm + '"   hash: ' + CH.hash.fnv1a(norm);
    }
  };
})();
