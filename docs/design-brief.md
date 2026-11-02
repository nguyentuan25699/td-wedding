# Design brief — Thiệp cưới online Tuấn & Dung

Visual reference: the design canvas "Thiệp cưới Tuấn & Dung" (4 phone screens). When this brief and the canvas disagree, ask.

## Mood
Nhẹ nhàng, lãng mạn, ấm. Like a real paper invitation handed over in person: thick dusty-rose paper, wood-brown ink, hand-drawn line details.
Three words: **mềm (soft), ấm (warm), chạm được (tactile)**.
Not: glossy, neon, luxury-gold, generic cream-and-terracotta.

## Palette (tokens in `:root`) — repo palette, chosen 2026-11-02
Replaces "Hồng tro sáng". The user chose these values from the reference repo's invitation colours. Brief rules on gold and cream are overridden by that choice; the rest of the rules still apply.
| Token            | Hex       | Use                                                    |
|------------------|-----------|--------------------------------------------------------|
| `--page`         | `#EDE5D8` | Page background                                        |
| `--paper`        | `#FCFAF6` | Invitation card, envelope front, form fields           |
| `--shade`        | `#F2EBDF` | Envelope back, photo placeholders                      |
| `--burgundy`     | `#6B1D2A` | Accents: buttons, links, monogram, 囍, family titles   |
| `--gold`         | `#B39869` | Decorative only: florals, hairlines, arch outline, stitch |
| `--ink`          | `#2F2522` | Primary text, names                                    |
| `--ink-soft`     | `#66574F` | Secondary text, captions, labels                       |

Verified contrast (WCAG, computed 2026-11-02):
- `--ink` on `--paper` 14.3:1, on `--page` 11.9:1.
- `--ink-soft` on `--paper` 6.6:1, on `--page` 5.5:1.
- `--burgundy` on `--paper` 11.0:1, on `--page` 9.2:1. Button text `--paper` on `--burgundy` 11.0:1.
- `--gold` is decoration only, never text (2.6:1 on `--paper`).

Rules: `--burgundy` is the only saturated colour, used sparingly. Warm shadows only (`rgba(47, 37, 34, .12)`). No pure white/black, no gradients.

### Decorative line art
- Florals are generated per seed (`assets/js/flora.js`): a branch grows from its root, stem first, then twigs and leaves, then five-petal blossoms that fill in. Each floral has its own seed and lean, so none is a mirror of another. Cover: two florals at the bottom (different sizes), plus two top corner florals on screens 768px and wider. Invitation hero: two top corner florals (larger on 768px and wider). Falling petals: 10 small gold petals fall slowly and keep falling, each pass about 9–13s, starting between 0 and 7s. Each petal sways on its own period and amplitude while it turns over (transform and opacity only). This is the only loop besides breathe and pulse. They are skipped with reduced motion. Blossoms are five-petal rings on every twig tip, larger than before, so the middle of the cover is not empty.
- Divider: stems grow from the centre outwards.
- Arch outline closes at the bottom.
- Stroke timings follow the motion table; petal fill is opacity only.

## Typography
Fonts changed on 2026-11-02 to the set below (user decision, replaces Allura / Fraunces / Mulish).
- **Script — Great Vibes**: couple names, family titles ("Nhà gái", "Nhà trai"), monogram. Never for body text or anything below 28px. Section titles use Cormorant, as in the reference.
- **Display — Cormorant Garamond** (300 / 400 / 500, italic 400): dates, event lines, "Thân gửi" name, calendar month. Thin at small sizes, so use 500 below 20px.
- **Body — Be Vietnam Pro** (300 / 400 / 500). Body text is 400 here, not 300 as in the reference, for readability on phones.
- **囍 — Noto Serif TC** (300), loaded as a one-character subset (`text=囍`). Falls back to a system serif.
- Load `latin` + `vietnamese` subsets only, `font-display: swap`.
- Diacritics test (every font/weight used): **"Tuấn & Dung — Nhà trai, Nhà gái — Trân trọng kính mời — ngày Rằm tháng Mười Một"**. Checked on 2026-11-02 for all four faces: tone marks render, no clipping.
- Sizes (mobile): names clamp(46px, 13vw, 62px), section titles 34px (40px on 768px and wider), family titles 34px, dates 22px, kickers 13px uppercase with .32em tracking, body 16px, captions 13–15px. Body line-height 1.6.
- Deviation from the reference: its body is 15px and its kicker 11px. CLAUDE.md requires body text of at least 16px, so those two stay at 16px and 13px.

