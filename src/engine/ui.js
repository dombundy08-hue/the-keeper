/* Curiosity Hour engine — UI layer: custom pixel cursor + UI sounds.

   Cursor: the OS pointer is hidden across the whole game surface
   (cursor: none in CSS); a pixel-art cursor drawn from the maps below
   tracks the real pointer on pointermove. It lives INSIDE the scaled
   stage, so it pixelates and scales with everything else. Two states:
   the pointing hand everywhere, the magnifier in room view.

   Sounds: hover (pointer enters a button, or keyboard focus reaches
   one), select (activate), back (escape / backing out), denied
   (rejected code). Keyboard players hear exactly what mouse players
   hear. Everything obeys global volume + mute — and in the notebook
   era, ALL of it goes silent. That silence is deliberate. */

window.CH = window.CH || {};

CH.ui = (function () {

  var PX = 2;   /* logical pixels per sprite cell, in 640x360 space */

  var COLORS = {
    o: '#14110F',                    /* ink outline */
    c: '#E8DFC8',                    /* cream fill */
    g: 'rgba(182, 199, 190, 0.35)',  /* lens glass */
    h: '#D9A441'                     /* marigold handle */
  };

  var SPRITES = {
    hand: {
      hotspot: [3, 0],               /* fingertip, in cells */
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
      hotspot: [4, 4],               /* lens centre, in cells */
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

  function applySprite() {
    var sprite = SPRITES[mode];
    cursorEl.style.boxShadow = shadowsFor(sprite);
    cursorEl.dataset.hx = sprite.hotspot[0] * PX;
    cursorEl.dataset.hy = sprite.hotspot[1] * PX;
  }

  function moveCursor(ev) {
    var stage = document.getElementById('stage');
    var rect = stage.getBoundingClientRect();
    if (!rect.width) return;   /* window not laid out yet */
    /* convert window coords into 640x360 stage space */
    var scale = rect.width / 640;
    var x = (ev.clientX - rect.left) / scale - Number(cursorEl.dataset.hx);
    var y = (ev.clientY - rect.top) / scale - Number(cursorEl.dataset.hy);
    cursorEl.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
    cursorEl.style.display = 'block';
  }

  /* ---- sounds ---- */

  var lastHover = null;     /* button the pointer is currently inside */
  var lastKeyNav = 0;       /* when Tab/arrows were last pressed */

  function silent() {
    return document.body.getAttribute('data-era') === 'notebook';
  }
  function play(id, scale) {
    if (silent()) return;
    CH.audio.playUi(id, scale);
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

    init: function () {
      /* cursor */
      cursorEl = document.createElement('div');
      cursorEl.id = 'cursor';
      cursorEl.setAttribute('aria-hidden', 'true');
      document.getElementById('stage').appendChild(cursorEl);
      applySprite();
      document.addEventListener('pointermove', moveCursor);
      document.addEventListener('pointerdown', moveCursor);
      document.documentElement.addEventListener('pointerleave', function () {
        cursorEl.style.display = 'none';
      });

      /* hover: once per button entry, never while moving inside one */
      document.addEventListener('pointerover', function (ev) {
        var btn = ev.target && ev.target.closest ? ev.target.closest('button') : null;
        if (btn && btn !== lastHover) {
          lastHover = btn;
          play('ui_hover', 0.5);   /* half volume: it fires the most */
        }
      });
      document.addEventListener('pointerout', function (ev) {
        if (lastHover && !(ev.relatedTarget && lastHover.contains(ev.relatedTarget))) {
          lastHover = null;
        }
      });

      /* keyboard focus counts as hover — but only when focus moved by
         keys, so programmatic focus on screen changes stays quiet */
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

      /* activation: click (mouse or Enter-on-button both land here).
         Capture phase, so the sound reflects the era the click happened
         in — not the era the button switches to. */
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
