/* ================================================================
   THE ASSET LIST — this file is safe to edit.

   Every picture and every recording the game uses is named here.
   The game NEVER breaks over a missing file: it draws a placeholder,
   notes it on the dev screen, and keeps going.

   art:   files live in assets/art/    — 640x360 PNG
   audio: files live in assets/audio/  — MP3

   None of these files exist yet — that is fine. Drop a file into the
   right folder with the right name and it starts working, no other
   change needed.
   ================================================================ */

window.ASSETS = {
  art: {
    room_loft:   { file: 'assets/art/room_loft.png',   w: 640, h: 360, alt: 'The loft' },
    studio_warm: { file: 'assets/art/studio_warm.png', w: 640, h: 360, alt: 'The studio, lights up, audience in' }
  },
  audio: {
    ep1_s01: { file: 'assets/audio/ep1_s01.mp3', approxSeconds: 7 },
    ep1_s02: { file: 'assets/audio/ep1_s02.mp3', approxSeconds: 7 },
    ep1_s03: { file: 'assets/audio/ep1_s03.mp3', approxSeconds: 6 },
    ep1_s04: { file: 'assets/audio/ep1_s04.mp3', approxSeconds: 7 },
    ep1_s05: { file: 'assets/audio/ep1_s05.mp3', approxSeconds: 9 },
    ep1_s06: { file: 'assets/audio/ep1_s06.mp3', approxSeconds: 6 },
    ep1_s07: { file: 'assets/audio/ep1_s07.mp3', approxSeconds: 8 },
    ep1_s08: { file: 'assets/audio/ep1_s08.mp3', approxSeconds: 9 },
    ep1_s09: { file: 'assets/audio/ep1_s09.mp3', approxSeconds: 5 }
  }
};
