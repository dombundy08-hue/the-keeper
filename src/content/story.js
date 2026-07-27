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
        },
        {
          id: 'ep1_s10',
          art: 'studio_warm',
          audio: 'ep1_s10',
          speaker: 'THE KEEPER',
          text: "... You found it. Ha. Of course you found it. I knew you would. I... hm. Well done. Truly.",
          effect: null,
          next: 'ep1_s11'
        },
        {
          id: 'ep1_s11',
          art: 'studio_warm',
          audio: 'ep1_s11',
          speaker: 'THE KEEPER',
          text: "TODO: author input required — the Keeper gives the first real-world code here, and says where in the house to use it.",
          effect: null,
          next: 'ep1_s12'
        },
        {
          id: 'ep1_s12',
          art: 'studio_warm',
          audio: 'ep1_s12',
          speaker: 'THE KEEPER',
          text: "When you find what it opens, it will have words for me. Come back and tell me the words. I will be here. I am always here.",
          effect: null,
          next: { end: true }
        }
      ]
    },

    /* ============ EPISODE 2 — still warm, cracks widening ============
       Unlocked by the code on the first physical clue (PUZ_EP2_CODE).
       DRAFT — rewrite freely. */
    {
      id: 'ep2',
      title: 'Episode two — the box that turned around',
      unlockedBy: 'PUZ_EP2_CODE',
      era: 'warm',
      scenes: [
        {
          id: 'ep2_s01',
          art: 'studio_warm',
          audio: 'ep2_s01',
          speaker: 'THE KEEPER',
          text: "You came back! Of course you came back. Once you start noticing, it is very hard to stop. Believe me.",
          effect: null,
          next: 'ep2_s02'
        },
        {
          id: 'ep2_s02',
          art: 'studio_warm',
          audio: 'ep2_s02',
          speaker: 'THE KEEPER',
          text: "Say hello, audience! ... Hm. A little quieter today. Colds going around, I expect. Anyway!",
          effect: null,
          next: 'ep2_s03'
        },
        {
          id: 'ep2_s03',
          art: 'studio_warm',
          audio: 'ep2_s03',
          speaker: 'THE KEEPER',
          text: "Lesson two. Rooms you visit every day stop being seen. Your eyes skip them, like a word you have read too many times.",
          effect: null,
          next: 'ep2_s04'
        },
        {
          id: 'ep2_s04',
          art: 'studio_warm',
          audio: 'ep2_s04',
          speaker: 'THE KEEPER',
          text: "So today we practise on a room you almost never look at. A room whose whole job is holding things you forgot you own.",
          effect: null,
          next: 'ep2_s05'
        },
        {
          id: 'ep2_s05',
          art: 'studio_warm',
          audio: 'ep2_s05',
          speaker: 'THE KEEPER',
          text: "The method wants to be used. It — I mean. I mean you will want to use it. That is what I meant. Where was I.",
          effect: null,
          next: 'ep2_s06'
        },
        {
          id: 'ep2_s06',
          art: 'studio_warm',
          audio: 'ep2_s06',
          speaker: 'THE KEEPER',
          text: "The closet. Off the big room, through the hallway. Games sleep in there. One of them is not sleeping.",
          effect: null,
          next: { room: 'loft_closet' }
        },
        {
          id: 'ep2_s07',
          art: 'studio_warm',
          audio: 'ep2_s07',
          speaker: 'THE KEEPER',
          text: "The box that turned around. Good. You are getting faster. That is... good. That is what the lesson is for. Yes.",
          effect: null,
          next: 'ep2_s08'
        },
        {
          id: 'ep2_s08',
          art: 'studio_warm',
          audio: 'ep2_s08',
          speaker: 'THE KEEPER',
          text: "TODO: author input required — the Keeper gives the second real-world code and where to use it.",
          effect: null,
          next: 'ep2_s09'
        },
        {
          id: 'ep2_s09',
          art: 'studio_warm',
          audio: 'ep2_s09',
          speaker: 'THE KEEPER',
          text: "Off you go. And — one more thing. If a room ever feels like it is looking back at you... that is normal. Perfectly normal. See you next time!",
          effect: null,
          next: { end: true }
        }
      ]
    },

    /* ============ EPISODE 3 — cooling, thinner audience ============
       Tied to the Week 2 rental house. He addresses one specific viewer.
       DRAFT — rewrite freely. */
    {
      id: 'ep3',
      title: 'Episode three — the clock that lies',
      unlockedBy: 'CODE_EP3',
      era: 'cooling',
      scenes: [
        {
          id: 'ep3_s01',
          art: 'studio_cooling',
          audio: 'ep3_s01',
          speaker: 'THE KEEPER',
          text: "Welcome back to Curiosity Hour. Sit anywhere you like. There is... plenty of room today.",
          effect: null,
          next: 'ep3_s02'
        },
        {
          id: 'ep3_s02',
          art: 'studio_cooling',
          audio: 'ep3_s02',
          speaker: 'THE KEEPER',
          text: "You went somewhere new, didn't you. An old house. Rooms you used to know. The method travels with you now. It does that.",
          effect: null,
          next: 'ep3_s03'
        },
        {
          id: 'ep3_s03',
          art: 'studio_cooling',
          audio: 'ep3_s03',
          speaker: 'THE KEEPER',
          text: "TODO: author input required — the line to one specific viewer. He looks at the camera a beat too long when he says it.",
          effect: null,
          next: 'ep3_s04'
        },
        {
          id: 'ep3_s04',
          art: 'studio_cooling',
          audio: 'ep3_s04',
          speaker: 'THE KEEPER',
          text: "Today is harder. Two things are wrong, in two different rooms. I will not say which rooms. You do not need me to. That is the truth I am slowest to say out loud.",
          effect: null,
          next: 'ep3_s05'
        },
        {
          id: 'ep3_s05',
          art: 'studio_cooling',
          audio: 'ep3_s05',
          speaker: 'THE KEEPER',
          text: "Start with a room that belongs to someone who reads. And listen for a machine that has stopped telling the truth.",
          effect: null,
          next: { room: 'dom_room' }
        },
        {
          id: 'ep3_s06',
          art: 'studio_cooling',
          audio: 'ep3_s06',
          speaker: 'THE KEEPER',
          text: "The upside-down book. He would never leave it like that. Which means the room is not finished with you. One more thing is wrong, and it is loud about it, in its way.",
          effect: null,
          next: { room: 'zoe_evie' }
        },
        {
          id: 'ep3_s07',
          art: 'studio_cooling',
          audio: 'ep3_s07',
          speaker: 'THE KEEPER',
          text: "The clock. Stopped. Do you know what a stopped clock is? It is a room holding its breath.",
          effect: null,
          next: 'ep3_s08'
        },
        {
          id: 'ep3_s08',
          art: 'studio_cooling',
          audio: 'ep3_s08',
          speaker: 'THE KEEPER',
          text: "TODO: author input required — the Keeper gives the third real-world code, tied to the rental house clue.",
          effect: null,
          next: 'ep3_s09'
        },
        {
          id: 'ep3_s09',
          art: 'studio_cooling',
          audio: 'ep3_s09',
          speaker: 'THE KEEPER',
          text: "That is the episode. That is — yes. That is all I have written down for today. Go on. Go be somewhere bright.",
          effect: null,
          next: { end: true }
        }
      ]
    },

    /* ============ EPISODE 4 — the last broadcast ============
       Cold. Forced energy, near-empty seats. Cuts to static mid-sentence.
       DRAFT — rewrite freely. */
    {
      id: 'ep4',
      title: 'Episode four — the last broadcast',
      unlockedBy: 'CODE_EP4',
      era: 'cold',
      scenes: [
        {
          id: 'ep4_s01',
          art: 'studio_cold',
          audio: 'ep4_s01',
          speaker: 'THE KEEPER',
          text: "Hello! Hello. Welcome to Curiosity Hour. Big show today. Big, big show.",
          effect: null,
          next: 'ep4_s02'
        },
        {
          id: 'ep4_s02',
          art: 'studio_cold',
          audio: 'ep4_s02',
          speaker: 'THE KEEPER',
          text: "Never mind the seats. Seats are not the show. You are the show. You have always been the show.",
          effect: null,
          next: 'ep4_s03'
        },
        {
          id: 'ep4_s03',
          art: 'studio_cold',
          audio: 'ep4_s03',
          speaker: 'THE KEEPER',
          text: "There is one room left. The one the map never finished. I put off drawing it because... because some doors you only open once.",
          effect: null,
          next: 'ep4_s04'
        },
        {
          id: 'ep4_s04',
          art: 'studio_cold',
          audio: 'ep4_s04',
          speaker: 'THE KEEPER',
          text: "It is drawn now. The far door, end of the hallway. What is wrong in that room is not wrong the way the others were wrong. It is wrong the way a goodbye is wrong.",
          effect: null,
          next: { room: 'mom_dad' }
        },
        {
          id: 'ep4_s05',
          art: 'studio_cold',
          audio: 'ep4_s05',
          speaker: 'THE KEEPER',
          text: "TODO: author input required — the Keeper's reaction to the nightstand letter. The parents are part of it now.",
          effect: null,
          next: 'ep4_s06'
        },
        {
          id: 'ep4_s06',
          art: 'studio_cold',
          audio: 'ep4_s06',
          speaker: 'THE KEEPER',
          text: "TODO: author input required — the fourth code, and the library. The show is running out of episodes and he knows it.",
          effect: null,
          next: 'ep4_s07'
        },
        {
          id: 'ep4_s07',
          art: 'studio_cold',
          audio: 'ep4_s07',
          speaker: 'THE KEEPER',
          text: "Listen. If the show ever stops, it does not mean the looking stops. It means I found the only way left to keep you sa—",
          effect: 'static_cut',
          next: { end: true }
        }
      ]
    }
  ],

  /* ============ THE FRAGMENTS ERA ============
     After Episode 4 there are no episodes. These are notebook pages,
     revealed by codes from the physical hunt (weeks 3 and 4) and by
     the lens puzzle. Paper and handwriting; no broadcast anything.
     DRAFT — rewrite freely. Order here is the order shown. */
  fragments: [
    {
      id: 'frag_w3_1',
      title: 'a torn page — the method',
      audio: 'frag_w3_1',
      text: "TODO: author input required — Week 3 fragment. He did not know, when the show started. Someone taught him the method. He can barely remember who."
    },
    {
      id: 'frag_w3_2',
      title: 'a torn page — the audience',
      audio: 'frag_w3_2',
      text: "TODO: author input required — Week 3 fragment. The realization about the studio audience, and why the show had to go dark."
    },
    {
      id: 'frag_w4_1',
      title: 'a folded page — the lenses',
      audio: 'frag_w4_1',
      text: "TODO: author input required — Week 4 fragment. Three lenses, one order. The instruction page with the three circles.",
      puzzle: 'PUZ_LENSES',
      actionLabel: 'Stack the lenses'
    },
    {
      id: 'frag_finale',
      title: 'the last page',
      audio: 'frag_finale',
      text: "TODO: author input required — the last written page. It should not explain everything. It should just say where the box is, and that he wanted them to find it.",
      handoff: true,
      actionLabel: 'Play the last tape'
    }
  ],

  /* The letter shown on the handoff screen, under Dom's real video.
     Out of character, no Keeper. */
  handoffLetter: "TODO: author input required — Dom's real letter, in his own words. The warmth is the point of the whole exercise; land it fully and without irony."
};
