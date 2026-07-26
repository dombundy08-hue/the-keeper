/* Curiosity Hour engine — the Keeper's Key.
   A short pasteable string that encodes the full game state, with a
   checksum so typos are caught and explained. This is the durable save
   path; localStorage on file:// is best-effort only.

   Format:  CH1.<base64 of state JSON>.<fnv1a checksum in base 36>
   The prefix is versioned so a future format change can still read
   old keys. No crypto.subtle (constraint 5) — btoa/atob only. */

window.CH = window.CH || {};

CH.key = (function () {
  var PREFIX = 'CH1';

  /* btoa/atob only handle 8-bit chars; state is ASCII ids and numbers,
     but guard anyway via the escape/unescape round trip. */
  function toB64(str) {
    return btoa(unescape(encodeURIComponent(str)));
  }
  function fromB64(b64) {
    return decodeURIComponent(escape(atob(b64)));
  }

  return {
    /* Build a key from the current state. */
    encode: function (state) {
      var json = JSON.stringify(state);
      var b64 = toB64(json);
      var check = CH.hash.fnv1a(b64).toString(36);
      return PREFIX + '.' + b64 + '.' + check;
    },

    /* Parse a pasted key. Returns { ok: true, state } or
       { ok: false, why } with a plain-English reason a kid can act on. */
    decode: function (input) {
      /* Printed or emailed keys pick up spaces and line breaks — drop
         all whitespace before anything else. */
      var s = String(input == null ? '' : input).replace(/\s+/g, '');

      if (!s) {
        return { ok: false, why: 'The box is empty. Paste your whole key in first.' };
      }
      var parts = s.split('.');
      if (parts.length !== 3 || parts[0] !== PREFIX) {
        return {
          ok: false,
          why: 'That does not look like a Keeper\'s Key. A real key starts with "' +
               PREFIX + '." — make sure you copied the whole thing, from the very start.'
        };
      }
      var b64 = parts[1];
      var check = parts[2];
      if (CH.hash.fnv1a(b64).toString(36) !== check) {
        return {
          ok: false,
          why: 'That key has a typo somewhere. Check it against your copy, ' +
               'letter by letter — every character matters.'
        };
      }
      var json, raw;
      try {
        json = fromB64(b64);
        raw = JSON.parse(json);
      } catch (e) {
        return {
          ok: false,
          why: 'That key could not be read. Try copying it again from wherever you saved it.'
        };
      }
      if (!raw || typeof raw !== 'object' || raw.v !== 1) {
        return {
          ok: false,
          why: 'That key came from a different version of the game and could not be read.'
        };
      }
      return { ok: true, state: CH.state.adopt(raw) };
    }
  };
})();
