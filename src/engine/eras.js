/* Curiosity Hour engine — eras.
   One stylesheet, four states, driven by data-era on <body>.
   The broadcast chrome (frame, scanlines, channel bug, tracking)
   degrades era by era and vanishes entirely in the notebook era. */

window.CH = window.CH || {};

CH.eras = (function () {

  /* The channel bug's text decays with the signal. */
  var BUG_TEXT = {
    warm:     'CH•7 CURIOSITY HOUR',
    cooling:  'CH•7 CURIOSITY HOUR',
    cold:     'C •7 CUR OSI Y H UR',
    notebook: ''
  };

  function eraForChapter(chapterId) {
    var chapters = (window.STORY && window.STORY.chapters) || [];
    for (var i = 0; i < chapters.length; i++) {
      if (chapters[i].id === chapterId) return chapters[i].era || 'warm';
    }
    return 'warm';
  }

  return {
    eraForChapter: eraForChapter,

    apply: function (era) {
      era = era || 'warm';
      document.body.setAttribute('data-era', era);
      var bug = document.getElementById('chrome-bug');
      if (bug) bug.textContent = BUG_TEXT[era] != null ? BUG_TEXT[era] : BUG_TEXT.warm;
    },

    applyForChapter: function (chapterId) {
      this.apply(eraForChapter(chapterId));
    },

    /* One-shot channel-bug stutter (Episode 1's first hardware lie).
       The CSS animation carries its own delay so it lands mid-line;
       prefers-reduced-motion kills the visual, the static still plays. */
    bugFlicker: function () {
      var bug = document.getElementById('chrome-bug');
      if (!bug) return;
      bug.classList.remove('flicker-burst');
      /* force a reflow so re-adding the class restarts the animation */
      void bug.offsetWidth;
      bug.classList.add('flicker-burst');
      CH.audio.playOverlay('bug_static_short', 1400);
    },

    /* The title screen wears the era of the furthest chapter the
       player has unlocked — the menu itself decays as the hunt goes. */
    applyForTitle: function () {
      /* Once the last broadcast has aired, even the menu is paper. */
      if (CH.notebook && CH.notebook.isOpenToPlayer()) {
        this.apply('notebook');
        return;
      }
      var chapters = (window.STORY && window.STORY.chapters) || [];
      var era = 'warm';
      for (var i = 0; i < chapters.length; i++) {
        var ch = chapters[i];
        if (!ch.unlockedBy || CH.state.isUnlocked(ch.id)) {
          era = ch.era || era;
        }
      }
      this.apply(era);
    }
  };
})();
