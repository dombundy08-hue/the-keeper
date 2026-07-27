/* Curiosity Hour engine — top-level screen router: title, scene, code
   entry, Keeper's Key, settings, and the plain-English error screen. */

window.CH = window.CH || {};

CH.screens = (function () {
  var NAMES = ['title', 'scene', 'code', 'key', 'settings', 'error'];
  var current = null;
  var settingsReturnTo = 'title';   /* where Back goes from the menu */

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

  function refreshSettings() {
    var s = CH.state.get().settings;
    el('set-volume').value = String(Math.round(s.volume * 100));
    el('set-mute').checked = !!s.muted;
    el('set-speed').value = s.textSpeed;
  }

  function leaveSettings() {
    if (settingsReturnTo === 'scene') CH.scenes.backToScene();
    else CH.screens.show('title');
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
      if (name === 'settings') refreshSettings();

      var focusTarget = {
        title: 'btn-begin',
        code: 'code-input',
        key: 'key-input',
        settings: 'set-volume'
      }[name];
      if (focusTarget && el(focusTarget)) el(focusTarget).focus();
    },

    currentScreen: function () { return current; },

    openSettings: function (returnTo) {
      settingsReturnTo = returnTo || 'title';
      this.show('settings');
    },

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

    notYet: function (message) {
      this.contentError('Under construction', message);
    },

    init: function () {
      var self = this;

      /* Title */
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
      el('btn-settings').addEventListener('click', function () {
        self.openSettings('title');
      });

      /* Scene: click skips the typewriter, then advances. */
      el('screen-scene').addEventListener('click', function () {
        CH.scenes.skipOrAdvance();
      });

      /* Code entry (real gate logic lands in milestone 4). */
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
          navigator.clipboard.writeText(out.value);
          copied = true;
        }
        var fb = el('key-feedback');
        fb.textContent = copied ? 'Copied. Keep it somewhere safe.'
                                : 'Could not copy — select the key and copy it yourself.';
        fb.className = 'feedback ' + (copied ? 'good' : 'bad');
      });
      el('btn-key-print').addEventListener('click', function () { window.print(); });
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

      /* Settings */
      el('set-volume').addEventListener('input', function () {
        var s = CH.state.get().settings;
        s.volume = Number(this.value) / 100;
        CH.state.save();
        CH.audio.applySettings();
      });
      el('set-mute').addEventListener('change', function () {
        var s = CH.state.get().settings;
        s.muted = this.checked;
        CH.state.save();
        CH.audio.applySettings();
      });
      el('set-speed').addEventListener('change', function () {
        var s = CH.state.get().settings;
        s.textSpeed = this.value;
        CH.state.save();
      });
      el('btn-settings-back').addEventListener('click', leaveSettings);
      el('btn-settings-title').addEventListener('click', function () {
        CH.audio.stop();
        self.show('title');
      });
      el('btn-restart').addEventListener('click', function () {
        var fb = el('settings-feedback');
        if (!el('btn-restart').dataset.armed) {
          el('btn-restart').dataset.armed = '1';
          el('btn-restart').textContent = 'Really restart? This erases everything';
          fb.textContent = 'Tip: save your Keeper\'s Key first if you might change your mind.';
          return;
        }
        delete el('btn-restart').dataset.armed;
        el('btn-restart').textContent = 'Restart the game';
        fb.textContent = '';
        CH.audio.stop();
        CH.state.reset();
        self.show('title');
      });

      /* Global keyboard */
      document.addEventListener('keydown', function (ev) {
        var tag = (ev.target && ev.target.tagName) || '';
        var typing = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';

        if (current === 'scene' && !typing &&
            (ev.key === 'Enter' || ev.key === ' ')) {
          ev.preventDefault();
          CH.scenes.skipOrAdvance();
        }
        if (ev.key === 'Escape') {
          if (current === 'scene') self.openSettings('scene');
          else if (current === 'settings') leaveSettings();
          else if (current !== 'title' && current !== 'error') self.show('title');
        }
        if (current === 'code' && typing && ev.key === 'Enter') {
          el('btn-code-submit').click();
        }
      });
    }
  };
})();
