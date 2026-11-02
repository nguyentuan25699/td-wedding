# CLAUDE.md — Wedding Invitation (plain HTML/CSS/JS)

## Project context
- Single-page online wedding invitation with its OWN visual design (colors, typography, layout, opening animation) defined in `docs/design-brief.md`.
- Reference repo quanbui210/wedding-invitation: a local clone sits in `example/` (git-ignored, not part of the site). Use it as the reference for both HTML and JS. The author granted permission in issue #1 (2026-11-02): the code, template and illustrations may be used and modified freely, with no credit required. The project still keeps the credit (footer icon and README). Record any new source taken from `example/` in README "Credit và quyền sử dụng".
- Guests open the link from Zalo/Messenger. ~95% mobile, many in in-app browsers, some on old low-end Android phones. Ages 20–70.
- User-facing copy is Vietnamese (an English version exists via `?lang=en`). Code and comments are English.
- Page jobs, in order: (1) when and where, (2) the couple's style, (3) RSVP, (4) photos. There is NO gift / bank QR section.

## Session start / end — MANDATORY
- **Start of every session**: read `PROGRESS.md` first, then this file, then `docs/design-brief.md`. Do not re-research decisions already listed in `PROGRESS.md` > Key decisions.
- **End of every task**: update `PROGRESS.md` following its "How to update" rules before reporting back. A task is not done until `PROGRESS.md` reflects it.
- If `PROGRESS.md` and the code disagree, trust the code, fix `PROGRESS.md`, and tell the user.

## Stack — NON-NEGOTIABLE
- Plain HTML, CSS, vanilla JavaScript. No build step. No framework, no bundler, no npm packages, no TypeScript, no Tailwind, no jQuery.
- Never propose migrating to React/Next/Vite or adding a dependency. If something truly needs a library, stop and ask first.
- Must keep working when served by `python3 -m http.server 8080` and deployed as static files on Vercel.

## File responsibilities (keep them separate)
```
index.html              page skeleton + <head> meta/OG tags only, no copy
config.js               ALL content: names, dates, venues, photos, music, RSVP URL, VI/EN text
assets/css/style.css    all styling; design tokens live in :root at the top
assets/js/main.js       page logic: language, text, hero, family, envelope opening, reveals, music
assets/js/events.js     ceremony card, programme rows, date section (tear-off calendar or month page)
assets/js/album.js      gallery grid + full-screen viewer, self-contained
assets/js/rsvp.js       RSVP form: cleaning and checks (pure, unit tested), send to Apps Script
assets/js/calendar.js   date helpers (month weeks, days between), pure, unit tested
assets/js/flora.js      cover florals and falling petals (generated line art)
assets/js/guest.js      ?to= guest name sanitising (pure functions, unit tested)
assets/js/sketches.js   hand-drawn line illustrations (houses, lanterns, tea, cake, thread), ported from the reference per README
tests/                  node:test suite, see "Tests" below
docs/design-brief.md    palette, fonts, layout, opening animation spec
apps-script/Code.gs     RSVP -> Google Sheet
```
- New content goes into `config.js`, never hard-coded in HTML or JS.
- The sections after the cover (hero to closing) follow the reference layout (`example/`), with our names and content. The cover (envelope opening) is ours and stays ours.
- If `main.js` grows past ~600 lines, split by feature into `assets/js/<feature>.js` (plain `<script defer>` tags, no modules unless already used). Each file owns one feature.

## Visual design — new identity
- `docs/design-brief.md` is the source of truth for palette, text colors, fonts, layout and the opening animation. Read it before any visual change. If it is missing or vague on something, ask instead of guessing.
- All colors, fonts, spacing, radii and durations are tokens in `:root`. No raw hex/px values in component rules.
- The layout may take ideas from the quanbui210 template, but the design stays ours (palette, fonts, motion from docs/design-brief.md). When planning a section, state how its layout differs from the template.
- Opening = an envelope whose flap opens and a card slides out (full timeline in the brief), not curtains:
  - Built with CSS transforms (`rotateY`/`rotateX` with `perspective`) and `opacity` only; total duration ≤ 2.5s.
  - Triggered by a tap on a clear "Mở thiệp" button; that same tap starts the music.
  - Must stay smooth on a mid-range Android; use `backface-visibility: hidden` and `will-change` only during the animation.
  - Reduced-motion fallback: a simple fade.
  - The guest name from `?to=` appears on the closed card.
- Follow the Motion spec in `docs/design-brief.md` exactly (timings, easings, triggers, reduced-motion fallbacks). Do not add animations that are not in the spec.

