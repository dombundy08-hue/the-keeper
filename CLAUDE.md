# Curiosity Hour — engineering constraints

This file exists so a session months from now does not rediscover these the
hard way. They are the hard constraints from the build spec, verbatim, and
they are non-negotiable.

| # | Constraint | Test |
|---|---|---|
| 1 | Runs offline from `file://` by double-clicking `index.html` | Disable networking, open from a USB stick, complete a playthrough |
| 2 | Same source also deploys to GitHub Pages | Push, load the Pages URL, complete a playthrough |
| 3 | No `fetch()` or `XMLHttpRequest` for local content | Grep. Network tab is empty on `file://` |
| 4 | No `<script type="module">` — blocked on `file://` in Chrome | Grep |
| 5 | No `crypto.subtle` — unreliable on `file://` | Grep. Answer hashing uses FNV-1a |
| 6 | No date, clock, or elapsed-time gating anywhere | Grep for `Date`, `setTimeout` used as a gate |
| 7 | No runtime external deps — no CDN, fonts, analytics, telemetry | Network tab empty on Pages too |
| 8 | Content fully separate from engine, editable by a non-programmer | A typo in `story.js` is reported in plain English, never a white screen |
| 9 | Playable end to end with `assets/` deleted | Delete the folder, complete a playthrough |
| 10 | Every gate openable without outside help | Complete a playthrough using only in-game hints |
| 11 | Desktop, mouse and keyboard. Current Chrome, Firefox, Edge, Safari | Manual pass |
| 12 | 640×360 logical resolution, integer-scaled, nearest-neighbour | Pixels stay square at every window size |

## Additional standing rules

- Saves are keyed by scene/object/puzzle **IDs, never array indices** — content
  edits after launch must not invalidate saves.
- Content lives only in `src/content/*.js` (plain scripts assigning globals).
  Engine code never contains story text, answers, or asset paths.
- Plaintext answers live only in `src/content/answers.local.js`, which is
  git-ignored and never committed (the repo is public). `puzzles.js` holds
  hashes only. `build.js` reads answers.local.js to generate the Ledger and
  to verify every acceptedHashes entry. No plaintext answer may appear in
  `dist/` or in any committed file — except inside hint 3, which states the
  answer by design.
- `docs/KEEPERS-LEDGER.md` **never enters the repo** (public repo; it holds
  every answer). It is generated locally by the build.
- The repo name and all public-facing strings stay inert: nothing containing
  "keeper", "hunt", or any family member's name.
- Missing assets: log, placeholder, continue. Never block progress.
- Exactly three hints per puzzle; hint 3 states the answer and is always
  reachable. There is nobody to ask — the game is the only support channel.
