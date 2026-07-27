/* ================================================================
   THE PUZZLES — this file is safe to edit, carefully.

   Answers are stored as numbers (hashes), never as words, because
   this file ships to a public website AND lives in a public
   repository. The real answers live in answers.local.js, which
   never leaves this computer (it is git-ignored).
   Exception by design: hint 3 states the answer outright, so it is
   readable in this file. That is the price of "always solvable".

   To make hashes for a new answer, open the game with ?dev=1 and
   use the hash tool on the dev screen, or ask Claude.

   Every puzzle has EXACTLY three hints, in order:
   1. a nudge   2. a direction   3. the answer, stated outright.

   "onSolve" can contain:
     unlock: 'ep2'                       open a chapter
     goto: { chapter, scene }            jump to a scene
     lens: true                          count a lens as found
     fragment: 'frag_id'                 reveal a notebook fragment
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

  /* The worked example from the spec: typed inside Episode 2. */
  PUZ_EP2_CODE: {
    id: 'PUZ_EP2_CODE',
    type: 'text',
    prompt: "What did the tape say?",
    acceptedHashes: [3697693284, 202586677, 2116747424, 4097484948, 3426087136],
    hints: [
      "He said it twice. He does not usually say anything twice.",
      "It is a colour. The colour of the thing he keeps looking at.",
      "The answer is MARIGOLD. Do not tell him I told you."
    ],
    onSolve: { unlock: 'ep2' }
  },

  /* Solved by clicking the turned box in the closet (Episode 2). */
  PUZ_EP2_CLOSET: {
    id: 'PUZ_EP2_CLOSET',
    type: 'text',
    prompt: "Something in the closet is wrong. Click it when you find it.",
    acceptedHashes: [],
    hints: [
      "TODO: author input required — nudge hint.",
      "TODO: author input required — direction hint.",
      "TODO: author input required — the answer, in the Keeper's voice."
    ],
    onSolve: { goto: { chapter: 'ep2', scene: 'ep2_s07' } }
  },

  /* Episode 3 has two wrong things. The book first... */
  PUZ_EP3_SHELF: {
    id: 'PUZ_EP3_SHELF',
    type: 'text',
    prompt: "Something in Dom's room is wrong. Click it when you find it.",
    acceptedHashes: [],
    hints: [
      "TODO: author input required — nudge hint.",
      "TODO: author input required — direction hint.",
      "TODO: author input required — the answer, in the Keeper's voice."
    ],
    onSolve: { goto: { chapter: 'ep3', scene: 'ep3_s06' } }
  },

  /* ...then the clock. */
  PUZ_EP3_CLOCK: {
    id: 'PUZ_EP3_CLOCK',
    type: 'text',
    prompt: "A machine in the house has stopped telling the truth. Find it.",
    acceptedHashes: [],
    hints: [
      "TODO: author input required — nudge hint.",
      "TODO: author input required — direction hint.",
      "TODO: author input required — the answer, in the Keeper's voice."
    ],
    onSolve: { goto: { chapter: 'ep3', scene: 'ep3_s07' } }
  },

  /* Episode 4: the nightstand letter. */
  PUZ_EP4_NIGHTSTAND: {
    id: 'PUZ_EP4_NIGHTSTAND',
    type: 'text',
    prompt: "The unfinished room has one thing in it that matters. Find it.",
    acceptedHashes: [],
    hints: [
      "TODO: author input required — nudge hint.",
      "TODO: author input required — direction hint.",
      "TODO: author input required — the answer, in the Keeper's voice."
    ],
    onSolve: { goto: { chapter: 'ep4', scene: 'ep4_s05' } }
  },

  /* ---- Physical-world codes. Each unlocks a chapter. ----
     The kids find these written on paper clues in the house.
     TODO: author input required — replace every acceptedHashes below
     once the physical codes are chosen. Empty hashes = puzzle cannot
     fire, and validation will list it as unfinished. */

  CODE_EP3: {
    id: 'CODE_EP3',
    type: 'text',
    prompt: "Enter the code from the clue you found.",
    acceptedHashes: [],   /* TODO: author input required */
    hints: [
      "The code is on the clue you found in the real world. Bring it back here.",
      "Check the bottom of the paper. Codes hide in corners.",
      "TODO: author input required — state the Episode 3 code outright."
    ],
    onSolve: { unlock: 'ep3' }
  },

  CODE_EP4: {
    id: 'CODE_EP4',
    type: 'text',
    prompt: "Enter the code from the clue you found.",
    acceptedHashes: [],   /* TODO: author input required */
    hints: [
      "The code is on the clue you found in the real world. Bring it back here.",
      "Check the bottom of the paper. Codes hide in corners.",
      "TODO: author input required — state the Episode 4 code outright."
    ],
    onSolve: { unlock: 'ep4' }
  },

  /* ---- The finale: order the three lenses. ---- */
  PUZ_LENSES: {
    id: 'PUZ_LENSES',
    type: 'sequence',
    prompt: "Three lenses. One order. Stack them the way the notebook says.",
    items: [
      { id: 'red',     label: 'Red lens' },
      { id: 'blue',    label: 'Blue lens' },
      { id: 'frosted', label: 'Frosted lens' }
    ],
    acceptedHashes: [],   /* TODO: author input required — hash of the
                             right order, e.g. 'red blue frosted' */
    solvedText: "TODO: author input required — the hidden word appears, confirming the physical stack.",
    hints: [
      "Each of you carried one. The order is not the order you found them in.",
      "The notebook page with three circles is the instruction. Look at which circle is on top.",
      "TODO: author input required — state the lens order outright."
    ],
    onSolve: { fragment: 'frag_finale' }
  },

  /* Master phrase for the parent override screen (5 clicks on the
     keyhole, bottom-left). Placeholder phrase is in answers.local.js —
     TODO: author input required — change it before the hunt starts. */
  OVERRIDE: {
    phraseHashes: [3185991916]
  }
};
