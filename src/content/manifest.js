/* ================================================================
   THE ASSET LIST — this file is safe to edit.

   Every picture and every recording the game uses is named here.
   The game NEVER breaks over a missing file: it draws a placeholder,
   notes it on the dev screen, and keeps going.

   art:   files live in assets/art/    — 640x360 PNG
   audio: files live in assets/audio/  — MP3
   ================================================================ */

window.ASSETS = {
  art: {
    room_loft:   { file: 'assets/art/room_loft.png',   w: 640, h: 360, alt: 'The loft' },
    studio_warm: { file: 'assets/art/studio_warm.png', w: 640, h: 360, alt: 'The studio, lights up, audience in' }
  },
  audio: {
    ep1_s01: { file: 'assets/audio/ep1_s01.mp3', approxSeconds: 6 },
    ep1_s02: { file: 'assets/audio/ep1_s02.mp3', approxSeconds: 6 }
  }
};
