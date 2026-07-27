/* ================================================================
   THE ASSET LIST — this file is safe to edit.

   Every picture and every recording the game uses is named here.
   The game NEVER breaks over a missing file: it draws a placeholder,
   notes it on the dev screen, and keeps going.

   art:   files live in assets/art/    — 640x360 PNG
   audio: files live in assets/audio/  — MP3

   None of these files exist yet — that is fine. Drop a file into the
   right folder with the right name and it starts working, no other
   change needed. The dev screen (?dev=1) shows what is still missing.
   ================================================================ */

window.ASSETS = {
  art: {
    /* studio, one per era */
    studio_warm:    { file: 'assets/art/studio_warm.png',    w: 640, h: 360, alt: 'The studio, lights up, audience in' },
    studio_cooling: { file: 'assets/art/studio_cooling.png', w: 640, h: 360, alt: 'The studio, dimmer, seats thinning' },
    studio_cold:    { file: 'assets/art/studio_cold.png',    w: 640, h: 360, alt: 'The studio, near empty, colours failing' },

    /* the house */
    room_loft:         { file: 'assets/art/room_loft.png',         w: 640, h: 360, alt: 'The loft' },
    room_hallway:      { file: 'assets/art/room_hallway.png',      w: 640, h: 360, alt: 'The upstairs hallway' },
    room_loft_closet:  { file: 'assets/art/room_loft_closet.png',  w: 640, h: 360, alt: 'The loft closet' },
    room_dom:          { file: 'assets/art/room_dom.png',          w: 640, h: 360, alt: "Dom's room" },
    room_bathroom:     { file: 'assets/art/room_bathroom.png',     w: 640, h: 360, alt: 'The bathroom' },
    room_zoe_evie:     { file: 'assets/art/room_zoe_evie.png',     w: 640, h: 360, alt: "Zoe and Evie's room" },
    room_mom_dad_smear:{ file: 'assets/art/room_mom_dad_smear.png',w: 640, h: 360, alt: 'A room the map never finished — smeared, low confidence' },
    room_mom_dad:      { file: 'assets/art/room_mom_dad.png',      w: 640, h: 360, alt: "Mom and dad's room, finally real" }
  },
  audio: {
    /* ---- Episode 1 (20 lines, per the recording script) ---- */
    ep1_s01: { file: 'assets/audio/ep1_s01.mp3', approxSeconds: 5 },
    ep1_s02: { file: 'assets/audio/ep1_s02.mp3', approxSeconds: 8 },
    ep1_s03: { file: 'assets/audio/ep1_s03.mp3', approxSeconds: 7 },
    ep1_s04: { file: 'assets/audio/ep1_s04.mp3', approxSeconds: 8 },
    ep1_s05: { file: 'assets/audio/ep1_s05.mp3', approxSeconds: 7 },
    ep1_s06: { file: 'assets/audio/ep1_s06.mp3', approxSeconds: 6 },
    ep1_s07: { file: 'assets/audio/ep1_s07.mp3', approxSeconds: 5 },
    ep1_s08: { file: 'assets/audio/ep1_s08.mp3', approxSeconds: 4 },  /* holds a 1s silence — do not trim */
    ep1_s09: { file: 'assets/audio/ep1_s09.mp3', approxSeconds: 4 },
    ep1_s10: { file: 'assets/audio/ep1_s10.mp3', approxSeconds: 3 },
    ep1_s11: { file: 'assets/audio/ep1_s11.mp3', approxSeconds: 7 },
    ep1_s12: { file: 'assets/audio/ep1_s12.mp3', approxSeconds: 3 },
    ep1_s13: { file: 'assets/audio/ep1_s13.mp3', approxSeconds: 8 },
    ep1_s14: { file: 'assets/audio/ep1_s14.mp3', approxSeconds: 5 },
    ep1_s15: { file: 'assets/audio/ep1_s15.mp3', approxSeconds: 4 },  /* holds 2s of room tone first — do not trim */
    ep1_s16: { file: 'assets/audio/ep1_s16.mp3', approxSeconds: 6 },
    ep1_s17: { file: 'assets/audio/ep1_s17.mp3', approxSeconds: 6 },
    ep1_s18: { file: 'assets/audio/ep1_s18.mp3', approxSeconds: 5 },
    ep1_s19: { file: 'assets/audio/ep1_s19.mp3', approxSeconds: 5 },
    ep1_s20: { file: 'assets/audio/ep1_s20.mp3', approxSeconds: 4 },

    /* the channel bug's stutter during ep1_s11 */
    bug_static_short: { file: 'assets/audio/bug_static_short.mp3', approxSeconds: 1 },

    /* ---- Episode 2 ---- */
    ep2_s01: { file: 'assets/audio/ep2_s01.mp3', approxSeconds: 8 },
    ep2_s02: { file: 'assets/audio/ep2_s02.mp3', approxSeconds: 8 },
    ep2_s03: { file: 'assets/audio/ep2_s03.mp3', approxSeconds: 9 },
    ep2_s04: { file: 'assets/audio/ep2_s04.mp3', approxSeconds: 8 },
    ep2_s05: { file: 'assets/audio/ep2_s05.mp3', approxSeconds: 8 },
    ep2_s06: { file: 'assets/audio/ep2_s06.mp3', approxSeconds: 7 },
    ep2_s07: { file: 'assets/audio/ep2_s07.mp3', approxSeconds: 8 },
    ep2_s08: { file: 'assets/audio/ep2_s08.mp3', approxSeconds: 8 },
    ep2_s09: { file: 'assets/audio/ep2_s09.mp3', approxSeconds: 10 },

    /* ---- Episode 3 ---- */
    ep3_s01: { file: 'assets/audio/ep3_s01.mp3', approxSeconds: 7 },
    ep3_s02: { file: 'assets/audio/ep3_s02.mp3', approxSeconds: 9 },
    ep3_s03: { file: 'assets/audio/ep3_s03.mp3', approxSeconds: 8 },
    ep3_s04: { file: 'assets/audio/ep3_s04.mp3', approxSeconds: 11 },
    ep3_s05: { file: 'assets/audio/ep3_s05.mp3', approxSeconds: 8 },
    ep3_s06: { file: 'assets/audio/ep3_s06.mp3', approxSeconds: 11 },
    ep3_s07: { file: 'assets/audio/ep3_s07.mp3', approxSeconds: 8 },
    ep3_s08: { file: 'assets/audio/ep3_s08.mp3', approxSeconds: 8 },
    ep3_s09: { file: 'assets/audio/ep3_s09.mp3', approxSeconds: 9 },

    /* ---- Episode 4 ---- */
    ep4_s01: { file: 'assets/audio/ep4_s01.mp3', approxSeconds: 7 },
    ep4_s02: { file: 'assets/audio/ep4_s02.mp3', approxSeconds: 8 },
    ep4_s03: { file: 'assets/audio/ep4_s03.mp3', approxSeconds: 10 },
    ep4_s04: { file: 'assets/audio/ep4_s04.mp3', approxSeconds: 11 },
    ep4_s05: { file: 'assets/audio/ep4_s05.mp3', approxSeconds: 8 },
    ep4_s06: { file: 'assets/audio/ep4_s06.mp3', approxSeconds: 8 },
    ep4_s07: { file: 'assets/audio/ep4_s07.mp3', approxSeconds: 9 },

    /* ---- Room commentary: the loft ---- */
    loft_halfwall:      { file: 'assets/audio/loft_halfwall.mp3',      approxSeconds: 6 },
    loft_sectional:     { file: 'assets/audio/loft_sectional.mp3',     approxSeconds: 7 },
    loft_office_chair:  { file: 'assets/audio/loft_office_chair.mp3',  approxSeconds: 5 },
    loft_ceiling_fan:   { file: 'assets/audio/loft_ceiling_fan.mp3',   approxSeconds: 7 },
    loft_window:        { file: 'assets/audio/loft_window.mp3',        approxSeconds: 6 },
    loft_shelf_figures: { file: 'assets/audio/loft_shelf_figures.mp3', approxSeconds: 6 },
    loft_canvas:        { file: 'assets/audio/loft_canvas.mp3',        approxSeconds: 6 },
    loft_tv:                 { file: 'assets/audio/loft_tv.mp3',                 approxSeconds: 5 },
    ep1_loft_frames_look:    { file: 'assets/audio/ep1_loft_frames_look.mp3',    approxSeconds: 7 },
    ep1_loft_frames_anomaly: { file: 'assets/audio/ep1_loft_frames_anomaly.mp3', approxSeconds: 5 },

    /* ---- Room commentary: the hallway ---- */
    hall_print:    { file: 'assets/audio/hall_print.mp3',    approxSeconds: 6 },
    hall_register: { file: 'assets/audio/hall_register.mp3', approxSeconds: 6 },
    hall_vent:     { file: 'assets/audio/hall_vent.mp3',     approxSeconds: 7 },
    hall_switch:   { file: 'assets/audio/hall_switch.mp3',   approxSeconds: 6 },

    /* ---- Room commentary: the loft closet ---- */
    closet_games:         { file: 'assets/audio/closet_games.mp3',         approxSeconds: 8 },
    closet_games_anomaly: { file: 'assets/audio/closet_games_anomaly.mp3', approxSeconds: 7 },
    closet_map:           { file: 'assets/audio/closet_map.mp3',           approxSeconds: 7 },
    closet_dvds:          { file: 'assets/audio/closet_dvds.mp3',          approxSeconds: 6 },
    closet_books:         { file: 'assets/audio/closet_books.mp3',         approxSeconds: 6 },
    closet_basket:        { file: 'assets/audio/closet_basket.mp3',        approxSeconds: 6 },

    /* ---- Room commentary: Dom's room ---- */
    dom_bookshelves:         { file: 'assets/audio/dom_bookshelves.mp3',         approxSeconds: 7 },
    dom_bookshelves_anomaly: { file: 'assets/audio/dom_bookshelves_anomaly.mp3', approxSeconds: 6 },
    dom_floating_shelf:      { file: 'assets/audio/dom_floating_shelf.mp3',      approxSeconds: 6 },
    dom_posters:             { file: 'assets/audio/dom_posters.mp3',             approxSeconds: 8 },
    dom_window:              { file: 'assets/audio/dom_window.mp3',              approxSeconds: 6 },
    dom_bed:                 { file: 'assets/audio/dom_bed.mp3',                 approxSeconds: 4 },
    dom_nightstand:          { file: 'assets/audio/dom_nightstand.mp3',          approxSeconds: 6 },

    /* ---- Room commentary: the bathroom ---- */
    bath_vanity:  { file: 'assets/audio/bath_vanity.mp3',  approxSeconds: 6 },
    bath_mirror:  { file: 'assets/audio/bath_mirror.mp3',  approxSeconds: 6 },
    bath_tub:     { file: 'assets/audio/bath_tub.mp3',     approxSeconds: 6 },
    bath_curtain: { file: 'assets/audio/bath_curtain.mp3', approxSeconds: 6 },
    bath_linen:   { file: 'assets/audio/bath_linen.mp3',   approxSeconds: 8 },

    /* ---- Room commentary: Zoe and Evie's room ---- */
    ze_bunks:         { file: 'assets/audio/ze_bunks.mp3',         approxSeconds: 7 },
    ze_dresser:       { file: 'assets/audio/ze_dresser.mp3',       approxSeconds: 6 },
    ze_armoire:       { file: 'assets/audio/ze_armoire.mp3',       approxSeconds: 8 },
    ze_clock:         { file: 'assets/audio/ze_clock.mp3',         approxSeconds: 6 },
    ze_clock_anomaly: { file: 'assets/audio/ze_clock_anomaly.mp3', approxSeconds: 8 },
    ze_desk:          { file: 'assets/audio/ze_desk.mp3',          approxSeconds: 5 },
    ze_fan:           { file: 'assets/audio/ze_fan.mp3',           approxSeconds: 5 },
    ze_accent_wall:   { file: 'assets/audio/ze_accent_wall.mp3',   approxSeconds: 7 },
    ze_photo:         { file: 'assets/audio/ze_photo.mp3',         approxSeconds: 5 },
    ze_switch:        { file: 'assets/audio/ze_switch.mp3',        approxSeconds: 6 },

    /* ---- Room commentary: mom and dad's room ---- */
    md_nightstand:         { file: 'assets/audio/md_nightstand.mp3',         approxSeconds: 6 },
    md_nightstand_anomaly: { file: 'assets/audio/md_nightstand_anomaly.mp3', approxSeconds: 8 },

    /* ---- Fragments era: raw unaired audio ---- */
    frag_w3_1:   { file: 'assets/audio/frag_w3_1.mp3',   approxSeconds: 20 },
    frag_w3_2:   { file: 'assets/audio/frag_w3_2.mp3',   approxSeconds: 20 },
    frag_w4_1:   { file: 'assets/audio/frag_w4_1.mp3',   approxSeconds: 20 },
    frag_finale: { file: 'assets/audio/frag_finale.mp3', approxSeconds: 25 }
  },

  /* Dom's real video, for the handoff screen. Not pixel art. Not the
     Keeper. Drop the file in and the slot plays it. */
  video: {
    dom_final: { file: 'assets/video/dom_final.mp4', approxSeconds: 0 }
  }
};
