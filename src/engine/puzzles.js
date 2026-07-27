/* Curiosity Hour engine — puzzle system.
   Four types (text, sequence, grid, audio-reverse), the mandatory
   three-hint ladder, real code entry, and the parent override.

   Hint ladder (§6): hint 1 after 3 wrong tries OR the always-visible
   "I'm stuck" button; each further hint after 3 more tries — and the
   stuck button ALWAYS advances one hint regardless, because there is
   nobody to ask. Hint 3 states the answer. */

window.CH = window.CH || {};

CH.puzzles = (function () {

  var activePuzzleId = null;
  var sequencePick = [];        /* ids picked so far, in order */
  var overrideClicks = 0;
  var overrideOpen = false;

  function el(id) { return document.getElementById(id); }

  function find(puzzleId) {
    var p = (window.PUZZLES && window.PUZZLES[puzzleId]) || null;
    /* OVERRIDE is configuration, not a puzzle. */
    if (p && puzzleId === 'OVERRIDE') return null;
    return p;
  }

  function attemptsOf(puzzleId) {
    return CH.state.get().attempts[puzzleId] || 0;
  }
  function hintsShown(puzzleId) {
    return CH.state.get().hints[puzzleId] || 0;
  }

  /* Highest hint earned by attempts alone: 3, 6, 9 wrong tries. */
  function hintsEarned(puzzleId) {
    return Math.min(3, Math.floor(attemptsOf(puzzleId) / 3));
  }

  function renderHints(puzzle) {
    var box = el('puzzle-hints');
    box.innerHTML = '';
    var shown = Math.max(hintsShown(puzzle.id), hintsEarned(puzzle.id));
    if (shown !== hintsShown(puzzle.id)) {
      CH.state.get().hints[puzzle.id] = shown;
      CH.state.save();
    }
    for (var i = 0; i < shown && i < puzzle.hints.length; i++) {
      var p = document.createElement('p');
      p.className = 'hint hint-' + (i + 1);
      p.textContent = (i + 1) + '. ' + puzzle.hints[i];
      box.appendChild(p);
    }
    var btn = el('btn-stuck');
    if (shown >= 3) {
      btn.disabled = true;
      btn.textContent = 'That is every hint I have';
    } else {
      btn.disabled = false;
      btn.textContent = "I'm stuck";
    }
  }

  function renderSequence(puzzle) {
    var pickBox = el('puzzle-seq-picked');
    var itemBox = el('puzzle-seq-items');
    pickBox.textContent = sequencePick.length
      ? sequencePick.map(function (id) {
          for (var i = 0; i < puzzle.items.length; i++) {
            if (puzzle.items[i].id === id) return puzzle.items[i].label;
          }
          return id;
        }).join('  →  ')
      : 'Nothing picked yet.';
    itemBox.innerHTML = '';
    for (var i = 0; i < puzzle.items.length; i++) {
      (function (item) {
        var b = document.createElement('button');
        b.className = 'menu-btn seq-btn';
        b.textContent = item.label;
        b.disabled = sequencePick.indexOf(item.id) !== -1;
        b.addEventListener('click', function () {
          sequencePick.push(item.id);
          renderSequence(puzzle);
        });
        itemBox.appendChild(b);
      })(puzzle.items[i]);
    }
    var clear = document.createElement('button');
    clear.className = 'menu-btn seq-btn';
    clear.textContent = 'Start over';
    clear.addEventListener('click', function () {
      sequencePick = [];
      renderSequence(puzzle);
    });
    itemBox.appendChild(clear);
  }

  function show(puzzleId) {
    var puzzle = find(puzzleId);
    if (!puzzle) {
      CH.screens.contentError(
        'Puzzle "' + puzzleId + '" is not defined',
        'Something points at a puzzle id that does not exist in ' +
        'src/content/puzzles.js. Check the spelling on both ends.'
      );
      return;
    }
    activePuzzleId = puzzleId;
    sequencePick = [];

    var d = CH.state.get();
    d.screen = 'puzzle';
    d.puzzle = puzzleId;
    CH.state.save();

    el('puzzle-prompt').textContent = puzzle.prompt || '';
    el('puzzle-feedback').textContent = '';
    el('puzzle-feedback').className = 'feedback';

    /* Type-specific panels */
    el('puzzle-text-row').hidden = !(puzzle.type === 'text' ||
      puzzle.type === 'grid' || puzzle.type === 'audio-reverse');
    el('puzzle-seq').hidden = puzzle.type !== 'sequence';
    el('puzzle-grid').hidden = puzzle.type !== 'grid';
    el('puzzle-audio-row').hidden = puzzle.type !== 'audio-reverse';

    if (puzzle.type === 'grid' && puzzle.gridRows) {
      el('puzzle-grid').textContent = puzzle.gridRows.join('\n');
    }
    if (puzzle.type === 'sequence') {
      if (!puzzle.items || !puzzle.items.length) {
        CH.screens.contentError(
          'Puzzle "' + puzzleId + '" is a sequence with no items',
          'A sequence puzzle needs an items list in src/content/puzzles.js, ' +
          "like items: [ { id: 'red', label: 'Red lens' } ]."
        );
        return;
      }
      renderSequence(puzzle);
    }
    el('puzzle-input').value = '';
    renderHints(puzzle);

    if (CH.state.isSolved(puzzleId)) {
      el('puzzle-feedback').textContent = 'Already solved. Well noticed.';
      el('puzzle-feedback').className = 'feedback good';
    }

    CH.screens.show('puzzle');
    if (!el('puzzle-text-row').hidden) el('puzzle-input').focus();
  }

  function solved(puzzle, sayText) {
    CH.state.markSolved(puzzle.id);
    var fb = el('puzzle-feedback');
    fb.textContent = sayText || 'Yes. That is it exactly.';
    fb.className = 'feedback good';
    CH.puzzles.runOnSolve(puzzle.id);
  }

  function failed(puzzle) {
    var d = CH.state.get();
    d.attempts[puzzle.id] = (d.attempts[puzzle.id] || 0) + 1;
    CH.state.save();
    var fb = el('puzzle-feedback');
    fb.textContent = 'Not quite. Look again — and remember, guessing is free.';
    fb.className = 'feedback bad';
    renderHints(puzzle);
  }

  function submitActive() {
    var puzzle = find(activePuzzleId);
    if (!puzzle) return;
    if (CH.state.isSolved(puzzle.id)) {
      CH.puzzles.runOnSolve(puzzle.id);
      return;
    }
    var raw;
    if (puzzle.type === 'sequence') {
      raw = sequencePick.join(' ');
      if (!sequencePick.length) return;
    } else {
      raw = el('puzzle-input').value;
      if (!raw.trim()) return;
    }
    if (CH.hash.matches(raw, puzzle.acceptedHashes)) {
      solved(puzzle, puzzle.solvedText);
    } else {
      sequencePick = [];
      if (puzzle.type === 'sequence') renderSequence(puzzle);
      failed(puzzle);
    }
  }

  /* ---------- parent override ---------- */

  function overridePhraseOk(input) {
    var cfg = (window.PUZZLES && window.PUZZLES.OVERRIDE) || null;
    if (!cfg || !cfg.phraseHashes || !cfg.phraseHashes.length) return false;
    return CH.hash.matches(input, cfg.phraseHashes);
  }

  function buildOverridePanel() {
    var box = el('override-chapters');
    box.innerHTML = '';
    var chapters = (window.STORY && window.STORY.chapters) || [];
    for (var i = 0; i < chapters.length; i++) {
      (function (ch) {
        var b = document.createElement('button');
        b.className = 'menu-btn seq-btn';
        b.textContent = ch.title || ch.id;
        b.addEventListener('click', function () {
          CH.state.markUnlocked(ch.id);
          CH.scenes.startChapter(ch.id);
        });
        box.appendChild(b);
      })(chapters[i]);
    }

    var pbox = el('override-puzzles');
    pbox.innerHTML = '';
    var all = window.PUZZLES || {};
    for (var key in all) {
      if (key === 'OVERRIDE') continue;
      (function (p) {
        var row = document.createElement('div');
        row.className = 'override-row';
        var name = document.createElement('span');
        name.textContent = p.id + (CH.state.isSolved(p.id) ? ' (solved)' : '');
        var mark = document.createElement('button');
        mark.className = 'menu-btn seq-btn';
        mark.textContent = 'Mark solved';
        mark.addEventListener('click', function () {
          CH.state.markSolved(p.id);
          buildOverridePanel();
        });
        var reveal = document.createElement('button');
        reveal.className = 'menu-btn seq-btn';
        reveal.textContent = 'Reveal answer';
        reveal.addEventListener('click', function () {
          el('override-feedback').textContent =
            p.id + ' — ' + (p.hints && p.hints[2] ? p.hints[2] : 'no final hint written yet');
        });
        row.appendChild(name);
        row.appendChild(mark);
        row.appendChild(reveal);
        pbox.appendChild(row);
      })(all[key]);
    }
  }

  return {
    find: find,
    show: show,
    submitActive: submitActive,

    runOnSolve: function (puzzleId) {
      var puzzle = find(puzzleId);
      if (!puzzle) {
        CH.screens.contentError(
          'Puzzle "' + puzzleId + '" is not defined',
          'Something points at a puzzle id that does not exist in ' +
          'src/content/puzzles.js. Check the spelling on both ends.'
        );
        return;
      }
      var on = puzzle.onSolve || {};
      if (on.unlock) CH.state.markUnlocked(on.unlock);
      if (on.lens) {
        var d = CH.state.get();
        d.lenses = Math.min(3, d.lenses + 1);
        CH.state.save();
      }
      if (on.fragment && CH.notebook) CH.notebook.addFragment(on.fragment);
      if (on.goto && on.goto.scene) {
        CH.scenes.show(on.goto.chapter || CH.state.get().chapter, on.goto.scene);
      } else if (on.unlock) {
        /* A code unlocked a chapter: start it. */
        CH.scenes.startChapter(on.unlock);
      }
    },

    /* Try raw input against every puzzle that a typed code may solve.
       Used by the code entry screen. Returns true on a match. */
    tryCode: function (raw) {
      var all = window.PUZZLES || {};
      for (var key in all) {
        if (key === 'OVERRIDE') continue;
        var p = all[key];
        if (!p.acceptedHashes || !p.acceptedHashes.length) continue;
        if (CH.hash.matches(raw, p.acceptedHashes)) {
          if (!CH.state.isSolved(p.id)) CH.state.markSolved(p.id);
          this.runOnSolve(p.id);
          return true;
        }
      }
      return false;
    },

    /* "I'm stuck": always advances one hint. Hint 3 is always reachable. */
    stuck: function () {
      var puzzle = find(activePuzzleId);
      if (!puzzle) return;
      var d = CH.state.get();
      d.hints[puzzle.id] = Math.min(3, hintsShown(puzzle.id) + 1);
      CH.state.save();
      renderHints(puzzle);
    },

    /* Keyhole: five clicks opens the phrase prompt. */
    keyholeClick: function () {
      overrideClicks++;
      if (overrideClicks >= 5) {
        overrideClicks = 0;
        el('override-gate').hidden = false;
        el('override-panel').hidden = true;
        CH.screens.show('override');
        el('override-phrase').value = '';
        el('override-phrase').focus();
      }
    },

    overrideSubmitPhrase: function () {
      if (overridePhraseOk(el('override-phrase').value)) {
        overrideOpen = true;
        el('override-gate').hidden = true;
        el('override-panel').hidden = false;
        buildOverridePanel();
      } else {
        el('override-gate-feedback').textContent = 'That is not the phrase.';
      }
    },

    overrideExportKey: function () {
      el('override-feedback').textContent = CH.key.encode(CH.state.get());
    },

    overrideReset: function () {
      CH.state.reset();
      CH.screens.show('title');
    }
  };
})();