## Screens (match the canvas)
Updated 2026-11-02: screens 2 to 4 now follow the reference layout in `example/` (hero, family houses, ceremony card, programme sketches, tear-off calendar, album, RSVP, closing), with our names and content. Screen 1 (envelope) stays as specified below.
1. **Envelope (closed)**: 囍 + "Thiệp mời cưới" + names on top; envelope with flap, dashed stitch line and two-ring monogram seal "D&T"; "Thân gửi" + guest name from `?to=` (fallback "bạn thân mến"); "Mở thiệp" pill + caption "Nhạc sẽ phát khi bạn mở thiệp". Line-drawn sprigs in top-left and bottom-right corners.
2. **Invitation**: "Trân trọng kính mời" → arch photo frame (3:4, top fully rounded, outer hairline arch 10px outside) → names stacked with 囍 between → date → invitation text → sprig divider → two-families card (Nhà gái | Nhà trai, centered columns, vertical hairline).
3. **Date, programme, album**: script title → month calendar card (T2–CN, wedding day in a filled `--burgundy` circle (the brief said `--rose-deep`; the repo palette replaced it)) → lunar date + countdown in one line → programme rows (line icon left: gate = Lễ vu quy, rings = Lễ thành hôn, bouquet = Tiệc cưới; time · name, venue, "Chỉ đường") → album: horizontal scroll-snap strip, first photo arch-topped.
4. **RSVP + thank you**: form card (tên, số điện thoại, tham dự có/không, số người, khách của, lời nhắn, "Gửi xác nhận") → sprig divider → monogram → "Cảm ơn bạn đã đến chung vui cùng chúng mình" → names in script.
- Floating music toggle on all screens after opening: 48px circle, bottom-right.
- No gift / bank QR section. No nav bar, no guestbook.

## Motion spec
Global rules:
- Animate only `transform`, `opacity`, and `stroke-dashoffset` on small inline SVGs. Never animate `box-shadow`, `filter`, `width/height`, `top/left`.
- Implementation: CSS transitions/keyframes toggled by classes, or the Web Animations API (`element.animate`). No animation library.
- Scroll reveals use one shared `IntersectionObserver`, fire once, then unobserve.
- Easing tokens: `--ease-out: cubic-bezier(.2,.7,.2,1)`, `--ease-in-out: cubic-bezier(.65,0,.35,1)`, `--ease-pop: cubic-bezier(.34,1.56,.64,1)`.
- Duration tokens: `--dur-fast: 200ms`, `--dur-base: 500ms`, `--dur-slow: 900ms`.
- Must hold 60fps on a mid-range Android. `will-change` only during an animation, removed after.

### A. Page load (envelope screen)
| Element            | Animation                                              | Time                  |
|--------------------|--------------------------------------------------------|-----------------------|
| Whole screen       | opacity 0 → 1                                          | 400ms, `--ease-out`   |
| Corner sprigs      | draw-on (stroke-dashoffset full → 0)                   | 1200ms, starts 200ms  |
| Names + 囍          | opacity 0 → 1, translateY 12px → 0                     | 500ms, starts 300ms   |
| "Mở thiệp" button  | idle breathe: scale 1 → 1.03 → 1, loops every 2.4s     | starts after 1.5s     |
Scroll is locked on this screen until the card is open.

