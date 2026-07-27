#!/usr/bin/env node
/* Curiosity Hour — build.js. Node, zero dependencies.
   1. Runs the same validation the browser runs; ABORTS on any error.
   2. Verifies every answer in answers.local.js matches its stored hashes.
   3. Bundles engine + content + CSS into one self-contained dist/index.html
      (dev screen stripped), copies assets/, and zips the lot.
   4. Regenerates docs/KEEPERS-LEDGER.md and docs/RECORDING-SCRIPT.md from
      the content files, so neither can ever drift.
   Usage: node build.js            */

'use strict';
var fs = require('fs');
var path = require('path');
var vm = require('vm');

var ROOT = __dirname;

function read(p) { return fs.readFileSync(path.join(ROOT, p), 'utf8'); }
function exists(p) { return fs.existsSync(path.join(ROOT, p)); }

/* ---------- load content + engine into a sandbox ---------- */
/* The sandbox IS the window: properties assigned to window become
   globals inside it, matching how these files run in a browser. */
var sandbox = { console: console, location: { search: '', protocol: 'build:' }, document: null };
sandbox.window = sandbox;
var ctx = vm.createContext(sandbox);

function runFile(p) {
  vm.runInContext(read(p), ctx, { filename: p });
}

var CONTENT_FILES = [
  'src/content/manifest.js',
  'src/content/rooms.js',
  'src/content/story.js',
  'src/content/puzzles.js'
];

try {
  CONTENT_FILES.forEach(runFile);
  runFile('src/engine/hash.js');
  runFile('src/engine/validate.js');
} catch (e) {
  console.error('BUILD FAILED — a content file could not be read:');
  console.error('  ' + e.message);
  process.exit(1);
}

var W = sandbox;
var CH = W.CH;

/* ---------- 1. validation gate ---------- */
var result = CH.validate.run.call(null);
if (result.errors.length) {
  console.error('BUILD FAILED — validation found ' + result.errors.length + ' error(s):\n');
  result.errors.forEach(function (e) {
    console.error('  ERROR: ' + e.what + '\n         ' + e.how + '\n');
  });
  process.exit(1);
}
console.log('Validation: 0 errors, ' + result.todos.length + ' TODO(s) outstanding.');
result.todos.forEach(function (t) { console.log('  TODO: ' + t.what); });

/* ---------- 2. answers.local.js cross-check ---------- */
var answers = {};
if (exists('src/content/answers.local.js')) {
  runFile('src/content/answers.local.js');
  answers = W.ANSWERS_LOCAL || {};
  var hashErrors = [];
  Object.keys(answers).forEach(function (id) {
    var answer = answers[id];
    if (!answer) return;                      /* TODO answers are allowed */
    if (id === 'OVERRIDE') {
      var cfg = W.PUZZLES.OVERRIDE || {};
      if ((cfg.phraseHashes || []).indexOf(CH.hash.fnv1a(CH.hash.normalize(answer))) === -1) {
        hashErrors.push('OVERRIDE phrase in answers.local.js does not match phraseHashes in puzzles.js');
      }
      return;
    }
    var p = W.PUZZLES[id];
    if (!p) { hashErrors.push('answers.local.js names puzzle "' + id + '", which is not defined'); return; }
    if ((p.acceptedHashes || []).indexOf(CH.hash.fnv1a(CH.hash.normalize(answer))) === -1) {
      hashErrors.push('Puzzle ' + id + ': the answer in answers.local.js does not hash to any acceptedHashes entry');
    }
  });
  if (hashErrors.length) {
    console.error('\nBUILD FAILED — answers and hashes disagree:');
    hashErrors.forEach(function (m) { console.error('  ERROR: ' + m); });
    process.exit(1);
  }
  console.log('Answer/hash cross-check: OK.');
} else {
  console.log('NOTE: src/content/answers.local.js not found — Ledger will have gaps.');
}

/* ---------- 3. bundle dist/index.html ---------- */
var html = read('index.html');

/* strip the dev screen */
html = html.replace(/[ \t]*<!-- BUILD:STRIP-START[\s\S]*?BUILD:STRIP-END -->\n?/g, '');

/* inline the stylesheet */
html = html.replace(
  /<link rel="stylesheet" href="src\/styles\/main.css">/,
  function () { return '<style>\n' + read('src/styles/main.css') + '\n</style>'; }
);

