/* Curiosity Hour engine — UI layer: custom pixel cursor, UI sounds,
   audio unlock, and the title wordmark glitch.

   Cursor: fixed-position, driven ONLY by pointer client coordinates
   plus window math — no element rects involved, so there is nothing
   to go stale or divide by zero. The sprite scales with the same
   integer factor as the stage. Hand everywhere, magnifier in rooms.

   Sounds: hover (once per button entry, keyboard focus included, half
   volume), select, back, denied. Browsers block audio until the page
   receives a real user gesture, so the first pointerdown/keydown of
   the session primes every UI sound element (play+pause, muted) —
   this matters on Safari, which unlocks per element. The very first
   hover of a session, before any gesture, stays silent; that is a
   browser rule, not a bug.

   Wordmark glitch: while the title screen is mounted (and not in the
   notebook era), HOUR becomes HORROR for ~150ms every 30s ± 4s, with
   a quiet static burst. Cosmetic only — nothing gates on it. The
   hand-authored bugflicker in story.js is a separate thing. */

window.CH = window.CH || {};

CH.ui = (function () {

  var PX = 2;   /* logical pixels per sprite cell */

  var COLORS = {
    o: '#14110F',                    /* ink outline */
    c: '#E8DFC8',                    /* cream fill */
    g: 'rgba(182, 199, 190, 0.35)',  /* lens glass */
    h: '#D9A441'                     /* marigold handle */
  };

  var SPRITES = {
    hand: {
      hotspot: [3, 0],
      map: [
        '...oo....',
        '..occo...',
        '..occo...',
        '..occooo.',
        '..occocco',
        '.ooccccco',
        '.occcccco',
        '.occcccco',
        '..occccco',
        '..occccco',
        '...ooooo.'
      ]
    },
    magnifier: {
      hotspot: [4, 4],
      map: [
        '..oooo....',
        '.oggggo...',
        'oggggggo..',
        'oggggggo..',
        'oggggggo..',
        'oggggggo..',
        '.oggggo...',
        '..oooohh..',
        '.......hh.',
        '........hh'
      ]
    }
  };

  function shadowsFor(sprite) {
    var out = [];
    for (var y = 0; y < sprite.map.length; y++) {
      var row = sprite.map[y];
      for (var x = 0; x < row.length; x++) {
        var color = COLORS[row.charAt(x)];
        if (color) out.push((x * PX) + 'px ' + (y * PX) + 'px 0 ' + color);
      }
    }
    return out.join(', ');
  }

  var cursorEl = null;
  var mode = 'hand';
  var hotX = 0, hotY = 0;

  function applySprite() {
    var sprite = SPRITES[mode];
    cursorEl.style.boxShadow = shadowsFor(sprite);
    hotX = sprite.hotspot[0] * PX;
    hotY = sprite.hotspot[1] * PX;
  }

  /* Same integer scale the stage uses — pure window math, no DOM reads. */
  function stageScale() {
    var s = Math.floor(Math.min(window.innerWidth / 640, window.innerHeight / 360));
    return s < 1 ? 1 : s;
  }

  function moveCursor(ev) {
    var s = stageScale();
    cursorEl.style.transform =
      'translate(' + (ev.clientX - hotX * s) + 'px, ' +
                     (ev.clientY - hotY * s) + 'px) scale(' + s + ')';
    cursorEl.style.display = 'block';
  }

  /* ---- sounds ---- */

  var lastHover = null;
  var lastKeyNav = 0;

  function silent() {
    return document.body.getAttribute('data-era') === 'notebook';
  }
  function play(id, scale) {
    if (silent()) return;
    CH.audio.playUi(id, scale);
  }

  /* ---- title wordmark glitch ---- */

  var glitchTimer = null;
  var glitchRevert = null;

  function reducedMotion() {
    return window.matchMedia &&
           window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function revertWordmark() {
    var span = document.getElementById('wordmark-hour');
    if (span) {
      span.textContent = 'HOUR';
      span.classList.remove('glitching');
    }
  }

  function fireGlitch() {
    var span = document.getElementById('wordmark-hour');
    if (span && !silent() && !reducedMotion()) {
      span.textContent = 'HORROR';
      span.classList.add('glitching');
      CH.audio.playOverlay('bug_static_short', 0);
      glitchRevert = setTimeout(revertWordmark, 150);
    }
    scheduleGlitch();   /* jittered: a metronome reads as a clock */
  }

  function scheduleGlitch() {
    glitchTimer = setTimeout(fireGlitch, 26000 + Math.random() * 8000);
  }

  return {
    setMode: function (next) {
      if (next !== mode && SPRITES[next]) {
        mode = next;
        if (cursorEl) applySprite();
      }
    },

    back: function () { play('ui_back'); },
    select: function () { play('ui_select'); },
    denied: function () { play('ui_denied'); },

    /* title-screen mount/unmount hooks (called by screens.show) */
    startTitleGlitch: function () {
      if (!glitchTimer) scheduleGlitch();
    },
    stopTitleGlitch: function () {
      if (glitchTimer) { clearTimeout(glitchTimer); glitchTimer = null; }
      if (glitchRevert) { clearTimeout(glitchRevert); glitchRevert = null; }
      revertWordmark();
    },
    /* test hook: fire the glitch immediately */
    glitchNow: fireGlitch,

    init: function () {
      /* cursor — fixed position, above everything, ignores hit testing */
      cursorEl = document.createElement('div');
      cursorEl.id = 'cursor';
      cursorEl.setAttribute('aria-hidden', 'true');
      document.body.appendChild(cursorEl);
      applySprite();
      document.addEventListener('pointermove', moveCursor);
      document.addEventListener('pointerdown', moveCursor);
      document.documentElement.addEventListener('mouseleave', function () {
        cursorEl.style.display = 'none';
      });

      /* audio unlock on the first real gesture of the session */
      var unlocked = false;
      function firstGesture() {
        if (unlocked) return;
        unlocked = true;
        CH.audio.unlock();
        document.removeEventListener('pointerdown', firstGesture, true);
        document.removeEventListener('keydown', firstGesture, true);
      }
      document.addEventListener('pointerdown', firstGesture, true);
      document.addEventListener('keydown', firstGesture, true);

      /* hover: once per button entry, never while moving inside one */
      document.addEventListener('pointerover', function (ev) {
        var btn = ev.target && ev.target.closest ? ev.target.closest('button') : null;
        if (btn && btn !== lastHover) {
          lastHover = btn;
          play('ui_hover', 0.5);
        }
      });
      document.addEventListener('pointerout', function (ev) {
        if (lastHover && !(ev.relatedTarget && lastHover.contains(ev.relatedTarget))) {
          lastHover = null;
        }
      });

      /* keyboard focus counts as hover — only when moved by keys */
      document.addEventListener('keydown', function (ev) {
        if (ev.key === 'Tab' || ev.key.indexOf('Arrow') === 0) {
          lastKeyNav = performance.now();
        }
      });
      document.addEventListener('focusin', function (ev) {
        var t = ev.target;
        if (t && t.tagName === 'BUTTON' && t !== lastHover &&
            performance.now() - lastKeyNav < 400) {
          play('ui_hover', 0.5);
        }
      });

      /* activation: capture phase, so the sound reflects the era the
         click happened in, not the era the button switches to */
      document.addEventListener('click', function (ev) {
        var btn = ev.target && ev.target.closest ? ev.target.closest('button') : null;
        if (!btn) return;
        if (btn.id === 'keyhole') return;          /* the keyhole stays silent */
        if (btn.id === 'btn-code-submit') return;  /* plays select or denied itself */
        play(btn.classList.contains('back') ? 'ui_back' : 'ui_select');
      }, true);
    }
  };
})();
