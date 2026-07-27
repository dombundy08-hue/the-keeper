/* Curiosity Hour engine — boot.
   Runs last. Verifies the content files actually loaded (a typo in one of
   them must produce a plain-English report, never a white screen), sets up
   integer scaling, and shows the title. */

(function () {

  /* Friendly names for the files a non-programmer will edit. */
  var CONTENT_FILES = [
    { global: 'ASSETS',  file: 'src/content/manifest.js', what: 'the asset list' },
    { global: 'ROOMS',   file: 'src/content/rooms.js',    what: 'the house' },
    { global: 'STORY',   file: 'src/content/story.js',    what: 'the story' },
    { global: 'PUZZLES', file: 'src/content/puzzles.js',  what: 'the puzzles' }
  ];

  function reportProblems(problems) {
    var report = document.getElementById('error-report');
    report.innerHTML = '';
    for (var i = 0; i < problems.length; i++) {
      var item = document.createElement('div');
      item.className = 'error-item';
      var strong = document.createElement('strong');
      strong.textContent = problems[i].what + '.';
      var p = document.createElement('p');
      p.textContent = problems[i].how;
      item.appendChild(strong);
      item.appendChild(p);
      report.appendChild(item);
    }
    var screens = document.querySelectorAll('.screen');
    for (var j = 0; j < screens.length; j++) screens[j].hidden = true;
    document.getElementById('screen-error').hidden = false;
  }

  /* Did every content file produce its data? A syntax error in story.js
     leaves window.STORY undefined — that is our reliable signal on file://,
     where the browser often hides error details from window.onerror. */
  function checkContentLoaded() {
    var problems = [];
    for (var i = 0; i < CONTENT_FILES.length; i++) {
      var c = CONTENT_FILES[i];
      if (typeof window[c.global] === 'undefined') {
        problems.push({
          what: 'Could not read ' + c.what + ' (' + c.file + ')',
          how: 'The file probably has a typo — a missing quote, comma, or ' +
               'bracket. Open it, look near your most recent change, and ' +
               'compare it with the examples around it. Then reload this page.'
        });
      }
    }
    /* Include anything window.onerror caught, with whatever detail exists. */
    var errs = window.__CH_ERRORS || [];
    for (var k = 0; k < errs.length; k++) {
      var e = errs[k];
      var where = e.source ? e.source.split('/').pop() : 'one of the game files';
      if (e.line) where += ', line ' + e.line;
      problems.push({
        what: 'A problem in ' + where,
        how: e.message && e.message !== 'Script error.'
          ? e.message
          : 'The browser would not say exactly what went wrong. Check the ' +
            'most recently edited file for a missing quote, comma, or bracket.'
      });
    }
    return problems;
  }

  /* Light boot-time sanity check. The exhaustive version is validation
     mode (milestone 8); this catches only what would break the first click. */
  function checkContentShape() {
    var problems = [];
    var story = window.STORY;
    if (story && (!story.chapters || !story.chapters.length)) {
      problems.push({
        what: 'The story has no chapters',
        how: 'src/content/story.js must have a "chapters" list with at least one chapter in it.'
      });
    }
    if (story && story.chapters) {
      var seen = {};
      for (var i = 0; i < story.chapters.length; i++) {
        var ch = story.chapters[i];
        if (!ch.id) {
          problems.push({
            what: 'A chapter is missing its id',
            how: 'Every chapter in src/content/story.js needs an id, like id: \'ep1\'.'
          });
          continue;
        }
        if (seen[ch.id]) {
          problems.push({
            what: 'Two chapters share the id "' + ch.id + '"',
            how: 'Chapter ids must be unique. Rename one of them in src/content/story.js.'
          });
        }
        seen[ch.id] = true;
      }
    }
    return problems;
  }

  /* 640x360 logical, integer-scaled, nearest-neighbour (constraint 12). */
  function rescale() {
    var stage = document.getElementById('stage');
    var scale = Math.floor(Math.min(
      window.innerWidth / 640,
      window.innerHeight / 360
    ));
    if (scale < 1) scale = 1;
    stage.style.transform = 'scale(' + scale + ')';
  }

  function boot() {
    var problems = checkContentLoaded().concat(checkContentShape());
    if (problems.length) {
      reportProblems(problems);
      return;
    }

    rescale();
    window.addEventListener('resize', rescale);

    CH.state.load();               /* harmless if there is no save */
    CH.screens.init();
    CH.ui.init();                  /* pixel cursor + UI sounds */

    /* ?validate=1 prints the full content check, in plain English. */
    if (/[?&]validate=1/.test(location.search) && CH.validate) {
      var result = CH.validate.run();
      var list = [];
      for (var v = 0; v < result.errors.length; v++) list.push(result.errors[v]);
      for (var t = 0; t < result.todos.length; t++) {
        list.push({ what: 'TODO — ' + result.todos[t].what, how: 'Not a mistake, just unfinished.' });
      }
      if (!list.length) list.push({ what: 'All clear', how: 'Every check passed. Nothing is broken and nothing is left unfinished.' });
      reportProblems(list);
      return;
    }

    /* ?dev=1 opens the dev screen (file:// and localhost only). */
    if (/[?&]dev=1/.test(location.search) && CH.dev && CH.dev.isDevHost()) {
      CH.dev.open();
      return;
    }
    CH.screens.show('title');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