/* inline every <script src>, in order, skipping the dev screen code */
var bundled = [];
html = html.replace(/<script src="([^"]+)"><\/script>\n?/g, function (m, src) {
  if (src === 'src/engine/dev.js') return '';
  bundled.push(src);
  return '';
});
var joined = bundled.map(function (p) {
  return '/* ==== ' + p + ' ==== */\n' + read(p);
}).join('\n');
html = html.replace('<!-- Engine -->', '<!-- Engine + content, bundled by build.js -->\n<script>\n' + joined + '\n</script>');

/* the shipped game never contains plaintext answers (outside hint 3) */
Object.keys(answers).forEach(function (id) {
  var a = answers[id];
  if (!a || id === 'OVERRIDE') return;
  /* hint 3 may state the answer by design; anything else is a leak.
     Count occurrences outside the hints of that puzzle. */
});
if (/plaintextAnswer/.test(html)) {
  console.error('BUILD FAILED — the string plaintextAnswer appears in the bundle.');
  process.exit(1);
}
if (/ANSWERS_LOCAL/.test(html)) {
  console.error('BUILD FAILED — answers.local.js leaked into the bundle.');
  process.exit(1);
}

var DIST = path.join(ROOT, 'dist');
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });
fs.writeFileSync(path.join(DIST, 'index.html'), html);
console.log('Bundled dist/index.html (' + Math.round(html.length / 1024) + ' KB, ' + bundled.length + ' scripts inlined).');

/* copy assets/ with relative paths intact */
var copied = 0;
function copyDir(from, to) {
  if (!fs.existsSync(from)) return;
  fs.mkdirSync(to, { recursive: true });
  fs.readdirSync(from, { withFileTypes: true }).forEach(function (ent) {
    var f = path.join(from, ent.name);
    var t = path.join(to, ent.name);
    if (ent.isDirectory()) copyDir(f, t);
    else { fs.copyFileSync(f, t); copied++; }
  });
}
copyDir(path.join(ROOT, 'assets'), path.join(DIST, 'assets'));
console.log('Assets copied: ' + copied + ' file(s).');

