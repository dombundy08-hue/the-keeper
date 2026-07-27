/* Curiosity Hour engine — the notebook.
   After Episode 4 there are no episodes. The broadcast chrome is gone
   and the game becomes paper: fragments of the Keeper's notebook,
   accumulating as the physical hunt reaches the rental house, the
   library, and finally the attic. The last fragment hands off to
   something that is not the game at all. */

window.CH = window.CH || {};

CH.notebook = (function () {

  function el(id) { return document.getElementById(id); }

  function fragments() {
    return (window.STORY && window.STORY.fragments) || [];
  }

  function findFragment(id) {
    var list = fragments();
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) return list[i];
    }
    return null;
  }

  function isRevealed(id) {
    return CH.state.get().notebook.indexOf(id) !== -1;
  }

  return {
    /* The notebook exists for the player once Episode 4 has ended. */
    isOpenToPlayer: function () {
      return CH.state.get().completed.indexOf('ep4') !== -1 ||
             CH.state.get().notebook.length > 0;
    },

    addFragment: function (id) {
      if (!findFragment(id)) {
        CH.screens.contentError(
          'Notebook fragment "' + id + '" is not defined',
          'Something points at a fragment id that does not exist in the ' +
          'fragments list in src/content/story.js. Check the spelling on both ends.'
        );
        return;
      }
      var d = CH.state.get();
      if (d.notebook.indexOf(id) === -1) {
        d.notebook.push(id);
        CH.state.save();
      }
      this.open();
      this.read(id);
    },

    /* The list: revealed fragments are readable; the rest are quiet
       empty slots, so the kids can see there is more to find. */
    open: function () {
      CH.eras.apply('notebook');
      var box = el('notebook-list');
      box.innerHTML = '';
      var list = fragments();
      if (!list.length) {
        box.textContent = 'The notebook is empty.';
      }
      for (var i = 0; i < list.length; i++) {
        (function (frag) {
          var row = document.createElement('button');
          if (isRevealed(frag.id)) {
            row.className = 'notebook-row';
            row.textContent = frag.title || frag.id;
            row.addEventListener('click', function () {
              CH.notebook.read(frag.id);
            });
          } else {
            row.className = 'notebook-row locked';
            row.textContent = '. . . a page not yet found';
            row.disabled = true;
          }
          box.appendChild(row);
        })(list[i]);
      }
      el('notebook-reader').hidden = true;
      el('notebook-list').hidden = false;
      var d = CH.state.get();
      d.screen = 'notebook';
      CH.state.save();
      CH.screens.show('notebook');
    },

    read: function (id) {
      var frag = findFragment(id);
      if (!frag || !isRevealed(id)) { this.open(); return; }
      el('notebook-list').hidden = true;
      var reader = el('notebook-reader');
      reader.hidden = false;
      el('notebook-title').textContent = frag.title || '';
      el('notebook-text').textContent = frag.text || '';
      CH.audio.playLine(frag.audio);

      /* A fragment can lead somewhere: a puzzle, or the final handoff. */
      var act = el('btn-notebook-action');
      if (frag.puzzle) {
        act.hidden = false;
        act.textContent = frag.actionLabel || 'Try it';
        act.onclick = function () { CH.puzzles.show(frag.puzzle); };
      } else if (frag.handoff) {
        act.hidden = false;
        act.textContent = frag.actionLabel || 'Play the last tape';
        act.onclick = function () { CH.notebook.handoff(); };
      } else {
        act.hidden = true;
        act.onclick = null;
      }
    },

    /* The end of the game: no pixel art, no Keeper, no chrome.
       A slot for Dom's real video, and his letter. */
    handoff: function () {
      CH.eras.apply('notebook');
      CH.audio.stop();
      var slot = el('handoff-video-slot');
      slot.innerHTML = '';
      var entry = window.ASSETS && window.ASSETS.video && window.ASSETS.video.dom_final;
      if (entry) {
        var video = document.createElement('video');
        video.controls = true;
        video.preload = 'metadata';
        video.className = 'handoff-video';
        video.addEventListener('error', function () {
          slot.innerHTML = '';
          var note = document.createElement('p');
          note.className = 'small';
          note.textContent = 'The tape is not here yet. The letter still is.';
          slot.appendChild(note);
        });
        video.src = entry.file;
        slot.appendChild(video);
      } else {
        var note = document.createElement('p');
        note.className = 'small';
        note.textContent = 'The tape is not here yet. The letter still is.';
        slot.appendChild(note);
      }
      var letter = (window.STORY && window.STORY.handoffLetter) ||
        'TODO: author input required — the letter.';
      el('handoff-letter').textContent = letter;
      CH.screens.show('handoff');
    }
  };
})();
