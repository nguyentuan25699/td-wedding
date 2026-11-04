# PROGRESS — Thiệp cưới online Tuấn & Dung

> Agent: read this file FIRST in every session. Update it LAST before finishing any task (see "How to update" at the bottom).

## Snapshot
- **Last updated:** 2026-11-02
- **Phase:** 1 — Screens 1–4 written and checked locally in headless Chrome (sample data for screen 3). Not yet on a real phone, not yet deployed.
- **Next action:** Fill real content (see Missing content), deploy `apps-script/Code.gs`, then send one test RSVP and confirm the row lands in the Sheet.
- **Deadline:** start sending invitations in early December 2026 → site must be live and tested by ~30/11/2026

## Key decisions (do not reopen without asking the user)
| Topic            | Decision                                                                 |
|------------------|--------------------------------------------------------------------------|
| Stack            | Plain HTML/CSS/JS, no build step, no framework, no npm deps              |
| Hosting          | Vercel (static). NOT self-hosted on the home Mac                         |
| Domain           | Buy at Cloudflare Registrar or Porkbun (.com). Status: see Blocked/Waiting |
| Base code        | quanbui210/wedding-invitation as reference. Permission granted 2026-11-02 in issue #1, recorded in README.md (credit on the card and footer) |
| Visual design    | Own design. Source of truth: `docs/design-brief.md`                      |
| Palette          | Repo palette (user choice 2026-11-02): page `#EDE5D8`, paper `#FCFAF6`, shade `#F2EBDF`, burgundy `#6B1D2A`, gold `#B39869` (decor only), ink `#2F2522`, ink-soft `#66574F`. Replaces "Hồng tro sáng" |
| Fonts            | Great Vibes (script), Cormorant Garamond (display), Be Vietnam Pro (body), Noto Serif TC (囍 only, weights 400 and 700). Changed 2026-11-02 by user from Allura / Fraunces / Mulish |
| Florals          | Plum-blossom branch from the template (`maiShapes` in flora.js). Cover corners differ by twig count and crop (`MAI_TOP`) |
| Opening          | Envelope: flap opens, card rises, then the letter zooms to full screen and fades (~2.4s). Not curtains |
| Falling leaves   | Cover and invitation both have a falling layer; every third piece is a burgundy blossom, the rest gold leaves |
| Sections         | Envelope → Invitation + two families → Date card + countdown + programme + album → RSVP + thank you → credit |
| Gift / bank QR   | Removed. Do not add                                                      |
| Music            | Royalty-free instrumental, starts on "Mở thiệp" tap, toggle button       |
| RSVP             | Form posts JSON (text/plain) to an Apps Script web app that appends a row to a Google Sheet. Fields: tên, SĐT, có/không, số người, khách của, lời nhắn. Honeypot field `website` |
| Personal links   | `?to=<name>` shows guest name on the envelope                            |
| Names order      | "Tuấn & Dung" (matches the logo), Nhà trai column first (changed 2026-11-02) (may add `?side=trai` variant later — open question) |
| Seal             | Monogram cropped from the couple's logo (`assets/img/monogram.png`), no text |

