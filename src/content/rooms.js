/* ================================================================
   THE HOUSE — this file is safe to edit.

   Each room has objects. Each object has:
   - box: [x, y, width, height] on the 640x360 screen — where it is
   - look: what the Keeper says when it is clicked (required)
   - audio: the recording for that line (optional)
   - anomaly: ONLY if this object is the wrong thing in a chapter.
     The same object can be normal in Episode 1 and wrong in Episode 3.

   Room view is built in milestone 3. The loft below is the working
   example; the other seven rooms are added with the content pass.
   ================================================================ */

window.ROOMS = {
  loft: {
    id: 'loft',
    name: 'The loft',
    art: 'room_loft',
    exits: [
      { to: 'hallway', label: 'Hallway', box: [520, 120, 90, 200] }
    ],
    objects: [
      {
        id: 'loft_frames',
        name: 'Framed pictures',
        box: [180, 60, 110, 90],
        look: "Three of them. He always liked the middle one best. Ask him why and he changes the subject.",
        audio: 'loft_frames_look',
        anomaly: {
          chapter: 'ep1',
          text: "That one is crooked. It was not crooked a moment ago.",
          audio: 'loft_frames_anomaly',
          solves: 'PUZ_EP1_LOFT'
        }
      }
    ]
  }
};
