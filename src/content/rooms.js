/* ================================================================
   THE HOUSE — this file is safe to edit.

   Each room has objects. Each object has:
   - box: [x, y, width, height] on the 640x360 screen — where it is
   - look: what the Keeper says when it is clicked (required)
   - audio: the recording for that line (optional)
   - anomaly: ONLY if this object is the wrong thing in a chapter.
     The same object can be normal in Episode 1 and wrong in Episode 3,
     so anomaly can also be a LIST: [ {chapter:'ep1',...}, {chapter:'ep3',...} ].

   Exits move between rooms. An exit with "blocked" text instead of a
   destination goes nowhere and says so (the Keeper never mapped
   downstairs).

   Hitboxes below are rough grid guesses marked TODO — retune them
   when the real room art is in, using the dev screen's hitbox view.

   All "look" lines are DRAFTS for Dom to rewrite. The other seven
   rooms arrive with the full content pass (milestone 6).
   ================================================================ */

window.ROOMS = {
  loft: {
    id: 'loft',
    name: 'The loft',
    art: 'room_loft',
    enterText: "The loft. You know this room. That is the point.",
    exits: [
      {
        to: 'hallway', label: 'Hallway',
        box: [560, 100, 70, 180]   /* TODO: retune hitbox to real art */
      },
      {
        label: 'Downstairs',
        box: [10, 190, 60, 140],   /* TODO: retune hitbox to real art */
        blocked: "The stairs go down. The picture stops there. He never drew the rest of the house. Odd."
      }
    ],
    objects: [
      {
        id: 'loft_halfwall',
        name: 'Half-wall counter',
        box: [90, 200, 170, 60],   /* TODO: retune hitbox to real art */
        look: "A low white wall you can see over. Things collect on top of it. They always have."
      },
      {
        id: 'loft_sectional',
        name: 'Sectional',
        box: [280, 220, 200, 90],  /* TODO: retune hitbox to real art */
        look: "The big couch. Everyone has a spot. Nobody agreed on the spots. It just happened."
      },
      {
        id: 'loft_office_chair',
        name: 'Office chair',
        box: [500, 230, 60, 80],   /* TODO: retune hitbox to real art */
        look: "It spins. You know it spins. You have tested this many times."
      },
      {
        id: 'loft_ceiling_fan',
        name: 'Ceiling fan',
        box: [270, 10, 110, 50],   /* TODO: retune hitbox to real art */
        look: "Round and round. The chain clicks. On the highest setting it wobbles a little, like it is nervous."
      },
      {
        id: 'loft_window',
        name: 'Window and blinds',
        box: [430, 40, 110, 110],  /* TODO: retune hitbox to real art */
        look: "The blinds never hang quite straight. Light comes through in stripes in the afternoon."
      },
      {
        id: 'loft_shelf_figures',
        name: 'Shelf above the window',
        box: [420, 10, 130, 28],   /* TODO: retune hitbox to real art */
        look: "Little figures stand in a row up there. They watch the room. In a friendly way. Probably."
      },
      {
        id: 'loft_canvas',
        name: 'Superhero canvas',
        box: [40, 60, 90, 110],    /* TODO: retune hitbox to real art */
        look: "A hero mid-leap. He has been mid-leap for years. Take your time. We believe in you."
      },
      {
        id: 'loft_frames',
        name: 'Framed pictures',
        box: [180, 60, 110, 90],   /* TODO: retune hitbox to real art */
        look: "Three of them. He always liked the middle one best. Ask him why and he changes the subject.",
        audio: 'loft_frames_look',
        anomaly: {
          chapter: 'ep1',
          text: "That one is crooked. It was not crooked a moment ago.",
          audio: 'loft_frames_anomaly',
          solves: 'PUZ_EP1_LOFT'
        }
      },
      {
        id: 'loft_tv',
        name: 'TV',
        box: [320, 120, 130, 80],  /* TODO: retune hitbox to real art */
        look: "Dark and quiet. It reflects the room back at you, slightly stretched."
      }
    ]
  }
};
