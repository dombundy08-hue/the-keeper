/* ================================================================
   THE PUZZLES — this file is safe to edit, carefully.

   Answers are stored as numbers (hashes), never as words, because
   this file ships to a public website AND lives in a public
   repository. The real answers live in answers.local.js, which
   never leaves this computer (it is git-ignored).
   Exception by design: hint 3 states the answer outright, so it is
   readable in this file. That is the price of "always solvable".

   Every puzzle has EXACTLY three hints, in order:
   1. a nudge   2. a direction   3. the answer, stated outright.

   The puzzle system is built in milestone 4. These entries anchor
   the ids the other files already point at.
   ================================================================ */

window.PUZZLES = {

  /* Solved by clicking the crooked frame in the loft (rooms.js). */
  PUZ_EP1_LOFT: {
    id: 'PUZ_EP1_LOFT',
    type: 'text',
    prompt: "Something in the loft is wrong. Click it when you find it.",
    acceptedHashes: [],            /* click-to-solve; no typed answer */
    hints: [
      "TODO: author input required — nudge hint.",
      "TODO: author input required — direction hint.",
      "TODO: author input required — the answer, in the Keeper's voice."
    ],
    onSolve: { goto: { chapter: 'ep1', scene: 'ep1_s10' } }
  },

  /* Example typed puzzle from the spec, kept as the worked example. */
  PUZ_EP2_CODE: {
    id: 'PUZ_EP2_CODE',
    type: 'text',
    prompt: "What did the tape say?",
    acceptedHashes: [2166136261, 1049283732],
    hints: [
      "He said it twice. He does not usually say anything twice.",
      "It is a colour. The colour of the thing he keeps looking at.",
      "The answer is MARIGOLD. Do not tell him I told you."
    ],
    onSolve: { unlock: 'ep2' }
  }
};
