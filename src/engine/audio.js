/* Curiosity Hour engine — audio.
   One <audio> element per line, preloaded per chapter. A missing or
   failed file NEVER blocks anything: log it, skip it, keep going.
   Volume and mute live in state.settings and persist. */

window.CH = window.CH || {};

CH.audio = (function () {
  var cache = {};        /* audio id -> HTMLAudioElement */
  var current = null;    /* the element playing right now */
  var problems = [];     /* { id, why } for the dev screen */

  function manifestEntry(id) {
    return (window.ASSETS && window.ASSETS.audio && window.ASSETS.audio[id]) || null;
  }

  function note(id, why) {
    problems.push({ id: id, why: why });
    if (window.console && console.warn) {
      console.warn('[audio] ' + id + ': ' + why);
    }
  }

  function getElement(id) {
    if (cache[id]) return cache[id];
    var entry = manifestEntry(id);
    if (!entry) {
      note(id, 'not listed in manifest.js — line plays silently');
      return null;
    }
    var el = new Audio();
    el.preload = 'auto';
    el.addEventListener('error', function () {
      note(id, 'file missing or unreadable (' + entry.file + ') — line plays silently');
    });
    el.src = entry.file;
    cache[id] = el;
    return el;
  }

  return {
    problems: problems,

    /* Warm the cache for every audio line in a chapter. Safe to call
       repeatedly; already-cached ids are skipped. */
    ensureChapter: function (chapter) {
      if (!chapter || !chapter.scenes) return;
      for (var i = 0; i < chapter.scenes.length; i++) {
        var id = chapter.scenes[i].audio;
        if (id) getElement(id);
      }
    },

    applySettings: function () {
      var s = CH.state.get().settings;
      if (current) {
        current.volume = s.volume;
        current.muted = !!s.muted;
      }
    },

    /* Play the line for a scene. Any failure is silent-but-logged. */
    playLine: function (id) {
      this.stop();
      if (!id) return;
      var el = getElement(id);
      if (!el) return;
      var s = CH.state.get().settings;
      el.volume = s.volume;
      el.muted = !!s.muted;
      current = el;
      try {
        el.currentTime = 0;
        var p = el.play();
        if (p && p.catch) {
          p.catch(function () {
            /* Autoplay policies can refuse the very first play before any
               click. The player clicked Begin to get here, so this is rare;
               either way the text is always on screen. */
            note(id, 'browser refused playback — line plays silently');
          });
        }
      } catch (e) {
        note(id, 'playback error — line plays silently');
      }
    },

    stop: function () {
      if (current) {
        try { current.pause(); } catch (e) {}
        current = null;
      }
    },

    /* Short UI feedback sound. Never interrupts the voice line;
       respects global volume and mute; failures stay silent. */
    playUi: function (id, volumeScale) {
      var el = getElement(id);
      if (!el) return;
      var s = CH.state.get().settings;
      if (s.muted) return;
      try {
        el.volume = Math.max(0, Math.min(1, s.volume * (volumeScale || 1)));
        el.currentTime = 0;
        var p = el.play();
        if (p && p.catch) p.catch(function () {});
      } catch (e) {}
    },

    /* A short sound layered OVER the current line (the bug's static
       burst). Never interrupts the voice; failures stay silent.
       delayMs is presentation timing only, never a gate. */
    playOverlay: function (id, delayMs) {
      var el = getElement(id);
      if (!el) return;
      var s = CH.state.get().settings;
      setTimeout(function () {
        try {
          el.volume = s.volume * 0.6;
          el.muted = !!s.muted;
          el.currentTime = 0;
          var p = el.play();
          if (p && p.catch) p.catch(function () {});
        } catch (e) {}
      }, delayMs || 0);
    }
  };
})();
