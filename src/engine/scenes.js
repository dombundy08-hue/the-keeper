/* Curiosity Hour engine — scene player core.
   Milestone 1: look up scenes by id, render text, advance, autosave.
   Typewriter, audio, and subtitles arrive in milestone 2. */

window.CH = window.CH || {};

CH.scenes = (function () {

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

  function render(chapter, scene) {
    document.body.setAttribute('data-era', chapter.era || 'warm');

    var speakerEl = document.getElementById('scene-speaker');
    var textEl = document.getElementById('scene-text');
    var artEl = document.getElementById('scene-art');

    speakerEl.textContent = scene.speaker || '';
    textEl.textContent = scene.text || '';

    /* Real art arrives with the asset pass; the placeholder names what
       should be here so a missing image is diagnosable, not blank. */
    artEl.textContent = scene.art ? '[ ' + scene.art + ' ]' : '';
  }

  return {
    /* Start a chapter from its first scene. */
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

    /* Show a specific scene and autosave the position. */
    show: function (chapterId, sceneId) {
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
      var d = CH.state.get();
      d.chapter = chapterId;
      d.scene = sceneId;
      d.screen = 'scene';
      CH.state.save();

      render(chapter, scene);
      CH.screens.show('scene');
    },

    /* Resume from wherever the save left off. */
    resume: function () {
      var d = CH.state.get();
      if (d.chapter && d.scene) {
        this.show(d.chapter, d.scene);
      } else {
        this.startFirstChapter();
      }
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

    /* Advance past the current scene by following its `next`.
       `next` is one of: 'scene_id', { room: 'id' }, { puzzle: 'ID' },
       { end: true }, or null (treated as end of chapter). */
    advance: function () {
      var d = CH.state.get();
      var chapter = findChapter(d.chapter);
      var scene = findScene(chapter, d.scene);
      if (!scene) return;

      var next = scene.next;

      if (next == null || next.end) {
        /* End of the line for milestone 1: back to the title.
           Later milestones route this into chapter transitions. */
        CH.screens.show('title');
        return;
      }
      if (typeof next === 'string') {
        this.show(d.chapter, next);
        return;
      }
      if (next.room) {
        /* Room view is milestone 3. Park politely rather than crash. */
        CH.screens.notYet('The room "' + next.room + '" is not built yet (milestone 3).');
        return;
      }
      if (next.puzzle) {
        /* Puzzle screen is milestone 4. */
        CH.screens.notYet('The puzzle "' + next.puzzle + '" is not built yet (milestone 4).');
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
