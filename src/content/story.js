/* ================================================================
   THE STORY — this file is safe to edit.

   HOW TO EDIT, in one minute:
   - Every line of the show is a "scene". A scene looks like this:

       {
         id: 'ep1_s01',            a unique name for this scene
         art: 'studio_warm',       which picture to show (see manifest.js)
         audio: 'ep1_s01',         which recording to play (see manifest.js)
         speaker: 'THE KEEPER',    who is talking (or null for narration)
         text: "What he says.",    the words on screen
         effect: null,             leave null unless told otherwise
         next: 'ep1_s02'           where to go after this scene
       },

   - "next" can be:  another scene id in quotes,
                     { room: 'loft' }      to send the player to a room,
                     { puzzle: 'PUZ_ID' }  to open a puzzle,
                     { end: true }         to end the chapter.
   - Keep every comma and quote mark. If the game shows "The show hit
     a snag" after an edit, you removed one — check your last change.
   ================================================================ */

window.STORY = {
  chapters: [
    {
      id: 'ep1',
      title: 'Episode one — look again',
      unlockedBy: null,          /* first episode is always open */
      era: 'warm',
      scenes: [
        {
          id: 'ep1_s01',
          art: 'studio_warm',
          audio: 'ep1_s01',
          speaker: 'THE KEEPER',
          text: "Look again. The secret is never hiding. It is just waiting to be noticed.",
          effect: null,
          next: 'ep1_s02'
        },
        {
          id: 'ep1_s02',
          art: 'studio_warm',
          audio: 'ep1_s02',
          speaker: 'THE KEEPER',
          text: "TODO: author input required — Episode 1 continues here. This placeholder line proves the scene player works end to end.",
          effect: null,
          next: { end: true }
        }
      ]
    }
  ]
};
