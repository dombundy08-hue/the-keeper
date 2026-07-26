/* Curiosity Hour engine — top-level screen router and the screens that
   exist in milestone 1: title, scene shell, code entry stub, Keeper's Key,
   and the plain-English error screen. */

window.CH = window.CH || {};

CH.screens = (function () {
  var NAMES = ['title', 'scene', 'code', 'key', 'error'];
  var current = null;

  function el(id) { return document.getElementById(id); }

  function refreshTitle() {
    var btnContinue = el('btn-continue');
    if (btnContinue) btnContinue.hidden = !CH.state.hasSave();
  }

  function refreshKeyScreen() {
    var out = el('key-current');
    if (out) out.value = CH.key.encode(CH.state.get());
    var fb = el('key-feedback');
    if (fb) { fb.textContent = ''; fb.className = 'feedback'; }
  }

  return {
    show: function (name) {
      for (var i = 0; i < NAMES.length; i++) {
        var section = el('screen-' + NAMES[i]);
        if (section) section.hidden = (NAMES[i] !== name);
      }
      current = name;

      if (name === 'title') {
        document.body.setAttribute('data-era', 'warm');
        refreshTitle();
      }
      if (name === 'key') refreshKeyScreen();

      /* Move focus somewhere sensible for keyboard players. */
      var focusTarget = {
        title: 'btn-begin',
        code: 'code-input',
        key: 'key-input'
      }[name];
      if (focusTarget && el(focusTarget)) el(focusTarget).focus();
    },

    currentScreen: function () { return current; },

    /* A content mistake, reported kindly. Never a white screen. */
    contentError: function (what, how) {
      var report = el('error-report');
      if (report) {
        report.innerHTML = '';
        var item = document.createElement('div');
        item.className = 'error-item';
        var strong = document.createElement('strong');
        strong.textContent = what + '.';
        var p = document.createElement('p');
        p.textContent = how;
        item.appendChild(strong);
        item.appendChild(p);
        report.appendChild(item);
      }
      this.show('error');
    },

    /* Milestone scaffolding: a friendly dead end for unbuilt features. */
    notYet: function (message) {
      this.contentError('Under construction', message);
    },

    /* Wire every button once at boot. */
    init: function () {
      var self = this;

      el('btn-begin').addEventListener('click', function () {
        CH.state.set(CH.state.fresh());
        CH.scenes.startFirstChapter();
      });
      el('btn-continue').addEventListener('click', function () {
        if (CH.state.load()) CH.scenes.resume();
        else self.show('title');
      });
      el('btn-code').addEventListener('click', function () { self.show('code'); });
      el('btn-key').addEventListener('click', function () { self.show('key'); });

      /* Scene: click anywhere or Enter/Space advances. */
      el('screen-scene').addEventListener('click', function () {
        CH.scenes.advance();
      });

      /* Code entry (full gate logic lands with the puzzle milestone). */
      el('btn-code-back').addEventListener('click', function () { self.show('title'); });
      el('btn-code-submit').addEventListener('click', function () {
        var fb = el('code-feedback');
        fb.textContent = 'That is not a code the Keeper knows. Check the letters again.';
        fb.className = 'feedback bad';
      });

      /* Keeper's Key */
      el('btn-key-back').addEventListener('click', function () { self.show('title'); });
      el('btn-key-copy').addEventListener('click', function () {
        var out = el('key-current');
        out.select();
        var copied = false;
        try { copied = document.execCommand('copy'); } catch (e) {}
        if (!copied && navigator.clipboard && navigator.clipboard.writeText) {
          /* clipboard API needs a secure context; on file:// the
             execCommand path above is the one that works. */
          navigator.clipboard.writeText(out.value);
          copied = true;
        }
        var fb = el('key-feedback');
        fb.textContent = copied ? 'Copied. Keep it somewhere safe.'
                                : 'Could not copy — select the key and copy it yourself.';
        fb.className = 'feedback ' + (copied ? 'good' : 'bad');
      });
      el('btn-key-print').addEventListener('click', function () {
        window.print();
      });
      el('btn-key-load').addEventListener('click', function () {
        var result = CH.key.decode(el('key-input').value);
        var fb = el('key-feedback');
        if (!result.ok) {
          fb.textContent = result.why;
          fb.className = 'feedback bad';
          return;
        }
        CH.state.set(result.state);
        fb.textContent = 'Key accepted. Welcome back.';
        fb.className = 'feedback good';
        CH.scenes.resume();
      });

      /* Global keyboard: Enter/Space advance scenes, Esc backs out to title. */
      document.addEventListener('keydown', function (ev) {
        var tag = (ev.target && ev.target.tagName) || '';
        var typing = tag === 'INPUT' || tag === 'TEXTAREA';

        if (current === 'scene' && !typing &&
            (ev.key === 'Enter' || ev.key === ' ')) {
          ev.preventDefault();
          CH.scenes.advance();
        }
        if (ev.key === 'Escape' && current !== 'title' && current !== 'error') {
          self.show('title');
        }
        if (current === 'code' && typing && ev.key === 'Enter') {
          el('btn-code-submit').click();
        }
      });
    }
  };
})();
