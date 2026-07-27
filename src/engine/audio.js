/* Curiosity Hour engine — audio, governed.

   EVERY sound in the game routes through this file; nothing else may
   call .play(). Two channels:

   - The voice channel: one line at a time (playLine). Lines may
     legitimately run long, so the watchdog does not apply — but mute
     silences them instantly.

   - The SFX channel (playUi / playOverlay / effects): governed hard.
     One element per sound id, never recreated. Replaying a sound
     stops and restarts it — a sound can never layer with itself.
     loop is force-cleared on every play. At most 3 SFX at once; a
     fourth drops the oldest. A watchdog force-stops any SFX still
     playing after 3000ms — no legitimate effect here exceeds the
     2.04s static bed, so nothing correct ever trips it; it exists so
     that whatever breaks years from now, the noise stops on its own.

   stopAllSfx() runs on every screen unmount and every era change.
   Short UI blips (≤250ms, tagged 'ui') are allowed to finish across a
   navigation — they are single-instance and watchdogged, so they
   cannot run away; killing them made every button click cut itself
   off. Long effects (tagged 'fx') are stopped dead.

   Mute stops sound ALREADY PLAYING, immediately — not just future
   playback. The M key (wired in screens.js) toggles it from any
   screen. */

window.CH = window.CH || {};

CH.audio = (function () {
  var cache = {};          /* audio id -> the ONE element for that id */
  var current = null;      /* the voice line playing right now */
  var problems = [];       /* { id, why } for the dev screen */

  var active = [];         /* governed SFX: { id, el, kind, watchdog } */
  var pendingTimers = [];  /* delayed-start timers (playOverlay) */
  var MAX_CONCURRENT = 3;
  var WATCHDOG_MS = 3000;

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
      note(id, 'not listed in manifest.js — plays silently');
      return null;
    }
    var el = new Audio();
    el.preload = 'auto';
    el.addEventListener('error', function () {
      note(id, 'file missing or unreadable (' + entry.file + ') — plays silently');
    });
    el.src = entry.file;
    cache[id] = el;
    return el;
  }

  function settings() { return CH.state.get().settings; }

  /* ---- the governor ---- */

  function stopEntry(entry) {
    try { entry.el.pause(); entry.el.currentTime = 0; } catch (e) {}
    if (entry.watchdog) clearTimeout(entry.watchdog);
    var i = active.indexOf(entry);
    if (i !== -1) active.splice(i, 1);
  }

  function stopById(id) {
    for (var i = active.length - 1; i >= 0; i--) {
      if (active[i].id === id) stopEntry(active[i]);
    }
  }

  /* kind: 'ui' (sub-250ms blips) or 'fx' (anything longer) */
  function playSfx(id, volumeScale, kind) {
    var s = settings();
    if (s.muted) return;
    var el = getElement(id);
    if (!el) return;

    stopById(id);                              /* never layers with itself */
    while (active.length >= MAX_CONCURRENT) {  /* cap: drop the oldest */
      stopEntry(active[0]);
    }

    var entry = { id: id, el: el, kind: kind || 'fx', watchdog: null };
    try {
      el.loop = false;                         /* structurally: never loops */
      el.muted = false;
      el.volume = Math.max(0, Math.min(1, s.volume * (volumeScale || 1)));
      el.currentTime = 0;
      var p = el.play();
      if (p && p.catch) p.catch(function () {});
    } catch (e) { return; }

    entry.watchdog = setTimeout(function () { stopEntry(entry); }, WATCHDOG_MS);
    el.onended = function () { stopEntry(entry); };
    active.push(entry);
  }

  return {
    problems: problems,

    /* ---- voice channel ---- */

    ensureChapter: function (chapter) {
      if (!chapter || !chapter.scenes) return;
      for (var i = 0; i < chapter.scenes.length; i++) {
        var id = chapter.scenes[i].audio;
        if (id) getElement(id);
      }
    },

    playLine: function (id) {
      this.stop();
      if (!id) return;
      var el = getElement(id);
      if (!el) return;
      var s = settings();
      el.loop = false;
      el.volume = s.volume;
      el.muted = !!s.muted;
      current = el;
      try {
        el.currentTime = 0;
        var p = el.play();
        if (p && p.catch) {
          p.catch(function () {
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

    /* ---- SFX channel, governed ---- */

    playUi: function (id, volumeScale) {
      playSfx(id, volumeScale, 'ui');
    },

    /* An effect layered over the voice (static bursts). delayMs is
       presentation timing; the timer is OWNED — stopAllSfx clears it. */
    playOverlay: function (id, delayMs, volumeScale) {
      var scale = volumeScale || 0.6;
      if (!delayMs) { playSfx(id, scale, 'fx'); return; }
      var t = setTimeout(function () {
        var i = pendingTimers.indexOf(t);
        if (i !== -1) pendingTimers.splice(i, 1);
        playSfx(id, scale, 'fx');
      }, delayMs);
      pendingTimers.push(t);
    },

    stopSfx: stopById,

    /* Every screen unmount and every era change. 'ui' blips may
       finish (they die in <250ms and cannot run away); 'fx' stops dead. */
    stopAllSfx: function () {
      for (var i = pendingTimers.length - 1; i >= 0; i--) {
        clearTimeout(pendingTimers[i]);
      }
      pendingTimers.length = 0;
      for (var j = active.length - 1; j >= 0; j--) {
        if (active[j].kind === 'fx') stopEntry(active[j]);
      }
    },

    /* Mute stops sound already playing — the panic path. */
    setMuted: function (muted) {
      var s = settings();
      s.muted = !!muted;
      CH.state.save();
      if (muted) {
        this.stopAllSfx();
        for (var i = active.length - 1; i >= 0; i--) stopEntry(active[i]);
        if (current) { try { current.muted = true; } catch (e) {} }
      } else if (current) {
        try { current.muted = false; } catch (e) {}
      }
    },
    toggleMute: function () {
      var next = !settings().muted;
      this.setMuted(next);
      return next;
    },

    applySettings: function () {
      var s = settings();
      if (current) {
        current.volume = s.volume;
        current.muted = !!s.muted;
      }
    },

    /* Autoplay unlock: primes every short-sound element on the first
       real user gesture (Safari unlocks per element). */
    unlock: function () {
      var ids = ['ui_hover', 'ui_select', 'ui_back', 'ui_denied',
                 'bug_static_short', 'bug_static_long', 'bug_static_bed_2s'];
      for (var i = 0; i < ids.length; i++) {
        (function (el) {
          if (!el) return;
          try {
            el.muted = true;
            var p = el.play();
            if (p && p.then) {
              p.then(function () {
                el.pause();
                el.currentTime = 0;
                el.muted = false;
              }).catch(function () { el.muted = false; });
            }
          } catch (e) {}
        })(getElement(ids[i]));
      }
    }
  };
})();