## Done
- [x] Hosting approach chosen (Vercel, not home Mac); template research; quanbui210 chosen as reference
- [x] Template permission recorded (issue #1) and credit added to the card and README
- [x] `CLAUDE.md` rules, `docs/design-brief.md` (palette, fonts, screens, motion spec)
- [x] Screen 1 (envelope, opening, music start) and Screen 2 (invitation, families) written; reduced motion checked by hand
- [x] Screen 3 written: `assets/js/calendar.js` (grid maths), `assets/js/schedule.js` (date card, countdown, programme), `assets/js/album.js` (strip + full-screen viewer with swipe, Escape, arrows). Checked at 390 and 1280 with sample data; lightbox opens and Escape closes
- [x] Screen 4 written: `assets/js/rsvp.js` (clean and check, send, honeypot, thank-you), `apps-script/Code.gs` (append row, formula guard). Form checked at 390 with the send path stopping at "not open yet" (empty URL)
- [x] Falling leaves and blossoms inside the invitation as well as on the cover
- [x] Tests: `node --test tests/*.test.js`, 62 passing (added calendar, rsvp, album tests; html test now scans every page script)

## Next up (in order)
1. [x] Git repo initialised locally (`git init`, no commit yet); `.gitignore` added
2. [x] Skeleton, tokens, fonts
3. [x] Screen 1: envelope + opening + music start (music file still missing)
4. [x] Screen 2: invitation + two families
5. [x] Screen 3: date card, countdown, programme, album + lightbox (sample data only)
6. [x] Screen 4: RSVP form, thank-you, Apps Script file (not deployed)
7. [ ] Deploy `apps-script/Code.gs` (Google account needed), put the /exec URL in `config.js` rsvp.url, submit one test RSVP, confirm the row in the Sheet
8. [ ] Scroll reveals, reduced-motion pass (screens 3–4 not yet checked with reduced motion), performance pass (LCP, 60fps on low-end Android)
9. [ ] OG image + meta, test link preview in Zalo/Messenger
10. [ ] Deploy to Vercel, connect domain, test on parents' phones
11. [ ] Fill real content, final check of dates (solar + lunar), send to a few relatives first

## Blocked / waiting
- **Domain**: not purchased yet (name not chosen).
- **Google account for Apps Script and the Sheet**: needed to deploy the RSVP endpoint (step 7).
- **Real-phone check** of screens 1–4 and in Zalo/Messenger in-app browsers: not done.

## Missing content (from user)
- [ ] Wedding date (solar, `date.iso` as YYYY-MM-DD and `date.solar` text) + lunar date. The logo file says 17.01.2027 and the names "MINH TUAN & VO DUNG"; config still says "Tuấn & Dung" and TODO. The couple must confirm.
- [ ] Which ceremonies happen (Lễ vu quy / Lễ thành hôn / Tiệc cưới), and for each: time, venue, address, Google Maps link (`config.events`)
- [ ] Parents' names (both sides), home addresses
- [ ] RSVP deadline
- [ ] Wedding photos: 1 portrait for the arch (3:4, `photos.hero`), 6–12 for the album (`photos.album` with real w/h)
- [ ] Background music file
- [ ] Apps Script /exec URL (`rsvp.url`)
- [ ] Domain name

## Open questions
- Two invitation variants (Nhà gái / Nhà trai name order) via `?side=`?
- Font comparison and the calendar month are now set from `date.iso`; confirm the real date.

## Session log (newest first, keep max 10 entries)
- 2026-11-04 (round 52) — Petals looked like they all fell to one side: sway amplitude was always positive, and the first few petals happened to drift left. Now drift and sway alternate left and right by petal index (drift 30–140 px, sway 24–58 px each side). flora.test.js sway check accepts either side.
- 2026-11-04 (round 51) — Petals no longer clump: the start delay is now negative and spans the whole fall (each petal starts part-way down), instead of 0–7 s. Checked by screenshot. flora.test.js delay assertion updated.
- 2026-11-04 (round 50) — Petals matched to the reference template (example/assets/js/main.js: about 15–42 px/s, sway about 8–9 s): fall 28–36 s, sideways sway period 4–6 s (was 1.8–3.2 s). flora.test.js ranges updated. Open: compare on a real phone with the demo https://wedding-invitation-eta-topaz.vercel.app/.
- 2026-11-04 (round 49) — Petal fall slowed to 20–26 s (was 14–18 s), per the owner's reference demo. flora.test.js duration range updated. Open: the demo itself was not seen; compare on a real phone.
- 2026-11-03 (round 48) — Petal fall slowed again: 14–18 s per fall (was 11–13 s). flora.test.js duration range updated to match.
- 2026-11-03 (round 47) — Falling petals: opacity .7 → .5, light blur(.5px), fall 11–13 s (was 9–13 s), sideways drift ×1.4 and sway amplitude 24–58 px (was 14–40). flora.test.js sway range updated to match. Open: check on a real phone.
- 2026-11-03 (round 46) — Removed assets/img/name-text-edit-poster.png (unused). og-preview.jpg is a separate composed file and stays; the logo lives only in the preview image.
- 2026-11-02 (round 45) — Owner deleted the test RSVP rows (Test RSVP 6–8) from the Sheet. Open: decide where the owner's logo appears; Messenger does not show link cards for the site (domain-level, not fixable in code).
- 2026-11-02 (round 44) — rsvp.deadline set to 10/01/2027 (7 days before 17/01/2027) in VI and EN. Open: remove the 'Test RSVP 6–8' rows from the Sheet; decide where the owner's logo appears.
- 2026-11-02 (round 43) — Zalo still showed the old preview (cached). og:image now has ?v=2 to force a fresh fetch. Open: re-send the link in Zalo and Messenger after deploy.
- 2026-11-02 (round 42) — Added assets/img/name-text-edit-poster.png (the owner's logo with names and date, cropped, 852×900, transparent). Not used in the page yet; the og-preview uses it. Open: decide where it appears.
- 2026-11-02 (round 41) — og-preview.jpg now uses the owner's logo (Name Text Edit Poster.png, cropped to its content and placed on burgundy at 1200×630). Open: re-scrape the share link to refresh the cached preview.
- 2026-11-02 (round 40) — og-preview.jpg redrawn: larger monogram, names, the solar date from config (Chủ nhật · 17.01.2027) and the invitation line. Open: re-scrape the link in the share debugger to refresh the cached preview.
- 2026-11-02 (round 39) — Live at https://td-wedding.vercel.app. og:url and og:image set to absolute https URLs; assets/img/og-preview.jpg (1200×630) generated from the monogram and title. Open: check the preview after deploy; RSVP deadline still TODO; use a custom domain later if wanted.
- 2026-11-02 (round 38) — First commit (53a9bc6) pushed to https://github.com/nguyentuan25699/td-wedding (branch main). `example/` is git-ignored and not pushed. Open: import the repo in Vercel (framework Other, no build), then set og:url and og:image to the Vercel URL.
- 2026-11-02 (round 37) — RSVP end-to-end works: the redeployed Code.gs writes STT, time, name, phone as text (leading 0 kept), attendance, count, side and message. Test RSVP 8 confirmed in the Sheet. Open: delete test rows 'Test RSVP 6–8'; fill `rsvp.deadline` (still TODO); the 'Cảm ơn' line is split in config now.
- 2026-11-02 (round 36) — Thanks block: removed the 'Tuấn & Dung' line (user's call). Open: the 'Cảm ơn' line still wraps 'vui.' alone on PC.
- 2026-11-02 (round 35) — Thanks block: the cover seal rules (absolute, 55% top) also hit the small seal in the thanks block and overlapped the names; scoped them to `.cover .seal`. Checked by screenshot at 390px. Open: the phone's leading 0 still lost in the Sheet although the request body and the manual test are correct; the deployed Apps Script is probably not the latest code. The 'Cảm ơn' line wraps 'vui.' alone; minor.
- 2026-11-02 (round 34) — Request body checked in the browser: phone arrives as '0900000000'. A manual setValue on a text-formatted cell kept the 0, so appendRow was the step turning it into a number. Code.gs now appends the row with an empty phone, then writes the phone with setNumberFormat('@').setValue(). Open: redeploy as a new version, then send one test RSVP and check row 7 onward.
- 2026-11-02 (round 33) — Live test showed the leading 0 still lost (rows 'Test RSVP 1–3' stored the phone as a number). Apps Script now sets column D to plain text ('@') before appendRow and drops the apostrophe. Open: redeploy as a new version, then check the new row; fix the old test rows by hand (column D as Plain text).
- 2026-11-02 (round 32) — Redeployed Apps Script; two more test RSVPs ('Test RSVP 2' and 'Test RSVP 3') went through the live page and got the thank-you screen (ok:true). Open: the owner checks the rows (STT, phone keeps the leading 0) and deletes all test rows.
- 2026-11-02 (round 31) — Apps Script: phone cell now stored as text with a leading apostrophe, so the leading 0 is kept. Open: redeploy as a new version; the test row already in the Sheet still shows 900000000 and needs fixing by hand.
- 2026-11-02 (round 30) — RSVP endpoint set in config.js (`rsvp.url`, stale TODO comment removed). One test RSVP sent through the page: the page showed the thank-you screen, so the endpoint answered ok:true. Open: confirm the test row (name 'Test RSVP', phone 0900000000) in the Sheet and delete it; `rsvp.deadline` is still TODO.
- 2026-11-02 (round 29) — Apps Script: new first column STT (header row + `sheet.getLastRow()` as the value, so the first guest is 1). Sheet header must be updated by hand, and the script redeployed as a new version. Open: test RSVP not yet sent.
- 2026-11-02 (round 28) — Message limit raised 300 → 1000 in index.html (maxlength), rsvp.js (MAX_MESSAGE) and apps-script/Code.gs (MESSAGE_MAX); rsvp.test.js updated to match. Open: Code.gs must be deployed as a new version for the change to reach the live endpoint, and a test RSVP must reach the Sheet.
- 2026-11-02 (round 27) — RSVP form tested in a real browser at 390px (23 cases: 6 normal, 17 abnormal, scripted with puppeteer, not saved to the repo). All validation messages, the honeypot, double-submit lock, server rejection (ok:false, HTTP 500, network abort) and the not-open message behaved as designed. Open: the real Apps Script endpoint is not deployed, so no test row has reached the Sheet yet. `attend: no` still sends a count; the server should ignore it.
- 2026-11-02 (round 26) — Phone petal count cut: cover 6 → 3, invitation 9 → 5 (`mountFalls` in main.js). Fall durations unchanged. Open: check on a real phone.
- 2026-11-02 (round 25) — Removed the cover wreath (markup, `.cover__group` wrapper, `--wreath` token, `wreath`/`leaf` in sketches.js, mount in main.js, README mention). The cover watermark is now our own Hỷ glyph (SVG in index.html, burgundy at .06), sized min(88dvh, 90vw) like the old 囍. Open: the watermark sits behind the envelope; the heart cut-outs are hidden under the button on phone.
- 2026-11-02 (round 24) — Cover wreath now encloses the envelope: phone envelope min(64vw, 240px); ring `--wreath` min(100vw + 96px, 500px) on phone, 750px from 768px; ring centred on the envelope (`top: calc(50% - 68px)`); open ends at 223°/-43° so they sit beside the names. Flora art on the cover may still overlap the ring edge; not yet checked on a real phone.
- 2026-11-02 (round 23) — Wreath token `--wreath` (min(100vw - 8px, 500px); 640px from 768px). Title block returned to its old position (no reserved height on `.cover__group`). Open: the user wants the two open ends of the wreath to sit beside the names line. With the envelope inside the ring this needs a bigger ring or a different layout, not yet done.
- 2026-11-02 (round 22) — Cover: the laurel wreath from the reference (`wreath` in sketches.js, credited in README) encircles the envelope, guest line and the open button, with the bow at the bottom; 460px on phones, 640px from 768px up. The 囍 watermark is removed (kept: the small 囍 above the kicker). The wreath is in `.cover__group`, so the opening animation still targets the children.
- 2026-11-02 (round 21) — Tried a line-drawn mandarin-duck watermark on the cover; it did not read as ducks, so it was reverted to the 囍 watermark. Open: pick a replacement motif (lotus, trống đồng sun, or a better duck drawing from a reference). Only the cover watermark is in scope.
- 2026-11-02 (round 20) — Favicon is now the white TD logo on a burgundy rounded square (`assets/img/favicon.png`), so it reads on light and dark tabs.
- 2026-11-02 (round 19) — Background music added: `assets/music/background.mp3` (copied from the owner's bg-music-wedding.MP3: 1.5MB, 128 kbps, 93 s). Checked over http://localhost:8080: after tapping Mở thiệp it plays (volume fades to 0.6), the toggle shows, no 404. Note: 93 s is shorter than the 2–3 min in CLAUDE.md.
- 2026-11-02 (round 18) — Removed the bottom hairline under the cover button (`.cover__base` markup and CSS). Cover kicker VI shortened to "Thiệp mời" (EN unchanged: "Wedding invitation").
- 2026-11-02 (round 17) — Favicon is the burgundy TD logo: `assets/img/favicon.png` (256×256, logo centred on transparent). Replaces the empty data icon.
- 2026-11-02 (round 16) — Quote breaks before "và" (VI) and "and" (EN) using a \n in `heroQuote`; `.hero__quote` uses `white-space: pre-line`.
- 2026-11-02 (round 15) — Hero shows the couple names again, stacked (first name, gold &, second name) from `couple.first` / `couple.second`: "Tuấn & Dung" (recommended, matches the T & D logo). Quote is an original line, 2 lines with balanced wrap (`heroQuote`, VI and EN). Checked at 390 and 1280: no horizontal scroll.
- 2026-11-02 (round 14) — Parents' names filled in from the owner's message (bride: Võ Viết Bảy / Lê Thị Thoa; groom: Nguyễn Hoàng Hoa / Bùi Thị Thuý), shown with Ông/Bà prefixes (added 2026-11-02). Addresses still TODO. config.test now checks the names are filled in, not TODO.
- 2026-11-02 (round 13) — Family order flipped: Nhà trai on the left, Nhà gái on the right (houses, parents and the couple names below the thread). Config comment updated. Table row "Nhà gái column first" is now out of date.
- 2026-11-02 (round 12) — Couple names are now "Tuấn & Dung" (same order as the logo) everywhere: config, page title and meta, README, design brief, this file. Monogram letters are T & D to match the logo.
- 2026-11-02 (round 11) — Falling petals are thinner on phones (below 768px): invitation 9 (18 on wider screens), cover 6 (10 on wider screens).
- 2026-11-02 (round 10) — Tear-off page: the `tear` keyframe swung the free corner up over the binding (rotate -5deg); it now swings down (rotate 2deg, translateY 8px), so the page never shows above the bar before it falls. Checked frames at 0, 16%, 50%.
- 2026-11-02 (round 9) — Invitation petals and the two top blossom branches are fixed to the screen (`.fall--invite`, `.flora--fixed`, both moved to body level / pinned), so they stay in view while scrolling. Checked at scrollY 1500 on 390px. Petals sit above content with pointer-events none.
- 2026-11-02 (round 8) — Hero follows the reference layout: kicker, invitation line, date row, lunar, divider, quote. Couple names removed from the hero (they stay in the family section, the cover and the closing). New text key `heroQuote` (VI and EN) is a placeholder line flagged TODO: confirm the quote. Checked at 390 and 1280: no horizontal scroll.
- 2026-11-02 (round 7) — The invitation has its own falling petals (`.fall--invite`, 18 petals; the cover keeps 10) and two plum-blossom branches at its top corners (`.flora--enter`, drawn in on reveal). Checked at 390 and 1280: no horizontal scroll.
- 2026-11-02 (round 6) — Footer credit is back as a small plum-blossom icon (inline SVG in index.html, `.credit__icon`), linked to the template repo. The name is read from `aria-label` (`data-i18n-label="credit"`), not shown as text.
- 2026-11-02 (round 5) — Family section now follows the reference: parents under each house, then the thread, then the couple names below it with CÔ DÂU / CHÚ RỂ labels (`.family__couple`). Nhà gái stays on the left (CLAUDE.md), so the bride is bottom-left; the reference puts the groom left. Removed unused `.family__person` CSS.
- 2026-11-02 (round 4) — Family section shows the full names under each kicker (`.family__name`, `data-bride-name`/`data-groom-name`). Groom name written as "Nguyễn Đình Minh Tuấn" (owner's earlier message; a later message wrote "Nguyễn Đình Minh", to confirm). Calendar: the board's `margin: 0 auto` shorthand overrode the top spacing, so it is now `margin-inline`; the nail string is a 1px vertical line, clear of the kicker. The last page's stamp is the burgundy TD logo. Logo is a background image, not a CSS mask (masks fail on file://).
- 2026-11-02 (later) — Logo TD (`assets/img/monogram-td.png`, cropped from the owner's file, background removed) replaces the D & T text in the seal, the closing mark and the placeholders. Shown as a background image (`.logo`, `--logo-src` set per element by main.js and album.js): the light PNG on the burgundy seal, `assets/img/monogram-td-burgundy.png` on ivory. A CSS mask was dropped because Chrome blocks mask images from file:// and some in-app browsers. Full names added (`couple.bride`, `couple.groom`) under the hero names. Lunar date looked up: 17/01/2027 = 10/12 âm lịch năm Bính Ngọ (sources baolamdong.vn, xemlicham.com). Typed by hand; NEEDS MANUAL CHECK. Test changed: config.test now checks that flag instead of TODO (owner asked for the lookup). Calendar fix: `renderBloc` now adds `.bloc` to the board (it was full width). Nail string moved clear of the kicker. Album: 10 tiles (two more portrait placeholders). Letter: the zoom now uses transform only from the card's resting box (no position: fixed, which broke inside .envelope). Checked frames at 0/900/1400/1700 ms. Letter zoom sits above the petal layer (`.cover.is-leaving .envelope` z-index 2). Favicon: empty data icon to stop the 404. Still open: music file missing (404 on tap, expected TODO); `assets/img/monogram.png` unused. Tests 64/64.
- 2026-11-02 — Sections after the cover now follow `example/` (hero, family houses, ceremony card, programme sketches, tear-off calendar, album with viewer, RSVP, closing). Names, dates, venue and copy are ours; TODO where unknown. Gift, story and template credit blocks removed (CLAUDE.md: no gift section). Cover (envelope) kept. Horizontal scroll fixed: the corner florals now clip inside `.invite` (checked at 360, 390, 768, 1280: scrollWidth = clientWidth). Files: `events.js` and `album.js` rewritten without innerHTML (text and createElement only); `schedule.js` removed; `sketches.js` gained lanterns, thread, drawn strokes (draw-on on reveal). Deviations from the reference, kept on purpose: body 16px and weight 400 (reference 15px, 300), labels at least 12px. Music file in place (see round 19); album and hero photos empty (placeholders show); `assets/img/monogram.png` no longer used; the lunar date and programme times are TODO. Tests 64/64.
- 2026-11-02 — Fonts and sizes now match the reference: Be Vietnam Pro 300/400/500, Cormorant 300/400/500 (+italic 400), Noto Serif TC 300. Body 16px (reference 15px, CLAUDE.md minimum), section titles 34px/40px, kickers 13px uppercase, names clamp(46px, 13vw, 62px). Weights 600/700 mapped to 500/400. Family houses (houseBride/houseGroom) and programme sketches (tea, cake, houseBride) now come from assets/js/sketches.js, ported from the reference with the README credit. Sketches are static, no draw-on yet. Test html.test.js updated for the new script order. Tests 64/64. Desktop hero two-column and agenda row layout were not re-checked in this pass.
- 2026-11-02 — Date 17.01.2027 (Chủ nhật), ceremony 10:00 at Trống đồng palace – Phòng Seraphine 2 tầng 3 (config.event). Ticket card with 'Chỉ đường' and 'Lưu vào lịch' (.ics via buildIcs). Names kept as Tuấn & Dung: a wrong change to the demo's sample names (Bảo Phi & Thúy Linh) was reverted. Lunar date still TODO. NOT done from the latest design list (section 2 house art and section 4 icons are now done, see the entry above): section 1 two-column hero, section 5 flipping calendar, section 6 ten-photo grid, section 7 underline form, section 8 monogram. Tests 64/64.
- 2026-11-02 — Wedding-day marker is now a true 34px circle (was stretched into an ellipse in the grid cell). Tests 63/63.
- 2026-11-02 — Reverted the paper band: schedule and RSVP sections are transparent so they sit on the page background like the rest of the invitation. Cards stay --paper. Tests 63/63.
- 2026-11-02 — Demo reference (wedding-invitation-eta-topaz.vercel.app): the schedule and RSVP sections now sit on a full paper band, with cards in --shade. Demo's 'Mừng cưới' gift section is NOT added (CLAUDE.md). Not copied from the demo: 'Khoảnh khắc', 'Chuyện chúng mình', dietary notes, edit-after-submit. Tests 63/63.
- 2026-11-02 — Falling blossoms now outline-only five-petal flowers (template-style petals, `fallingBloomShapes` in flora.js, scaled 1.6× leaves). Programme icons redrawn in the repo's line style: gate = house with upturned eaves (Lễ vu quy), bouquet = hanging lantern (Tiệc cưới), rings unchanged. Icon and petal shapes adapted from the reference repo (permission in README). Tests 63/63.
- 2026-11-02 — Screens 3 and 4 written (see Done). Falling leaves and blossoms added inside the invitation too (`.fall--invite`, every third piece a blossom). Tests 62/62. Open: no real date, venues or photos; RSVP not sent to a deployed Apps Script; screens 3–4 not checked with reduced motion or on a real phone.
- 2026-11-02 — Cover top corner florals: `MAI_TOP` gives each corner its own twigs, blossoms and crop; both pushed into the corners to hide long stems. Tests 51/51.
- 2026-11-02 — Desktop (≥768px): envelope 440px, seal 92px, guest line 20px, open button 18px. Mobile watermark min(88dvh, 90vw); mobile bottom branches moved outward. Blossoms on the cover are burgundy.
- 2026-11-02 — Watermark 囍 heavy weight (Noto Serif TC 700). Seal shows the cropped monogram from the logo; text D&T removed. Open: logo names and date vs config (see Missing content).
- 2026-11-02 — Falling petals loop (infinite fall and sway); css.test allows four infinite loops (breathe, pulse, petal-fall, petal-sway). Letter zooms to full screen and fades on open.
- 2026-11-02 — Earlier cover work (branches, envelope, florals, palette, fonts, stitch fixes, flap, reload scroll fix, branch generator and tests): merged. Key outcomes are in Key decisions and Done.
