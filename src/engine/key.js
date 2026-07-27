/* Curiosity Hour engine — the Keeper's Key.
   The durable save path: a code short enough for a nine-year-old to
   copy onto an index card. localStorage on file:// is best-effort;
   this is the guarantee.

   Format (v2):  K-XXX-XXX-XXX   (10 meaningful characters)
   - Crockford base32 alphabet: 0-9 + letters minus I, L, O, U.
     Decoding forgives the classic copy errors: o/O read as 0,
     i/I/l/L read as 1. Case and dashes never matter.
   - Payload, 30 bits: chapter index (3) · scene index (6) ·
     completed-chapters mask (4) · solved-puzzles mask (16) · pad (1).
   - Checksum, 15 bits of FNV-1a over the payload characters, so a
     miscopied card is caught and explained, not silently misread.

   Everything else the old format carried is DERIVED on load:
   unlocked chapters, notebook fragments, and lens count all follow
   from which puzzles are solved. Settings stay on the device.

   Trade-off, on the record: bit positions come from the sorted list
   of puzzle ids and the chapter/scene order in the content files, so
   inserting new puzzles or scenes AFTER keys are in the wild can
   shift old keys. The physical hunt's content freezes before launch;
   recovery for any drift is the parent override plus the Ledger.

   Old long keys (prefix "CH1.") from earlier builds still decode. */

window.CH = window.CH || {};