### B. Opening sequence (the signature moment), triggered by tapping "Mở thiệp" or the seal
| t (ms)      | Element        | Animation                                                                 |
|-------------|----------------|---------------------------------------------------------------------------|
| 0–100       | Button         | press: scale .97, then fades out (opacity → 0, 200ms)                     |
| 0           | Music          | `audio.play()` inside the tap handler; volume fades 0 → 0.6 over 1500ms   |
| 0–250       | Seal           | scale 1 → .6, opacity → 0, `--ease-out`                                   |
| 150–750     | Flap           | `rotateX(0 → 180deg)`, `transform-origin: top`, parent `perspective: 900px`, `--ease-in-out`; at 50% its z-index drops below the card |
| 650–1350    | Card           | slides up out of the envelope: translateY 12% → -95%, `--ease-out` (12% keeps it hidden behind the front panel while closed; -35% left the card almost inside the envelope, so it was changed) |
| 1250–1900   | Envelope body  | translateY 0 → 48px, opacity → 0                                          |
| 1250–1900   | Card           | zooms to cover the screen (`translateY(6dvh) scale(6)`) and fades out (opacity → 0), `--ease-in-out`, both over 650ms, so the page changes to the invitation |
| 1900–2800   | Screen 2 invitation | rises from the lower quarter of the screen to the middle while it fades in (translateY 25dvh → 0, opacity 0 → 1), 900ms, `--ease-out`. Then its parts fade in 80ms apart: "Trân trọng kính mời" → arch photo → names → date → invitation text |
| 2400        | Page           | scroll unlocks, music toggle fades in                                     |
| Ends at 2800 | Screen 2 decor | sprig divider and arch hairline draw on (dash offset), 900ms; each stroke 60ms after the last |
- Ignore extra taps while the sequence runs. Never replay it on scroll back.
- If audio fails to play, continue the animation silently and hide the toggle.
- Reduced motion: the whole sequence becomes one 300ms crossfade from envelope to screen 2.

### C. Scroll reveals (after opening)
| Element                         | Trigger           | Animation                                                         |
|---------------------------------|-------------------|-------------------------------------------------------------------|
| Section titles (script)         | 20% visible       | opacity 0 → 1, translateY 12px → 0, 500ms                         |
| Arch photo                      | 20% visible       | opacity 0 → 1 + inner image scale 1.04 → 1, 700ms                 |
| Sprig dividers & event icons    | 30% visible       | draw-on, 900ms, `--ease-in-out`                                   |
| Two-families card               | 20% visible       | opacity + translateY 16px, 500ms                                  |
| Calendar card                   | 25% visible       | opacity + translateY 16px, 500ms; then the wedding-day circle pops: scale 0 → 1, 400ms, `--ease-pop`, starting 250ms after |
| Programme rows                  | 20% visible       | opacity + translateY 16px, 500ms, 100ms stagger per row           |
| Album, RSVP form                | —                 | no reveal animation (content must be instantly usable)            |

### D. Interactions
- **Countdown**: updates once per minute; no ticking seconds.
- **Album**: native scroll-snap, no autoplay. Tap → full-screen viewer: backdrop fade 200ms, photo scale .96 → 1 250ms; swipe between photos; close with ✕ button, tap on backdrop, or swipe down.
- **RSVP submit**: button shows loading state (label "Đang gửi…", disabled). Success: form fades out 200ms, a thank-you message ("Cảm ơn bạn! Hẹn gặp bạn trong ngày vui.") fades in with a small 囍 scale 0 → 1 (`--ease-pop`). Error: inline message under the button, form data kept.
- **Music toggle**: while playing, a soft ring around the button pulses (scale 1 → 1.25, opacity .5 → 0, 2s loop). Paused: no ring, icon at 60% opacity. Pauses on `visibilitychange` hidden; resumes only if it was playing.
- **Buttons/links**: press feedback scale .97, 100ms. No hover-only effects (mobile first).

### E. Reduced motion (`prefers-reduced-motion: reduce`)
- All reveals become opacity-only, 200ms. Draw-on sprigs/icons render fully drawn. No breathe, no pulse ring, no pop. Opening = 300ms crossfade.

### Not allowed
Floating petals, particles, parallax, confetti, typing effects, auto-advancing carousels, any infinite animation other than the button breathe and music pulse.

## Reference implementation: quanbui210/wedding-invitation
That repo is cloned locally in `example/` (git-ignored). Use its HTML and JS as the reference for these **patterns** (read `example/index.html`, `example/assets/js/main.js`, `example/assets/css/style.css`):
- how the opening is sequenced and how music is started inside the same user tap (browser autoplay rules);
- how the reduced-motion fallback replaces the opening with a simple fade;
- how line sketches "draw themselves" and how scroll reveals are wired;
- RSVP honeypot, formula-injection guard, and the Zalo `?v=2` preview-cache trick.

Rules:
- Permission granted in issue #1 (2026-11-02) and recorded in `README.md`: the code, template and illustrations may be copied, adapted and modified freely. Keep the credit link in the footer anyway.
- Its visual design (curtains, colors, fonts, petals) is NOT our design. This brief wins on every visual decision.

## Music
Soft instrumental (piano or acoustic guitar), royalty-free, ≤ 3MB, 128 kbps, looped, `preload="none"`.
