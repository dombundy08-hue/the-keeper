/* Curiosity Hour engine — hashing and answer normalization.
   FNV-1a only (constraint 5: no crypto.subtle). Plain script, no modules. */

window.CH = window.CH || {};

CH.hash = {
  /* 32-bit FNV-1a. Returns an unsigned integer, matching the numbers
     stored in acceptedHashes in content/puzzles.js. */
  fnv1a: function (str) {
    var h = 0x811c9dc5;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      /* h *= 16777619, kept in 32-bit integer math */
      h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
    }
    return h >>> 0;
  },

  /* Answer normalization (§6): trim, lowercase, collapse whitespace,
     strip punctuation and accents, drop a leading article. */
  normalize: function (input) {
    var s = String(input == null ? '' : input).toLowerCase();
    if (s.normalize) {
      s = s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }
    s = s.replace(/[^a-z0-9\s]/g, ' ');
    s = s.replace(/\s+/g, ' ').trim();
    s = s.replace(/^(the|a|an) /, '');
    return s;
  },

  /* Convenience: does this raw input match any accepted hash? */
  matches: function (rawInput, acceptedHashes) {
    if (!acceptedHashes || !acceptedHashes.length) return false;
    var h = CH.hash.fnv1a(CH.hash.normalize(rawInput));
    for (var i = 0; i < acceptedHashes.length; i++) {
      if (acceptedHashes[i] === h) return true;
    }
    return false;
  }
};
