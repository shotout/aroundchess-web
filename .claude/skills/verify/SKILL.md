---
name: verify
description: Build/launch/drive recipe for verifying UI changes in this Next.js chess site at real viewports.
---

# Verifying UI changes (Next.js app)

## Launch
- A dev server is usually already running on port 3000 (`next dev`, check `lsof -nP -iTCP:3000 -sTCP:LISTEN`). It hot-reloads file edits — no rebuild needed. If not running: `yarn dev`.
- Auth: `middleware.ts` only checks for a non-empty `token` cookie. Set `token=anything` for `localhost` to pass every protected route — no real login needed.

## Drive
- No Playwright/Puppeteer in the repo. Install `puppeteer-core` in the scratchpad dir and point it at installed Chrome: `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`, `headless: "new"`.
- Playground tour: `http://localhost:3000/playground/play-vs-ai?tour=playground` force-replays the tour regardless of the `ac_playground_tour_done_v1` localStorage flag. Steps advance via the visible "Next" button; step 2 → 3 plays a ~9s scripted board interlude before the "You Won" card appears — wait on body text, not timers.
- Useful viewport presets: 14" MBP ≈ 1512×860, 24" 1080p ≈ 1920×995, 27" ≈ 2560×1329.

## Gotchas
- The cookie-consent banner renders above the tour overlay (higher z-index than the tour's z-[700]) until accepted — ignore it or accept it first.
- The dev server belongs to the user's session — don't kill PID on port 3000.
