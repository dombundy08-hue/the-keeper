/* Curiosity Hour engine — scene player.
   Typewriter reveal (click/space/Enter skips to full text, then advances),
   one audio line per scene, subtitles always on — the text panel IS the
   subtitle. Respects prefers-reduced-motion and the text speed setting. */

window.CH = window.CH || {};

CH.scenes = (function () {

  /* ---- typewriter ---- */
  var typer = { timer: null, full: '', active: false };

  function typeDelayMs() {
    if (window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return 0;
    }
    var speed = CH.state.get().settings.textSpeed;
    if (speed === 'instant') return 0;
    if (speed === 'slow') return 55;
    if (speed === 'fast') return 12;
    return 28; /* normal */
  }

  function stopTyping() {
    if (typer.timer) { clearInterval(typer.timer); typer.timer = null; }
    typer.active = false;
  }

  function startTyping(text) {
    stopTyping();
    var el = document.getElementById('scene-text');
    var delay = typeDelayMs();
    typer.full = text;
    if (delay === 0) {
      el.textContent = text;
      return;
    }
    el.textContent = '';
    var pos = 0;
    typer.active = true;
    typer.timer = setInterval(function () {
      pos++;
      el.textContent = typer.full.slice(0, pos);
      if (pos >= typer.full.length) stopTyping();
    }, delay);
  }

  function finishTyping() {
    stopTyping();
    document.getElementById('scene-text').textContent = typer.full;
  }

  /* ---- lookup ---- */
  function findChapter(chapterId) {
    var chapters = (window.STORY && window.STORY.chapters) || [];
    for (var i = 0; i < chapters.length; i++) {
      if (chapters[i].id === chapterId) return chapters[i];
    }
    return null;
  }

  function findScene(chapter, sceneId) {
    if (!chapter || !chapter.scenes) return null;
    for (var i = 0; i < chapter.scenes.length; i++) {
      if (chapter.scenes[i].id === sceneId) return chapter.scenes[i];
    }
    return null;
  }

  /* ---- art ---- */
  function renderArt(artId) {
    var artEl = document.getElementById('scene-art');
    artEl.innerHTML = '';
    var entry = artId && window.ASSETS && window.ASSETS.art && window.ASSETS.art[artId];
    if (!entry) {
      artEl.textContent = artId ? '[ ' + artId + ' ]' : '';
      return;
    }
    var img = document.createElement('img');
    img.alt = entry.alt || '';
    img.width = entry.w || 640;
    img.height = entry.h || 360;
    img.addEventListener('error', function () {
      /* Missing file: placeholder, never block (constraint 9). */
      artEl.innerHTML = '';
      artEl.textContent = '[ ' + artId + ' ]';
    });
    img.src = entry.file;
    artEl.appendChild(img);
  }

  /* ---- render ---- */
  function render(chapter, scene, opts) {
    opts = opts || {};
    CH.eras.apply(chapter.era || 'warm');
    document.getElementById('scene-speaker').textContent = scene.speaker || '';
    renderArt(scene.art);
    if (opts.quiet) {
      /* Returning from the menu: full text, no replayed audio. */
      stopTyping();
      document.getElementById('scene-text').textContent = scene.text || '';
    } else {
      startTyping(scene.text || '');
      CH.audio.playLine(scene.audio);
    }
  }

  return {
    startChapter: function (chapterId) {
      var chapter = findChapter(chapterId);
      if (!chapter || !chapter.scenes || !chapter.scenes.length) {
        CH.screens.contentError(
          'Chapter "' + chapterId + '" is missing or has no scenes',
          'Check src/content/story.js — every chapter needs an id and at least one scene.'
        );
        return;
      }
      this.show(chapterId, chapter.scenes[0].id);
    },

    show: function (chapterId, sceneId, opts) {
      var chapter = findChapter(chapterId);
      var scene = findScene(chapter, sceneId);
      if (!scene) {
        CH.screens.contentError(
          'Scene "' + sceneId + '" was not found in chapter "' + chapterId + '"',
          'A "next" in src/content/story.js points at a scene id that does not exist. ' +
          'Check the spelling on both ends.'
        );
        return;
      }
      CH.audio.ensureChapter(chapter);

      var d = CH.state.get();
      d.chapter = chapterId;
      d.scene = sceneId;
      d.screen = 'scene';
      CH.state.save();

      render(chapter, scene, opts);
      CH.screens.show('scene');
    },

    resume: function () {
      var d = CH.state.get();
      /* Put the player back where the autosave left them. */
      if (d.screen === 'room' && d.room) { CH.rooms.enter(d.room); return; }
      if (d.screen === 'puzzle' && d.puzzle) { CH.puzzles.show(d.puzzle); return; }
      if (d.chapter && d.scene) this.show(d.chapter, d.scene);
      else this.startFirstChapter();
    },

    /* Re-show the current scene after the menu, without restarting it. */
    backToScene: function () {
      var d = CH.state.get();
      if (d.chapter && d.scene) this.show(d.chapter, d.scene, { quiet: true });
      else CH.screens.show('title');
    },

    startFirstChapter: function () {
      var chapters = (window.STORY && window.STORY.chapters) || [];
      if (!chapters.length) {
        CH.screens.contentError(
          'The story file has no chapters',
          'src/content/story.js must define window.STORY with at least one chapter.'
        );
        return;
      }
      this.startChapter(chapters[0].id);
    },

    /* The one input verb on a scene: skip the typewriter if it is
       running, otherwise advance to whatever comes next. */
    skipOrAdvance: function () {
      if (typer.active) { finishTyping(); return; }
      this.advance();
    },

    advance: function () {
      var d = CH.state.get();
      var chapter = findChapter(d.chapter);
      var scene = findScene(chapter, d.scene);
      if (!scene) return;

      stopTyping();

      /* Episode 4's hard cut: the first advance past the cut scene
         kills the audio dead and shows NO SIGNAL; the next advance
         moves on. The audio file itself should end mid-word. */
      var nosignal = document.getElementById('nosignal');
      if (scene.effect === 'static_cut' && nosignal.hidden) {
        CH.audio.stop();
        document.getElementById('scene-text').textContent = '';
        document.getElementById('scene-speaker').textContent = '';
        nosignal.hidden = false;
        return;
      }
      if (!nosignal.hidden) nosignal.hidden = true;

      var next = scene.next;

      if (next == null || next.end) {
        CH.audio.stop();
        CH.screens.show('title');
        return;
      }
      if (typeof next === 'string') {
        this.show(d.chapter, next);
        return;
      }
      if (next.room) {
        CH.audio.stop();
        CH.rooms.enter(next.room);
        return;
      }
      if (next.puzzle) {
        CH.audio.stop();
        CH.puzzles.show(next.puzzle);
        return;
      }
      CH.screens.contentError(
        'Scene "' + scene.id + '" has a "next" the game does not understand',
        'In src/content/story.js, "next" must be a scene id in quotes, ' +
        '{ room: \'id\' }, { puzzle: \'ID\' }, or { end: true }.'
      );
    }
  };
})();
