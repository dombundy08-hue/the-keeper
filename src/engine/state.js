/* Curiosity Hour engine — game state, autosave, localStorage.
   Everything is keyed by scene/object/puzzle IDs, never array indices,
   so content edits after launch do not invalidate an existing save.
   No Date, no clocks anywhere (constraint 6). */

window.CH = window.CH || {};

CH.state = (function () {
  /* Deliberately inert storage name — the repo is public. */
  var STORAGE_NAME = 'ch_tape_v1';

  var data = null;

  function fresh() {
    return {
      v: 1,                 /* save format version */
      chapter: null,        /* current chapter id, e.g. 'ep1' */
      scene: null,          /* current scene id within the chapter */
      room: null,           /* current room id when exploring */
      puzzle: null,         /* current puzzle id when on the puzzle screen */
      screen: 'title',      /* which top-level screen we were on */
      unlocked: [],         /* chapter ids unlocked by codes */
      completed: [],        /* chapter ids played to their end card */
      solved: [],           /* puzzle ids solved */
      found: [],            /* anomaly object ids found, as 'chapter:objectId' */
      hints: {},            /* puzzleId -> highest hint index revealed (1..3) */
      attempts: {},         /* puzzleId -> wrong attempt count */
      lenses: 0,            /* physical lenses found-count (0..3) */
      notebook: [],         /* notebook fragment ids revealed */
      settings: {
        volume: 1,
        muted: false,
        textSpeed: 'normal'
      }
    };
  }

  /* localStorage is inconsistent on file:// — every touch is guarded.
     The Keeper's Key (key.js) is the durable path; this is convenience. */
  function storageGet() {
    try { return window.localStorage.getItem(STORAGE_NAME); }
    catch (e) { return null; }
  }
  function storageSet(value) {
    try { window.localStorage.setItem(STORAGE_NAME, value); return true; }
    catch (e) { return false; }
  }
  function storageClear() {
    try { window.localStorage.removeItem(STORAGE_NAME); } catch (e) {}
  }

  /* Merge a loaded save over a fresh state so old saves survive the engine
     gaining new fields later. Unknown fields are dropped; missing fields
     get defaults. */
  function adopt(raw) {
    var base = fresh();
    if (!raw || typeof raw !== 'object') return base;
    var k;
    for (k in base) {
      if (Object.prototype.hasOwnProperty.call(raw, k)) {
        if (k === 'settings' && raw.settings && typeof raw.settings === 'object') {
          var s;
          for (s in base.settings) {
            if (Object.prototype.hasOwnProperty.call(raw.settings, s)) {
              base.settings[s] = raw.settings[s];
            }
          }
        } else {
          base[k] = raw[k];
        }
      }
    }
    return base;
  }

  return {
    fresh: fresh,
    adopt: adopt,

    get: function () {
      if (!data) data = fresh();
      return data;
    },

    /* Replace state wholesale (used by Begin, and by Keeper's Key load). */
    set: function (next) {
      data = adopt(next);
      this.save();
      return data;
    },

    reset: function () {
      data = fresh();
      storageClear();
      return data;
    },

    /* Autosave — called on every scene advance and puzzle solve. */
    save: function () {
      if (!data) return false;
      var json;
      try { json = JSON.stringify(data); }
      catch (e) { return false; }
      return storageSet(json);
    },

    /* Returns true if a save was found and loaded. */
    load: function () {
      var json = storageGet();
      if (!json) return false;
      var raw;
      try { raw = JSON.parse(json); }
      catch (e) { return false; }
      data = adopt(raw);
      return true;
    },

    hasSave: function () {
      return storageGet() !== null;
    },

    /* Small helpers used across the engine */
    markSolved: function (puzzleId) {
      var d = this.get();
      if (d.solved.indexOf(puzzleId) === -1) d.solved.push(puzzleId);
      this.save();
    },
    isSolved: function (puzzleId) {
      return this.get().solved.indexOf(puzzleId) !== -1;
    },
    markUnlocked: function (chapterId) {
      var d = this.get();
      if (d.unlocked.indexOf(chapterId) === -1) d.unlocked.push(chapterId);
      this.save();
    },
    isUnlocked: function (chapterId) {
      /* A chapter with unlockedBy: null is always open. */
      var chapters = (window.STORY && window.STORY.chapters) || [];
      for (var i = 0; i < chapters.length; i++) {
        if (chapters[i].id === chapterId && !chapters[i].unlockedBy) return true;
      }
      return this.get().unlocked.indexOf(chapterId) !== -1;
    }
  };
})();
