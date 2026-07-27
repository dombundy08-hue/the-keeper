/* Curiosity Hour engine — puzzles.
   Milestone 3 scope: onSolve routing (unlock a chapter, jump to a scene).
   Milestone 4 adds the puzzle screen, hint ladder, and parent override. */

window.CH = window.CH || {};

CH.puzzles = (function () {

  function find(puzzleId) {
    return (window.PUZZLES && window.PUZZLES[puzzleId]) || null;
  }

  return {
    find: find,

    /* Apply a solved puzzle's consequences. Safe to call once solved. */
    runOnSolve: function (puzzleId) {
      var puzzle = find(puzzleId);
      if (!puzzle) {
        CH.screens.contentError(
          'Puzzle "' + puzzleId + '" is not defined',
          'Something points at a puzzle id that does not exist in ' +
          'src/content/puzzles.js. Check the spelling on both ends.'
        );
        return;
      }
      var on = puzzle.onSolve || {};
      if (on.unlock) CH.state.markUnlocked(on.unlock);
      if (on.goto && on.goto.scene) {
        CH.scenes.show(on.goto.chapter || CH.state.get().chapter, on.goto.scene);
      }
    }
  };
})();
