/* Curiosity Hour engine — room view.
   Static background, magnifier cursor, hover names an object, click
   examines it. One object per chapter may carry the anomaly; clicking
   it solves its puzzle. Keyboard: Tab cycles objects, Enter examines,
   Esc opens the menu. Wrong guesses cost nothing. */

window.CH = window.CH || {};

CH.rooms = (function () {

  function findRoom(roomId) {
    return (window.ROOMS && window.ROOMS[roomId]) || null;
  }

  function currentChapterId() {
    return CH.state.get().chapter;
  }

  /* The anomaly for an object in the current chapter, if any.
     anomaly may be a single {chapter,...} or a list of them. */
  function anomalyFor(obj) {
    if (!obj.anomaly) return null;
    var list = Array.isArray(obj.anomaly) ? obj.anomaly : [obj.anomaly];
    for (var i = 0; i < list.length; i++) {
      if (list[i].chapter === currentChapterId()) return list[i];
    }
    return null;
  }

  function setLookPanel(name, text) {
    document.getElementById('room-object-name').textContent = name || '';
    document.getElementById('room-look-text').textContent = text || '';
  }

  function renderBackground(room) {
    var artEl = document.getElementById('room-art');
    artEl.innerHTML = '';
    /* A room can render as a smear until a chapter resolves it
       (mom & dad's room becomes real in Episode 4). */
    var artId = room.art;
    if (room.resolvedArt && room.resolvesIn && CH.state.isUnlocked(room.resolvesIn)) {
      artId = room.resolvedArt;
    }
    var entry = artId && window.ASSETS && window.ASSETS.art && window.ASSETS.art[artId];
    if (!entry) {
      artEl.textContent = artId ? '[ ' + artId + ' ]' : '[ ' + room.id + ' ]';
      return;
    }
    var img = document.createElement('img');
    img.alt = entry.alt || room.name;
    img.addEventListener('error', function () {
      artEl.innerHTML = '';
      artEl.textContent = '[ ' + artId + ' ]';
    });
    img.src = entry.file;
    artEl.appendChild(img);
  }

  function examine(room, obj) {
    var anomaly = anomalyFor(obj);
    if (anomaly && !CH.state.isSolved(anomaly.solves)) {
      /* Found it. */
      setLookPanel(obj.name, anomaly.text);
      CH.audio.playLine(anomaly.audio);
      if (anomaly.solves) {
        CH.state.markSolved(anomaly.solves);
        CH.puzzles.runOnSolve(anomaly.solves);
      }
      return;
    }
    /* Ordinary look. Free, always. */
    setLookPanel(obj.name, obj.look);
    CH.audio.playLine(obj.audio);
    var d = CH.state.get();
    var key = d.chapter + ':' + obj.id;
    if (d.found.indexOf(key) === -1) {
      /* remember what has been examined, for hint logic and the dev screen */
      d.attempts['ROOM_' + d.room] = (d.attempts['ROOM_' + d.room] || 0) + 1;
      CH.state.save();
    }
  }

  function buildHotspots(room) {
    var layer = document.getElementById('room-hotspots');
    layer.innerHTML = '';

    function addBox(box, className, label, onActivate) {
      var el = document.createElement('div');
      el.className = className;
      el.style.left = box[0] + 'px';
      el.style.top = box[1] + 'px';
      el.style.width = box[2] + 'px';
      el.style.height = box[3] + 'px';
      el.setAttribute('tabindex', '0');
      el.setAttribute('role', 'button');
      el.setAttribute('aria-label', label);
      var tag = document.createElement('span');
      tag.className = 'hotspot-label';
      tag.textContent = label;
      el.appendChild(tag);
      el.addEventListener('click', function (ev) {
        ev.stopPropagation();
        onActivate();
      });
      el.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter' || ev.key === ' ') {
          ev.preventDefault();
          ev.stopPropagation();
          onActivate();
        }
      });
      layer.appendChild(el);
      return el;
    }

    var objects = room.objects || [];
    for (var i = 0; i < objects.length; i++) {
      (function (obj) {
        addBox(obj.box, 'hotspot', obj.name, function () {
          examine(room, obj);
        });
      })(objects[i]);
    }

    var exits = room.exits || [];
    for (var j = 0; j < exits.length; j++) {
      (function (exit) {
        addBox(exit.box, 'hotspot exit', exit.label, function () {
          /* Permanently blocked (downstairs), or blocked until a
             chapter unlocks (mom & dad's door before Episode 4). */
          var isBlocked = exit.blocked &&
            (!exit.blockedUntil || !CH.state.isUnlocked(exit.blockedUntil));
          if (isBlocked) {
            setLookPanel(exit.label, exit.blocked);
            CH.audio.playLine(exit.audio);
            return;
          }
          CH.rooms.enter(exit.to);
        });
      })(exits[j]);
    }
  }

  return {
    enter: function (roomId) {
      var room = findRoom(roomId);
      if (!room) {
        CH.screens.contentError(
          'Room "' + roomId + '" was not found',
          'Something points at a room id that does not exist in src/content/rooms.js. ' +
          'Check the spelling on both ends.'
        );
        return;
      }

      var d = CH.state.get();
      d.room = roomId;
      d.screen = 'room';
      CH.state.save();

      CH.eras.applyForChapter(d.chapter);
      document.getElementById('room-name').textContent = room.name;
      renderBackground(room);
      buildHotspots(room);
      setLookPanel('', room.enterText ||
        'Look around. Hover things to name them. Click what feels wrong.');
      CH.screens.show('room');

      /* Focus the first hotspot for keyboard players. */
      var first = document.querySelector('#room-hotspots .hotspot');
      if (first) first.focus();
    }
  };
})();