CH.key = (function () {
  var ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

  function puzzleList() {
    var ids = [];
    for (var k in (window.PUZZLES || {})) {
      if (k !== 'OVERRIDE') ids.push(k);
    }
    ids.sort();
    return ids;
  }
  function chapterList() {
    return (window.STORY && window.STORY.chapters) || [];
  }

  /* ---- bit strings <-> base32 ---- */
  function toBits(value, width) {
    var s = value.toString(2);
    while (s.length < width) s = '0' + s;
    return s.slice(-width);
  }
  function bitsToChars(bits) {
    while (bits.length % 5) bits += '0';
    var out = '';
    for (var i = 0; i < bits.length; i += 5) {
      out += ALPHABET.charAt(parseInt(bits.slice(i, i + 5), 2));
    }
    return out;
  }
  function charsToBits(chars) {
    var bits = '';
    for (var i = 0; i < chars.length; i++) {
      var v = ALPHABET.indexOf(chars.charAt(i));
      if (v === -1) return null;
      bits += toBits(v, 5);
    }
    return bits;
  }

  /* forgiving normalization for hand-copied input */
  function normalizeInput(raw) {
    return String(raw == null ? '' : raw)
      .toUpperCase()
      .replace(/[\s\-]+/g, '')
      .replace(/O/g, '0')
      .replace(/[IL]/g, '1');
  }

  function checksumOf(payloadChars) {
    return CH.hash.fnv1a(payloadChars) & 0x7FFF;   /* 15 bits */
  }

  return {
    encode: function (state) {
      var chapters = chapterList();
      var puzzles = puzzleList();

      var chapIdx = 0, sceneIdx = 0;
      for (var c = 0; c < chapters.length; c++) {
        if (chapters[c].id === state.chapter) {
          chapIdx = c;
          var scenes = chapters[c].scenes || [];
          for (var s = 0; s < scenes.length; s++) {
            if (scenes[s].id === state.scene) { sceneIdx = s; break; }
          }
          break;
        }
      }
      var completedMask = 0;
      for (var m = 0; m < chapters.length && m < 4; m++) {
        if ((state.completed || []).indexOf(chapters[m].id) !== -1) {
          completedMask |= (1 << m);
        }
      }
      var solvedMask = 0;
      for (var p = 0; p < puzzles.length && p < 16; p++) {
        if ((state.solved || []).indexOf(puzzles[p]) !== -1) {
          solvedMask |= (1 << p);
        }
      }

      var bits = toBits(chapIdx, 3) + toBits(sceneIdx, 6) +
                 toBits(completedMask, 4) + toBits(solvedMask, 16);
      var payload = bitsToChars(bits);                     /* 6 chars */
      var check = bitsToChars(toBits(checksumOf(payload), 15));  /* 3 chars */
      var raw = payload + check;
      return 'K-' + raw.slice(0, 3) + '-' + raw.slice(3, 6) + '-' + raw.slice(6, 9);
    },

    decode: function (input) {
      var s = normalizeInput(input);

      if (!s) {
        return { ok: false, why: 'The box is empty. Type your whole key in first.' };
      }

      /* old long keys from earlier builds still work */
      if (String(input).indexOf('CH1.') !== -1) {
        return this.decodeLegacy(input);
      }

      if (s.charAt(0) !== 'K') {
        return {
          ok: false,
          why: 'A Keeper\'s Key starts with the letter K. Make sure you copied it from the very beginning.'
        };
      }
      var body = s.slice(1);
      if (body.length !== 9) {
        return {
          ok: false,
          why: 'A key has exactly 9 letters and numbers after the K. This one has ' +
               body.length + '. Check your copy against the card.'
        };
      }
      var payload = body.slice(0, 6);
      var checkBits = charsToBits(body.slice(6, 9));
      var payloadBits = charsToBits(payload);
      if (payloadBits == null || checkBits == null) {
        return {
          ok: false,
          why: 'That key has a letter that is never used in keys (like U). Check it against your card, letter by letter.'
        };
      }
      if (parseInt(checkBits, 2) !== checksumOf(payload)) {
        return {
          ok: false,
          why: 'That key has a typo somewhere. Check it against your card, letter by letter — every character matters.'
        };
      }

      var chapIdx = parseInt(payloadBits.slice(0, 3), 2);
      var sceneIdx = parseInt(payloadBits.slice(3, 9), 2);
      var completedMask = parseInt(payloadBits.slice(9, 13), 2);
      var solvedMask = parseInt(payloadBits.slice(13, 29), 2);

      var chapters = chapterList();
      var puzzles = puzzleList();
      var state = CH.state.fresh();

      var chapter = chapters[chapIdx] || chapters[0];
      if (chapter) {
        state.chapter = chapter.id;
        var scenes = chapter.scenes || [];
        state.scene = (scenes[sceneIdx] || scenes[0] || {}).id || null;
        state.screen = 'scene';
      }
      for (var m = 0; m < chapters.length && m < 4; m++) {
        if (completedMask & (1 << m)) state.completed.push(chapters[m].id);
      }
      for (var p = 0; p < puzzles.length && p < 16; p++) {
        if (solvedMask & (1 << p)) state.solved.push(puzzles[p]);
      }

      /* everything else follows from what was solved */
      for (var i = 0; i < state.solved.length; i++) {
        var on = (window.PUZZLES[state.solved[i]] || {}).onSolve || {};
        if (on.unlock && state.unlocked.indexOf(on.unlock) === -1) {
          state.unlocked.push(on.unlock);
        }
        if (on.fragment && state.notebook.indexOf(on.fragment) === -1) {
          state.notebook.push(on.fragment);
        }
        if (on.lens) state.lenses = Math.min(3, state.lenses + 1);
      }

      return { ok: true, state: CH.state.adopt(state) };
    },

    /* the pre-compact format: CH1.<base64 JSON>.<fnv1a base36> */
    decodeLegacy: function (input) {
      var s = String(input == null ? '' : input).replace(/\s+/g, '');
      var parts = s.split('.');
      if (parts.length !== 3 || parts[0] !== 'CH1') {
        return { ok: false, why: 'That looks like an old-style key, but it is incomplete. Copy the whole thing, dots and all.' };
      }
      if (CH.hash.fnv1a(parts[1]).toString(36) !== parts[2]) {
        return { ok: false, why: 'That old-style key has a typo somewhere. Check it letter by letter.' };
      }
      var raw;
      try {
        raw = JSON.parse(decodeURIComponent(escape(atob(parts[1]))));
      } catch (e) {
        return { ok: false, why: 'That old-style key could not be read. Try copying it again.' };
      }
      if (!raw || typeof raw !== 'object' || raw.v !== 1) {
        return { ok: false, why: 'That key came from a different version of the game and could not be read.' };
      }
      return { ok: true, state: CH.state.adopt(raw) };
    }
  };
})();