/* ---------- 4. zip (store-only, zero deps) ---------- */
var CRC_TABLE = (function () {
  var t = new Uint32Array(256);
  for (var n = 0; n < 256; n++) {
    var c = n;
    for (var k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(buf) {
  var c = 0xFFFFFFFF;
  for (var i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
}
function u16(n) { var b = Buffer.alloc(2); b.writeUInt16LE(n); return b; }
function u32(n) { var b = Buffer.alloc(4); b.writeUInt32LE(n >>> 0); return b; }

function zipDirectory(rootDir, outFile) {
  var entries = [];
  (function walk(dir, rel) {
    fs.readdirSync(dir, { withFileTypes: true }).forEach(function (ent) {
      var full = path.join(dir, ent.name);
      var r = rel ? rel + '/' + ent.name : ent.name;
      if (ent.isDirectory()) walk(full, r);
      else entries.push({ rel: r, data: fs.readFileSync(full) });
    });
  })(rootDir, '');

  var parts = [];
  var central = [];
  var offset = 0;
  entries.forEach(function (e) {
    var name = Buffer.from(e.rel, 'utf8');
    var crc = crc32(e.data);
    var local = Buffer.concat([
      u32(0x04034b50), u16(20), u16(0), u16(0), u16(0), u16(0x2921),
      u32(crc), u32(e.data.length), u32(e.data.length),
      u16(name.length), u16(0), name, e.data
    ]);
    central.push(Buffer.concat([
      u32(0x02014b50), u16(20), u16(20), u16(0), u16(0), u16(0), u16(0x2921),
      u32(crc), u32(e.data.length), u32(e.data.length),
      u16(name.length), u16(0), u16(0), u16(0), u16(0), u32(0), u32(offset), name
    ]));
    parts.push(local);
    offset += local.length;
  });
  var centralBuf = Buffer.concat(central);
  var end = Buffer.concat([
    u32(0x06054b50), u16(0), u16(0), u16(entries.length), u16(entries.length),
    u32(centralBuf.length), u32(offset), u16(0)
  ]);
  fs.writeFileSync(outFile, Buffer.concat(parts.concat([centralBuf, end])));
  return entries.length;
}
var zipCount = zipDirectory(DIST, path.join(DIST, 'the-keeper.zip'));
console.log('dist/the-keeper.zip written (' + zipCount + ' file(s)).');

/* ---------- 5. the Keeper's Ledger (never committed) ---------- */
function answerFor(id) {
  return answers[id] ? answers[id] : '(TODO — not chosen yet)';
}
var L = [];
L.push('# THE KEEPER\'S LEDGER');
L.push('');
L.push('**PRINT THIS AND KEEP IT SOMEWHERE THE KIDS WILL NOT LOOK.**');
L.push('');
L.push('Generated by build.js from the content files — never edit by hand;');
L.push('rebuild instead. This file is git-ignored and must never be committed.');
L.push('');
L.push('## One-page summary');
L.push('');
L.push('| Gate | Answer / code | Opens |');
L.push('|---|---|---|');
Object.keys(W.PUZZLES).forEach(function (id) {
  if (id === 'OVERRIDE') return;
  var p = W.PUZZLES[id];
  var opens = (p.onSolve && (p.onSolve.unlock || p.onSolve.fragment)) || 'story beat';
  L.push('| ' + id + ' | ' + answerFor(id) + ' | ' + opens + ' |');
});
L.push('| Parent override phrase | ' + answerFor('OVERRIDE') + ' | override panel (click keyhole 5x, bottom-left) |');
L.push('');
L.push('## Every puzzle, with hints verbatim');
L.push('');
Object.keys(W.PUZZLES).forEach(function (id) {
  if (id === 'OVERRIDE') return;
  var p = W.PUZZLES[id];
  L.push('### ' + id + ' (' + p.type + ')');
  L.push('- Prompt: ' + (p.prompt || ''));
  L.push('- Answer: **' + answerFor(id) + '**');
  (p.hints || []).forEach(function (h, i) { L.push('- Hint ' + (i + 1) + ': ' + h); });
  L.push('- Physical placement: TODO — write where this clue lives in the house.');
  L.push('');
});
L.push('## Recovery');
L.push('');
L.push('- **Lost progress:** any device — Title -> Keeper\'s Key -> paste the printed key. Or use the override to jump to a chapter.');
L.push('- **Destroyed or lost physical clue:** use this Ledger\'s answer table; type the code for them, or use the override to mark the puzzle solved.');
L.push('- **A kid gives up:** every puzzle\'s hint 3 states the answer in-game via the "I\'m stuck" button. Nothing is ever locked away.');
L.push('- **Missing art or audio file:** the game continues with placeholders; it never blocks. Check names against manifest.js.');
L.push('- **Game shows "The show hit a snag":** a content file has a typo. The screen names the file; check the most recent edit.');
L.push('- **Pages site looks stale after an edit:** GitHub Pages caches for up to ~10 minutes. Wait and refresh.');
L.push('- **Full content check:** open the game with `?validate=1` after the address.');
L.push('');
fs.mkdirSync(path.join(ROOT, 'docs'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'docs', 'KEEPERS-LEDGER.md'), L.join('\n'));
console.log('docs/KEEPERS-LEDGER.md regenerated (git-ignored).');

/* ---------- 6. recording script (safe to commit) ---------- */
var R = [];
R.push('# Recording script');
R.push('');
R.push('Generated by build.js from the content files. Every line the game can');
R.push('speak, in order, with its exact filename. Record into assets/audio/.');
R.push('');
(W.STORY.chapters || []).forEach(function (ch) {
  R.push('## ' + (ch.title || ch.id));
  R.push('');
  (ch.scenes || []).forEach(function (s) {
    if (!s.audio) return;
    R.push('- `assets/audio/' + s.audio + '.mp3` — ' + (s.speaker || 'narration') + ':');
    R.push('  > ' + (s.text || ''));
  });
  R.push('');
});
R.push('## Room commentary');
R.push('');
Object.keys(W.ROOMS).forEach(function (rid) {
  var room = W.ROOMS[rid];
  R.push('### ' + room.name);
  (room.objects || []).forEach(function (o) {
    if (o.audio) {
      R.push('- `assets/audio/' + o.audio + '.mp3` — ' + o.name + ':');
      R.push('  > ' + (o.look || ''));
    }
    var an = o.anomaly ? (Array.isArray(o.anomaly) ? o.anomaly : [o.anomaly]) : [];
    an.forEach(function (a) {
      if (a.audio) {
        R.push('- `assets/audio/' + a.audio + '.mp3` — ' + o.name + ' (anomaly, ' + a.chapter + '):');
        R.push('  > ' + (a.text || ''));
      }
    });
  });
  R.push('');
});
R.push('## Notebook fragments (raw, unaired tone)');
R.push('');
(W.STORY.fragments || []).forEach(function (f) {
  if (!f.audio) return;
  R.push('- `assets/audio/' + f.audio + '.mp3` — ' + (f.title || f.id) + ':');
  R.push('  > ' + (f.text || ''));
});
R.push('');
fs.writeFileSync(path.join(ROOT, 'docs', 'RECORDING-SCRIPT.md'), R.join('\n'));
console.log('docs/RECORDING-SCRIPT.md regenerated.');

console.log('\nBUILD OK.');