## Hard guardrails
- Performance on throttled 4G mobile: LCP < 2.5s, CLS < 0.05. Images follow the README's prep table (hero < 300KB, album 150–300KB each, lazy-loaded, explicit width/height).
- Fonts must render Vietnamese diacritics correctly (ă â đ ê ô ơ ư + tone marks) in every weight used.
- Body text ≥ 16px, contrast ≥ WCAG AA, tap targets ≥ 44×44px. Older guests must read without zooming.
- Use `dvh`/`svh` instead of `100vh`; respect safe-area insets.
- No console errors. Page must still work if JS for one feature fails (wrap features in try/catch, fail gracefully).

## Background music
- File at `assets/music/background.mp3`, ≤ 3MB (128 kbps, 2–3 minutes, looped).
- Never autoplay before user interaction. Music starts on the "Mở thiệp" tap only.
- Always show a visible, easy-to-hit music toggle (≥ 44px) that keeps its on/off state while scrolling.
- Pause music when the tab is hidden (`visibilitychange`), resume only if the guest had it on.
- If the file is missing or fails to load, hide the toggle silently.
- Use preload="none" or "metadata" so the MP3 never blocks first paint.

## Vietnamese wedding specifics
- Lunar dates are typed by hand in `config.js`: never calculate or change them. Flag any lunar date you see as "needs manual check".
- Separate info for Nhà trai / Nhà gái must stay clearly distinguishable.
- RSVP must include a phone number or relationship field so guests with the same name can be told apart.
- Support a personalized guest link `?to=<name>`: show the name on the cover, sanitize it (text only, max ~40 chars, never inject as HTML).

## Required workflow for EVERY UI request
1. Restate the request in 1–2 lines and list the files affected.
2. Plan: describe the layout at 390px width (ASCII sketch if layout changes), which existing tokens it uses, and any motion. Point out conflicts with the guardrails and propose an alternative.
3. Implement the smallest change that does it. Reuse existing classes and patterns before writing new ones.
4. Verify: take screenshots at 360, 390, 768, 1280 widths (and with reduced motion if animation changed). Check overflow, alignment, Vietnamese line breaks, clipped diacritics, contrast.
5. Self-critique: list at least 2 things that could look better; fix those in scope, mention the rest.
6. Update `PROGRESS.md`.
7. Report briefly: what changed, files touched, open issues.

## CSS and JS style
- CSS: class-based selectors, low specificity, no IDs for styling, no `!important`. Group rules by section with a comment header. Mobile-first media queries.
- JS: `const`/`let`, small named functions, no globals except the config object. Event listeners attached once. Query DOM elements once per feature.
- No dead or commented-out code.

## Before calling a task done
- Open in a phone-sized viewport and in an in-app-browser-sized viewport; no horizontal scroll.
- OG title, description and 1200×630 `og-preview.jpg` are correct with absolute https URLs.
- Submit one test RSVP and confirm the row lands in the Sheet.

## Tests — MANDATORY for code changes
- Run `node --test tests/*.test.js` from the project root. All tests must pass before a task is reported done.
- Node built-ins only (`node:test`, `node:assert`, `node:vm`, `fs`). No npm packages, no `package.json`, no test framework, no browser test runner in the repo.
- Tests live in `tests/`, one file per area:
  - `guest.test.js`: `?to=` sanitising (text only, max 40 characters, fallback).
  - `config.test.js`: every key the page reads exists, VI and EN keys match, unfinished facts stay `TODO`, no gift/bank section, no phone numbers.
  - `html.test.js`: every `getElementById` and `data-*` hook has a matching element, i18n keys exist in both languages, script order and `defer`, no inline handlers, no `innerHTML`, no `alert`/`confirm`/`prompt`, console only in the error handler.
  - `css.test.js`: palette tokens in `:root` only, no raw hex elsewhere, every `var()` defined, no `!important`, no `100vh`, transitions limited to `transform`/`opacity`/`stroke-dashoffset`, keyframes defined, reduced-motion block present.
- A new pure function (no DOM) gets a unit test in the same change. Browser behaviour (layout, tap, animation timing) is checked by hand with screenshots, as the workflow above says, not by these tests.
- Do not weaken or delete a test to get green. If a rule in this file changes, change the test in the same edit and say so in the report.

## Never
- Never invent wedding details (names, dates, addresses, bank info). Use `// TODO` placeholders and flag them.
- Never commit real phone numbers or guest data.
- Never add a gift / bank QR section unless the user explicitly asks.
- Never rewrite large parts of the codebase for a small request.
