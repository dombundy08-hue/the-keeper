# ch-tape

A small offline point-and-click game in the style of mid-90s edutainment
shovelware. Single HTML file, vanilla JS, no build step needed to play.

## Play

Open `index.html` in a browser. That's it. Works from a USB stick with no
internet connection.

## Edit the story

Everything the game says and shows lives in four plain files under
`src/content/`. Each file starts with instructions. No programming needed —
keep every comma and quote mark, and if the game shows "The show hit a snag",
check your most recent edit.

## Build

```
node build.js
```

Checks the content for mistakes (and refuses to build if it finds any), then
writes a fully self-contained copy to `dist/` plus `dist/the-keeper.zip` for
offline use, and regenerates the docs.

Open the game with `?validate=1` after the address for the same content check
in the browser, or `?dev=1` (local only) for the author tools.
