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

   EPISODE 1 BELOW IS A DRAFT for you to rewrite in your own voice.
   The two lines marked "from the spec" are the ones you wrote.
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
          text: "Hello, hello! Welcome to Curiosity Hour. I am the Keeper. That is not my name. It is my job.",
          effect: null,
          next: 'ep1_s02'
        },
        {
          id: 'ep1_s02',
          art: 'studio_warm',
          audio: 'ep1_s02',
          speaker: 'THE KEEPER',
          text: "Say hello, audience! ... Wonderful. You are my favourite audience. Do not tell the other ones.",
          effect: null,
          next: 'ep1_s03'
        },
        {
          id: 'ep1_s03',
          art: 'studio_warm',
          audio: 'ep1_s03',
          speaker: 'THE KEEPER',
          text: "Today I am going to teach you the most important thing I know. It is called the method.",
          effect: null,
          next: 'ep1_s04'
        },
        {
          id: 'ep1_s04',
          art: 'studio_warm',
          audio: 'ep1_s04',
          speaker: 'THE KEEPER',
          text: "The method is easy. You do not need tools. You do not need to be big. You only need your eyes.",
          effect: null,
          next: 'ep1_s05'
        },
        {
          id: 'ep1_s05',
          art: 'studio_warm',
          audio: 'ep1_s05',
          speaker: 'THE KEEPER',
          text: "Pick a thing you see every single day. A cup. A door. A picture on a wall. Now look at it like you have never seen it before.",
          effect: null,
          next: 'ep1_s06'
        },
        {
          id: 'ep1_s06',
          art: 'studio_warm',
          audio: 'ep1_s06',
          speaker: 'THE KEEPER',
          /* from the spec */
          text: "Look again. The secret is never hiding. It is just waiting to be noticed.",
          effect: null,
          next: 'ep1_s07'
        },
        {
          id: 'ep1_s07',
          art: 'studio_warm',
          audio: 'ep1_s07',
          speaker: 'THE KEEPER',
          text: "Because every room remembers. Every room keeps— ... ha! Where was I? The lights are very bright today.",
          effect: null,
          next: 'ep1_s08'
        },
        {
          id: 'ep1_s08',
          art: 'studio_warm',
          audio: 'ep1_s08',
          speaker: 'THE KEEPER',
          text: "Here is your homework. Yes, homework! Do not groan. This kind is fun. Somewhere near you, one thing is wrong. Not broken. Just wrong.",
          effect: null,
          next: 'ep1_s09'
        },
        {
          id: 'ep1_s09',
          art: 'studio_warm',
          audio: 'ep1_s09',
          speaker: 'THE KEEPER',
          /* from the spec */
          text: "You know a room with a low white wall in it. Go and look at it properly.",
          effect: null,
          next: { room: 'loft' }
        }
      ]
    }
  ]
};
