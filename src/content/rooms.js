/* ================================================================
   THE HOUSE — this file is safe to edit.

   Each room has objects. Each object has:
   - box: [x, y, width, height] on the 640x360 screen — where it is
   - look: what the Keeper says when it is clicked (required)
   - audio: the recording for that line (optional)
   - anomaly: ONLY if this object is the wrong thing in a chapter.
     Can be one { chapter: 'ep1', ... } or a LIST of them, because the
     same object can be normal in Episode 1 and wrong in Episode 3.

   Exits move between rooms. An exit with "blocked" text goes nowhere
   and says so. "blockedUntil: 'ep4'" unblocks when that chapter opens.

   EVERY hitbox below is a rough grid guess marked TODO — retune them
   against the real photographs using the dev screen (?dev=1).
   Every "look" line is a DRAFT for Dom to rewrite in his own voice.
   ================================================================ */

window.ROOMS = {

  /* ---------------- THE LOFT (hub) ---------------- */
  loft: {
    id: 'loft',
    name: 'The loft',
    art: 'room_loft',
    enterText: "The loft. You know this room. That is the point.",
    exits: [
      {
        to: 'hallway', label: 'Hallway',
        box: [560, 100, 70, 180]   /* TODO: retune hitbox */
      },
      {
        label: 'Downstairs',
        box: [10, 190, 60, 140],   /* TODO: retune hitbox */
        blocked: "The stairs go down. The picture stops there. He never drew the rest of the house. Odd."
      }
    ],
    objects: [
      {
        id: 'loft_halfwall',
        name: 'Half-wall counter',
        box: [90, 200, 170, 60],   /* TODO: retune hitbox */
        audio: 'loft_halfwall',
        look: "A low white wall you can see over. Things collect on top of it. They always have."
      },
      {
        id: 'loft_sectional',
        name: 'Sectional',
        box: [280, 220, 200, 90],  /* TODO: retune hitbox */
        audio: 'loft_sectional',
        look: "The big couch. Everyone has a spot. Nobody agreed on the spots. It just happened."
      },
      {
        id: 'loft_office_chair',
        name: 'Office chair',
        box: [500, 230, 60, 80],   /* TODO: retune hitbox */
        audio: 'loft_office_chair',
        look: "It spins. You know it spins. You have tested this many times."
      },
      {
        id: 'loft_ceiling_fan',
        name: 'Ceiling fan',
        box: [270, 10, 110, 50],   /* TODO: retune hitbox */
        audio: 'loft_ceiling_fan',
        look: "Round and round. The chain clicks. On the highest setting it wobbles a little, like it is nervous."
      },
      {
        id: 'loft_window',
        name: 'Window and blinds',
        box: [430, 40, 110, 110],  /* TODO: retune hitbox */
        audio: 'loft_window',
        look: "The blinds never hang quite straight. Light comes through in stripes in the afternoon."
      },
      {
        id: 'loft_shelf_figures',
        name: 'Shelf above the window',
        box: [420, 10, 130, 28],   /* TODO: retune hitbox */
        audio: 'loft_shelf_figures',
        look: "Little figures stand in a row up there. They watch the room. In a friendly way. Probably."
      },
      {
        id: 'loft_canvas',
        name: 'Superhero canvas',
        box: [40, 60, 90, 110],    /* TODO: retune hitbox */
        audio: 'loft_canvas',
        look: "A hero mid-leap. He has been mid-leap for years. Take your time. We believe in you."
      },
      {
        id: 'loft_frames',
        name: 'Framed pictures',
        box: [180, 60, 110, 90],   /* TODO: retune hitbox */
        audio: 'loft_frames_look',
        look: "Three of them. He always liked the middle one best. Ask him why and he changes the subject.",
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
        box: [320, 120, 130, 80],  /* TODO: retune hitbox */
        audio: 'loft_tv',
        look: "Dark and quiet. It reflects the room back at you, slightly stretched."
      }
    ]
  },

  /* ---------------- THE HALLWAY (spine) ---------------- */
  hallway: {
    id: 'hallway',
    name: 'The hallway',
    art: 'room_hallway',
    enterText: "A straight hallway. Four doors and a vent that watches.",
    exits: [
      { to: 'loft',        label: 'Back to the loft', box: [10, 120, 55, 180] },   /* TODO: retune */
      { to: 'loft_closet', label: 'Closet door',      box: [110, 100, 70, 170] },  /* TODO: retune */
      { to: 'dom_room',    label: "Dom's door",       box: [220, 100, 70, 170] },  /* TODO: retune */
      { to: 'bathroom',    label: 'Bathroom door',    box: [330, 100, 70, 170] },  /* TODO: retune */
      { to: 'zoe_evie',    label: "Zoe and Evie's door", box: [440, 100, 70, 170] }, /* TODO: retune */
      {
        to: 'mom_dad', label: 'The far door',
        box: [550, 100, 70, 170],  /* TODO: retune */
        blockedUntil: 'ep4',
        blocked: "This door is... smudged. Like the map forgot it while drawing. He never finished this room. I wonder why."
      }
    ],
    objects: [
      {
        id: 'hall_print',
        name: 'Signed print',
        box: [150, 40, 90, 60],    /* TODO: retune hitbox */
        audio: 'hall_print',
        look: "Signed in the corner. A real signature means a real person stood here once, holding a pen."
      },
      {
        id: 'hall_register',
        name: 'Floor register',
        box: [280, 300, 80, 30],   /* TODO: retune hitbox */
        audio: 'hall_register',
        look: "Warm air in winter. Cold toes in summer. A grate like a little jail for the weather."
      },
      {
        id: 'hall_vent',
        name: 'High air return',
        box: [380, 20, 90, 45],    /* TODO: retune hitbox */
        audio: 'hall_vent',
        look: "Up high. Slats like half-closed eyes. It hums when the fan kicks on. It is just a vent. Almost certainly."
      },
      {
        id: 'hall_switch',
        name: 'Light switch',
        box: [90, 170, 25, 40],    /* TODO: retune hitbox */
        audio: 'hall_switch',
        look: "Click. Clack. The most honest machine in the house. It does exactly one thing and never lies about it."
      }
    ]
  },

  /* ---------------- THE LOFT CLOSET ---------------- */
  loft_closet: {
    id: 'loft_closet',
    name: 'The loft closet',
    art: 'room_loft_closet',
    enterText: "Games, maps, and boxes. Every closet is a museum if you stand still long enough.",
    exits: [
      { to: 'hallway', label: 'Back to the hallway', box: [10, 120, 55, 180] }  /* TODO: retune */
    ],
    objects: [
      {
        id: 'closet_games',
        name: 'Board game shelf',
        box: [80, 60, 180, 120],   /* TODO: retune hitbox */
        audio: 'closet_games',
        look: "Life. Pictionary. Finding Dory. What Do You Meme. And a box called Sharing and Caring, which nobody remembers buying.",
        anomaly: {
          chapter: 'ep2',
          text: "The Sharing and Caring box. It is upside down. Boxes do not turn themselves over. Someone wanted it noticed.",
          audio: 'closet_games_anomaly',
          solves: 'PUZ_EP2_CLOSET'
        }
      },
      {
        id: 'closet_map',
        name: 'Texas map poster',
        box: [300, 40, 130, 170],  /* TODO: retune hitbox */
        audio: 'closet_map',
        look: "Texas. Enormous. Every town a little dot with a name. Some dots keep more secrets than others."
      },
      {
        id: 'closet_dvds',
        name: 'Stacked DVD cases',
        box: [460, 90, 90, 100],   /* TODO: retune hitbox */
        audio: 'closet_dvds',
        look: "A tower of movies nobody watches anymore. Nobody checks inside old cases. That is worth remembering."
      },
      {
        id: 'closet_books',
        name: 'Cubby shelf with books',
        box: [80, 200, 180, 90],   /* TODO: retune hitbox */
        audio: 'closet_books',
        look: "Books in cubbies. Some read a hundred times. Some never. The never ones feel left out."
      },
      {
        id: 'closet_basket',
        name: 'Wicker basket',
        box: [300, 230, 110, 80],  /* TODO: retune hitbox */
        audio: 'closet_basket',
        look: "A basket that holds whatever the house cannot decide about. The undecided pile. Every home has one."
      }
    ]
  },

  /* ---------------- DOM'S ROOM ---------------- */
  dom_room: {
    id: 'dom_room',
    name: "Dom's room",
    art: 'room_dom',
    enterText: "His room. It smells like him thinking.",
    exits: [
      { to: 'hallway', label: 'Back to the hallway', box: [10, 120, 55, 180] }  /* TODO: retune */
    ],
    objects: [
      {
        id: 'dom_bookshelves',
        name: 'Tall bookshelves',
        box: [60, 40, 150, 220],   /* TODO: retune hitbox */
        audio: 'dom_bookshelves',
        look: "Two towers of spines. He knows where every single one lives. Move one and see what happens. Actually, do not.",
        anomaly: {
          chapter: 'ep3',
          text: "A book is upside down. He would never. He would NEVER. Someone has been here.",
          audio: 'dom_bookshelves_anomaly',
          solves: 'PUZ_EP3_SHELF'
        }
      },
      {
        id: 'dom_floating_shelf',
        name: 'Floating shelf',
        box: [240, 50, 130, 40],   /* TODO: retune hitbox */
        audio: 'dom_floating_shelf',
        look: "Framed art and little figures, arranged just so. Not decoration. A museum with one visitor."
      },
      {
        id: 'dom_posters',
        name: 'Anime posters',
        box: [400, 30, 150, 130],  /* TODO: retune hitbox */
        audio: 'dom_posters',
        look: "Heroes on a dark wall. Big eyes, bigger swords. He can explain every one of them for an hour. Do not ask unless you mean it."
      },
      {
        id: 'dom_window',
        name: 'Window and blinds',
        box: [280, 100, 100, 110], /* TODO: retune hitbox */
        audio: 'dom_window',
        look: "His window. The blinds are usually half open. Enough to see out. Not enough to see in."
      },
      {
        id: 'dom_bed',
        name: 'Bed',
        box: [230, 220, 220, 90],  /* TODO: retune hitbox */
        audio: 'dom_bed',
        look: "Made. Mostly. The pillow knows more than it says."
      },
      {
        id: 'dom_nightstand',
        name: 'Black nightstand',
        box: [470, 210, 80, 80],   /* TODO: retune hitbox */
        audio: 'dom_nightstand',
        look: "A drawer, a lamp, a coaster. Standard issue. The drawer sticks a little, like it is deciding whether to open."
      }
    ]
  },

  /* ---------------- THE BATHROOM ---------------- */
  bathroom: {
    id: 'bathroom',
    name: 'The bathroom',
    art: 'room_bathroom',
    enterText: "Tile and echo. Every sound in here is ten percent louder.",
    exits: [
      { to: 'hallway', label: 'Back to the hallway', box: [10, 120, 55, 180] }  /* TODO: retune */
    ],
    objects: [
      {
        id: 'bath_vanity',
        name: 'Double-sink vanity',
        box: [80, 180, 220, 110],  /* TODO: retune hitbox */
        audio: 'bath_vanity',
        look: "Two sinks. In the morning that is not enough sinks. Physics cannot explain it."
      },
      {
        id: 'bath_mirror',
        name: 'Wall mirror',
        box: [80, 40, 220, 120],   /* TODO: retune hitbox */
        audio: 'bath_mirror',
        look: "A big honest mirror. It shows the room backwards. Backwards is still true. Remember that."
      },
      {
        id: 'bath_tub',
        name: 'Tub with subway tile',
        box: [340, 150, 200, 140], /* TODO: retune hitbox */
        audio: 'bath_tub',
        look: "White brick tile, straight lines, a soap dish carved into the wall. Clean lines keep secrets badly."
      },
      {
        id: 'bath_curtain',
        name: 'Shower curtain',
        box: [340, 30, 200, 120],  /* TODO: retune hitbox */
        audio: 'bath_curtain',
        look: "It is just a curtain. Nothing is behind it. Check anyway. You were going to check anyway."
      },
      {
        id: 'bath_linen',
        name: 'Linen closet',
        box: [560, 60, 70, 220],   /* TODO: retune hitbox */
        audio: 'bath_linen',
        look: "Towels, sheets, and on the top shelf a spare air filter, standing guard over absolutely nothing. Top shelves are where the house keeps its forgetting."
      }
    ]
  },

  /* ---------------- ZOE & EVIE'S ROOM ---------------- */
  zoe_evie: {
    id: 'zoe_evie',
    name: "Zoe and Evie's room",
    art: 'room_zoe_evie',
    enterText: "Two people, one room, a treaty older than either remembers signing.",
    exits: [
      { to: 'hallway', label: 'Back to the hallway', box: [10, 120, 55, 180] }  /* TODO: retune */
    ],
    objects: [
      {
        id: 'ze_bunks',
        name: 'Loft bunk beds',
        box: [60, 40, 180, 250],   /* TODO: retune hitbox */
        audio: 'ze_bunks',
        look: "Stickers on the posts. Layers of them. An archaeology of favourite things, oldest at the bottom."
      },
      {
        id: 'ze_dresser',
        name: 'Dresser and mirror',
        box: [270, 120, 130, 140], /* TODO: retune hitbox */
        audio: 'ze_dresser',
        look: "The mirror on top has seen a thousand outfits and kept every opinion to itself."
      },
      {
        id: 'ze_armoire',
        name: 'Jewelry armoire',
        box: [420, 140, 70, 120],  /* TODO: retune hitbox */
        audio: 'ze_armoire',
        look: "Little drawers inside little doors. A cabinet made of hiding places. Whoever invented it understood something important."
      },
      {
        id: 'ze_clock',
        name: 'Digital display',
        box: [300, 90, 70, 28],    /* TODO: retune hitbox */
        audio: 'ze_clock',
        look: "It knows the day and the time and announces both, smugly, in glowing letters.",
        anomaly: {
          chapter: 'ep3',
          text: "It is stuck. The minutes are not moving. Time does not stop. So the clock is lying. Why would a clock lie?",
          audio: 'ze_clock_anomaly',
          solves: 'PUZ_EP3_CLOCK'
        }
      },
      {
        id: 'ze_desk',
        name: 'Desk under the window',
        box: [500, 160, 120, 100], /* TODO: retune hitbox */
        audio: 'ze_desk',
        look: "A desk for homework, currently doing everything except homework."
      },
      {
        id: 'ze_fan',
        name: 'Ceiling fan',
        box: [280, 10, 110, 50],   /* TODO: retune hitbox */
        audio: 'ze_fan',
        look: "It turns slowly even on the fast setting. It is doing its best."
      },
      {
        id: 'ze_accent_wall',
        name: 'Red-dash accent wall',
        box: [430, 20, 200, 110],  /* TODO: retune hitbox */
        audio: 'ze_accent_wall',
        look: "Little red dashes, marching in rows. Count them if you like. The number is not the secret. Probably."
      },
      {
        id: 'ze_photo',
        name: 'Taped photo',
        box: [255, 60, 40, 30],    /* TODO: retune hitbox */
        audio: 'ze_photo',
        look: "Taped, not framed. Taped means chosen in a hurry and loved anyway."
      },
      {
        id: 'ze_switch',
        name: 'Three-gang light switch',
        box: [240, 170, 30, 45],   /* TODO: retune hitbox */
        audio: 'ze_switch',
        look: "Three switches. Two are obvious. Nobody has ever proven what the third one does."
      }
    ]
  },

  /* ---------------- MOM & DAD'S ROOM ----------------
     No reference photos yet, so the gap IS the story: a smear until
     Episode 4 resolves it. Drop the real art in as room_mom_dad.png
     and it appears with no code change. */
  mom_dad: {
    id: 'mom_dad',
    name: "Mom and dad's room",
    art: 'room_mom_dad_smear',
    resolvesIn: 'ep4',
    resolvedArt: 'room_mom_dad',
    enterText: "TODO: author input required — the Keeper's line when this room finally resolves in Episode 4.",
    exits: [
      { to: 'hallway', label: 'Back to the hallway', box: [10, 120, 55, 180] }  /* TODO: retune */
    ],
    objects: [
      {
        id: 'md_nightstand',
        name: 'The nightstand',
        box: [420, 200, 100, 90],  /* TODO: retune hitbox */
        audio: 'md_nightstand',
        look: "TODO: author input required — ordinary look line.",
        anomaly: {
          chapter: 'ep4',
          text: "TODO: author input required — the nightstand letter beat that pulls the parents into the story.",
          audio: 'md_nightstand_anomaly',
          solves: 'PUZ_EP4_NIGHTSTAND'
        }
      }
    ]
  }
};
