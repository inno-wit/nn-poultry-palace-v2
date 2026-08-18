# Design Extraction — About / Contact / Order-Flow

Source files (exact pixel-level spec, static prototype, inline styles):
- `C:\Users\fredd\Projects\Websites\nnpoutry\About.dc.html`
- `C:\Users\fredd\Projects\Websites\nnpoutry\Contact.dc.html`
- `C:\Users\fredd\Projects\Websites\nnpoutry\Order-Flow.dc.html`

Global conventions shared by all three pages (from the `<style>` block in each file's `<helmet>`):

- Fonts: Google Fonts import for `Outfit` (weights 300/400/500/600/700/800) and `IBM Plex Mono` (400/500/600). Body font stack is `'Made Tommy', 'Outfit', system-ui, sans-serif` — "Made Tommy" is referenced first (likely a licensed/local display font not loaded via the Google Fonts link; Outfit is the actual working fallback in the prototype).
- Base page background: `#f5f0e8` (cream). Body text color: `#133240` (dark navy).
- `a { text-decoration: none }`, `a:hover { color: #c0613b }` (terracotta) globally.
- `img { display: block }` by default.
- Responsive breakpoint: single breakpoint at `max-width: 900px`. Any element whose inline `style` attribute contains `repeat(12, 1fr)` (and, on Contact/Order-Flow, also `repeat(2, 1fr)` / `repeat(3, 1fr)`) collapses to `grid-template-columns: 1fr !important`, and any element with `grid-column` in its inline style resets to `grid-column: auto !important`. This is a blunt but effective mobile strategy: all 12-col grids stack to a single column below 900px, in DOM order.
- Every page loads `<dc-import name="SiteHeader" .../>` at the top and `<dc-import name="SiteFooter" hint-size="100%,420px">` at the bottom — these are shared header/footer components (not defined in these three files) and should map to a shared `Header`/`Footer` component in the Next.js build.
  - About uses `<dc-import name="SiteHeader" variant="image" active="About" hint-size="100%,0px">` — an "image" variant (transparent/overlay header for the dark hero) with `active="About"` marking the nav's active state.
  - Contact and Order-Flow use `<dc-import name="SiteHeader" variant="solid" hint-size="100%,85px">` — a "solid" (opaque, ~85px tall) header variant, i.e. these pages don't have a full-bleed dark hero image the header should float over.
- Shared micro-interaction classes defined in each page's `<style>`:
  - `.nn-arrow:hover span.nn-a { transform: translateX(7px) }` — arrow glyphs in CTAs nudge right on hover (`.45s cubic-bezier(.22,1,.36,1)`).
  - `.nn-navlink::after` — underline-on-hover for nav links (width 0→100%, `.45s`).
  - `.nn-menu-link:hover { padding-left: 12px }` — menu links indent on hover.
  - `.nn-field` — shared text input/select/textarea style: full width, no border except a `1px solid rgba(19,50,64,.28)` bottom border, transparent background, 19px font, focus state becomes `2px solid #133240` bottom border. Placeholder color `rgba(19,50,64,.35)`.
- Palette values actually observed in these three files (hex, as used): `#133240` (dark navy), `#f5f0e8` (cream), `#eccc74` (gold), `#f59268` (orange), `#c0613b` (terracotta), `#7a9e7e` (sage), `#d4a847` (straw). "Soil" `#8b5e3c` from the brief's palette does NOT appear in any of these three files — not used here.
- Reveal-on-scroll pattern (About only, see below) uses `data-reveal` attributes + an `IntersectionObserver` defined in each page's own `<script type="text/x-dc" data-dc-script>` block (a per-page `Component extends DCLogic` class with `componentDidMount`/`componentWillUnmount`). This is prototype-framework plumbing (`x-dc`, `dc-import`, `DCLogic`) that will not port literally to Next.js — the *behavior* it produces (fade+rise reveal on scroll, timed open/closed status, animated multi-step form) is the real spec to reproduce.

---

## 1. About.dc.html

### Page-level animations (defined in `<style>`, used across sections)
- `@keyframes nn-blink` — opacity 1 → .2 pulse (0-60% full, 85-100% dim). Not actually used on About (used on Contact's status dot); harmless leftover include.
- `@keyframes nn-hero-settle` — `transform: scale(1.07)` → `scale(1)`, `2.4s cubic-bezier(.22,1,.36,1)`, applied `both` (fill mode) — the hero background image slowly zooms out/settles on load.
- `@keyframes nn-hero-in` — `opacity:0, translateY(30px)` → `opacity:1, translateY(0)` — hero text/content fades and rises in, staggered per element via `animation-delay`.
- `.nn-zoom img` — `transition: transform 1.3s cubic-bezier(.22,1,.36,1)`; `.nn-zoom:hover img { transform: scale(1.06) }` — image hover zoom-in-crop effect used on two portrait images (the grower-house image in "The name" section, and the flock image in "people behind it" section).
- `data-reveal` sections: JS arms every `[data-reveal]` element not yet armed, sets `opacity:0; transform: translateY(28px)` with `transition: opacity 1s cubic-bezier(.22,1,.36,1), transform 1s cubic-bezier(.22,1,.36,1)`, then an `IntersectionObserver` (rootMargin `0px 0px -10% 0px`) flips it to `opacity:1; transform:none` once it scrolls into view, then unobserves. Applied to every full-bleed section from "Origin" through "Come and see" (not the hero). Effect: each section fades up into place independently as the user scrolls, once, not repeating.

### Section: Hero
- Full-bleed dark section, `min-height: 88vh`, `background: #133240`, flex `align-items: flex-end` (content pinned to bottom of viewport-height hero), `overflow: hidden`.
- Background image: `public/assets/education/layer-hens.jpeg`, alt `"The N&N layer house in Machakos"`, `object-fit: cover`, absolutely positioned to fill, animates with `nn-hero-settle`.
- Gradient overlay on top of image: `linear-gradient(180deg, rgba(19,50,64,.72) 0%, rgba(19,50,64,.35) 40%, rgba(19,50,64,.88) 100%)` — darkest at top and bottom, lighter in the middle band, ensuring text (top-anchored eyebrow) and bottom edge both stay legible.
- Content grid: `max-width: 1600px`, 12-column grid, `gap: 32px`, `padding: 180px clamp(20px,4vw,56px) clamp(56px,7vw,90px)`, `align-items: end`.
  - Left block, `grid-column: 1 / span 8`:
    - Eyebrow row: 44px×1px gold (`#eccc74`) rule + label `"Our Farm / Machakos"` in IBM Plex Mono, 11px, letter-spacing .24em, uppercase, gold. Fades in with `nn-hero-in .9s ... .2s`.
    - H1 (verbatim): **"Built around doing the ordinary thing exceptionally well."** — `clamp(40px, 6.4vw, 96px)`, weight 800, line-height .9, letter-spacing -.038em, color cream, `max-width: 22ch`, `text-wrap: pretty`. Fades in with `nn-hero-in 1s ... .34s`.
  - Right block, `grid-column: 10 / span 3`: a stat strip, IBM Plex Mono 11px, letter-spacing .14em, uppercase, color `rgba(245,240,232,.6)`, line-height 2.1, each row `justify-content: space-between` with a `1px solid rgba(245,240,232,.2)` divider between rows (last row no divider). Fades in with `nn-hero-in 1s ... .5s`. Exact rows:
    - Founded — 2021
    - Registered — 2022
    - Products — Three
    - Zones served — Six
    (Right-hand values in cream `#f5f0e8`, labels in the dimmer `rgba(245,240,232,.6)`.)

### Section 01 — Origin (`data-reveal`)
- Background cream, padding `clamp(80px,11vw,170px) clamp(20px,4vw,56px) clamp(56px,7vw,100px)`.
- 12-col grid, gap `clamp(28px,4vw,64px)`.
  - Col 1–2: eyebrow label, IBM Plex Mono 11px, letter-spacing .2em, uppercase, `rgba(19,50,64,.45)`: **"01 / Origin"**, line break, then `"2021 — today"` in terracotta `#c0613b`.
  - Col 3–8 (span 6): H2 (verbatim): **"It started as a backyard project during a lockdown."** — `clamp(30px,4vw,60px)`, weight 700, line-height 1.02, letter-spacing -.03em. Followed by three body paragraphs, 19px, line-height 1.75, color `rgba(19,50,64,.72)`, `max-width: 56ch`:
    1. "N&N began in 2021 with broiler chicken — a backyard project, nothing more. When controlled movement closed the eateries, the broiler market went with them. The family moved into layers in 2022, and that is when the company was officially registered."
    2. "Disease challenges came next. The response was online training and seminars run by Kenchic and other poultry input traders, considerable research into poultry farming, and a long run of visits to other farms."
    3. "The first year was hard. Batches were lost, mistakes were made, and the operation became more resilient for it. What never moved was the quality of what left the farm."
  - Col 10–12 (span 3, `align-self: start`): a mini vertical timeline list, top border `1px solid rgba(19,50,64,.2)`, three rows each `padding: 18px 0` with `border-bottom: 1px solid rgba(19,50,64,.14)` (last row no bottom border):
    - **2021** (30px/700/-.03em) — "Broilers, backyard scale" (IBM Plex Mono 11px caption, `rgba(19,50,64,.55)`)
    - **2022** — "Layers · company registered"
    - **Today** — "Eggs, manure & ex-layers across six zones"

### Section 02 — The name (`data-reveal`)
- Full-bleed dark section, `background: #133240`, `color: #f5f0e8`. 12-col grid, `align-items: center`, no vertical section padding (padding lives on the inner column instead), horizontal padding `clamp(20px,4vw,56px)`.
- Col 1–6 (span 6), vertical padding `clamp(64px,8vw,130px) 0`:
  - Eyebrow: **"02 / The name"**, IBM Plex Mono 11px, letter-spacing .22em, uppercase, gold.
  - H2 (verbatim): **"Two initials. Two daughters."** — `clamp(30px,4vw,60px)`/700/1.02/-.03em.
  - Body copy (19px, 1.75 line-height, `rgba(245,240,232,.66)`, max-width 50ch), two paragraphs verbatim:
    1. "The name comes from a family setup — our two daughters bear the initials. It is not a brand exercise. It is the reason the standard does not slip when nobody is watching."
    2. "\u201cFresh and Nutritious\u201d has been the promise since the first tray left the gate, and it is still what the whole operation is measured against." (i.e. the phrase **"Fresh and Nutritious"** is given in quotes verbatim as the brand promise/name explanation.)
- Col 8–12 (span 5, `.nn-zoom` class), `align-self: stretch`, `min-height: clamp(320px,40vw,600px)`: full-bleed cropped image `public/assets/education/grown chicks to hen.jpeg`, alt `"The N&N grower house"`, `object-fit: cover`, absolutely positioned to fill; zooms to 1.06 scale on hover over 1.3s.

### Section 03 — Values (`data-reveal`)
- Cream background, padding `clamp(80px,11vw,170px) clamp(20px,4vw,56px)`.
- Header row: eyebrow col 1–2 **"03 / Values"**; H2 col 3–8 (verbatim): **"Three commitments, in order of weight."** (same H2 type scale as other section headers).
- Below, 12-col grid, gap `clamp(20px,3vw,40px)`, `align-items: stretch`:
  - Col 1–7 (span 7): large gold (`#eccc74`) card, padding `clamp(36px,5vw,72px)`:
    - Label: "Value 01 · Integrity" (IBM Plex Mono 11px, letter-spacing .22em, uppercase, `rgba(19,50,64,.6)`)
    - Statement (verbatim, large): **"We believe in doing what's right — always."** — `clamp(28px,3.6vw,54px)`/700/1.05/-.03em.
    - Supporting copy (verbatim): "In practice this is unglamorous: rejecting a cracked tray ourselves rather than letting a customer find it, and telling a buyer when we cannot meet a quantity instead of stretching to fill it." (18px, 1.7 line-height, `rgba(19,50,64,.72)`, max-width 46ch)
  - Col 9–12 (span 4): flex column, gap `clamp(20px,3vw,40px)`, two equal-height (`flex:1`) bordered cards (`1px solid rgba(19,50,64,.22)`, padding `clamp(28px,3vw,40px)`):
    - "Value 02 · Reliability" → **"We are reliable and deliver on our promises."** (`clamp(21px,2vw,28px)`/600/1.15/-.02em)
    - "Value 03 · Teamwork" → **"We work as one team, sharing ideas, responsibilities and successes."** (same type scale)

### Section 04 — The operation (scroll-synced operations timeline) (`data-reveal`)
- **This is the "scroll-synced operations timeline" called out in the brief.** Important nuance: in the actual HTML/JS as written, the timeline rows are **not dynamically scroll-scrubbed / progress-linked** beyond the page's generic reveal system — there is no separate scroll-linked highlighting, sticky-step, or scrollytelling JS specific to this timeline in the file. The only "scroll-sync" behavior present is the shared `data-reveal` fade-up-on-intersect behavior applied to the whole section as one block (it reveals once, as a unit, when scrolled into view — it does not step through highlighting each row as you scroll further). The section is structured with `data-timeline` on the wrapper and `data-milestone` on each row and `data-year` on each index label — these are semantic/JS hooks (presumably meant for a more elaborate scroll-driven highlight effect in a fuller build) but the actual behavior implemented in this prototype is: the whole timeline block fades up as one unit on entering the viewport, exactly like every other `data-reveal` section. When rebuilding, treat `data-timeline`/`data-milestone`/`data-year` as intentional hooks for scroll-progress styling (e.g., could support highlighting the active row via scroll percentage) but know the shipped prototype's actual JS does not implement per-row scroll-linked highlighting — only the block-level reveal-on-view fade/rise.
- Header: eyebrow col 1–2 **"04 / The operation"**; col 3–8: H2 (verbatim) **"How a day actually runs."** + body (verbatim): "Five stages, every day, in the same order. Nothing here is automated away." (19px, 1.65, `rgba(19,50,64,.68)`, max-width 48ch).
- Timeline wrapper `data-timeline`, top border `1px solid rgba(19,50,64,.2)`. Five `data-milestone` rows, each a 12-col grid, `gap:32px`, `padding: 34px 0`, `border-bottom: 1px solid rgba(19,50,64,.16)` (row layout per item: `data-year` index col 1 span 1, title col 2 span 3, description col 6 span 5, time-of-day label col 12 span 1 right-aligned), `align-items: baseline`. Index numbers in straw `#d4a847`, IBM Plex Mono 11px. Titles `clamp(26px,2.8vw,40px)`/700/-.025em. Descriptions 17px/1.7/`rgba(19,50,64,.7)`. Time labels IBM Plex Mono 10px/.14em/uppercase/`rgba(19,50,64,.45)`, right-aligned.

  Verbatim rows:
  1. **01 — Care — Dawn**: "The first thing each morning — before phones, before breakfast — is a walk through the flock. A hen sitting apart, a dip in drinking, feathers that look off. Small signals, caught early."
  2. **02 — Collect — 2 PM**: "Three times a day at peak production. That frequency is what keeps eggs clean and uncracked — one collection a day is not enough for a high-producing flock."
  3. **03 — Grade — 2–4 PM**: "Between two and four, every egg is checked for cracks, size consistency and shell quality. Anything that does not meet the standard is rejected by us, not by you."
  4. **04 — Pack — 5 PM**: "Sealed into 30pc trays by five, marked with the day of collection. Yesterday's collection goes to the local market the same day rather than being held over."
  5. **05 — Deliver — 08:00**: "On the morning route, Monday to Saturday, across Machakos Town, Syokimau, Athi River, Mlolongo, Katoloni and Mwala."

### Section 05 — The people behind it (founder story) (`data-reveal`)
- Full-bleed dark section (`#133240`/`#f5f0e8`), 12-col grid, `align-items: center`.
- Col 1–5 (span 5, `.nn-zoom`), `min-height: clamp(360px,46vw,700px)`: image `public/assets/education/grown chicks-hens.jpeg`, alt `"The N&N flock"`, cover-fit, zoom-on-hover. **Overlaid caption strip** at bottom of image, `rgba(19,50,64,.88)` background, IBM Plex Mono 10px/.16em/uppercase/`rgba(245,240,232,.6)`: **"Founder portrait to be photographed — flock imagery standing in"** — i.e. the prototype explicitly flags this as a placeholder; a real founder portrait is expected to replace the flock image, and this caption strip should be removed once that photo exists.
- Col 7–12 (span 6), vertical padding `clamp(64px,8vw,130px) 0`:
  - Eyebrow row: 34px gold rule + **"05 / The people behind it"** (IBM Plex Mono 11px/.22em/uppercase/gold).
  - Pull-quote (blockquote, verbatim): **"Every egg, every day, done right."** — `clamp(26px,3.2vw,46px)`/600/1.12/-.03em.
  - Two body paragraphs (17px/1.75/`rgba(245,240,232,.62)`/max-width 52ch), verbatim:
    1. "Integrity, teamwork and consistency are the guiding principles, and they are tested most on the days nothing goes to plan — a power cut on a cold Machakos night, a batch running light by week three, a Saturday route with more orders than slots."
    2. "\u201cWhen a kiosk owner in Athi River tells me our eggs are the only ones her customers ask for by name — that's what it's all about. That trust is everything we've worked for.\u201d" (this second paragraph is itself a quoted line, i.e. a nested quote inside the section — the actual founder quote)
  - Attribution block, top border `1px solid rgba(245,240,232,.2)`, `padding-top: 22px`:
    - Name: **"The Kyalos"** (18px/600)
    - Role line: **"Founders & Directors · 5 years farming"** (IBM Plex Mono 11px/.16em/uppercase/gold)

  This is the real founder family surname: **Kyalo** (referred to collectively as "The Kyalos"). No individual first names are given anywhere in this file — only "The Kyalos" as the family/founder credit.

### Section 06 — Proof (testimonials) (`data-reveal`)
- Cream background, padding `clamp(80px,11vw,160px) clamp(20px,4vw,56px)`. 12-col grid.
- Col 1–2: eyebrow **"06 / Proof"**.
- Col 3–10 (span 8):
  - Primary pull-quote (blockquote, verbatim, large — `clamp(26px,3.4vw,52px)`/600/1.14/-.032em): **"\u201cSupply chain reliability is everything in my business. N&N delivers on time, every time — and the feedback from my retail partners has been overwhelmingly positive.\u201d"**
  - Attribution row, top border `1px solid rgba(19,50,64,.24)`, `padding-top: 22px`, flex `align-items: baseline`, `gap:20px`:
    - **"David K."** (19px/600) — **"Mlolongo · Wholesale distributor"** (IBM Plex Mono 11px/.18em/uppercase/`rgba(19,50,64,.6)`)
  - Below, a 3-column auto-fit grid (`minmax(240px,1fr)`, gap 40px, margin-top `clamp(48px,6vw,80px)`) of three smaller testimonial blocks (each: quote paragraph 16px/1.7/`rgba(19,50,64,.72)`, then name·location caption in IBM Plex Mono 11px/.16em/uppercase/`rgba(19,50,64,.55)`), verbatim:
    1. "\u201cLiving in Syokimau, it's great to have such high-quality eggs delivered right to my door.\u201d" — **Wanjiru M. · Syokimau**
    2. "\u201cInvoicing is professional, and I have never had a rejected batch.\u201d" — **Chef Kamau J. · Machakos Town**
    3. "\u201cIt's great to support a local farm that cares about sustainability.\u201d" — **Sarah L. · Katoloni**

  This gives four total testimonials/quotes on the page: the big David K. quote plus three smaller ones (Wanjiru M., Chef Kamau J., Sarah L.), each tagged with a real delivery-zone name — reinforcing the six-zone service area established elsewhere.

### Section 07 — Come and see (closing CTA) (`data-reveal`)
- Full-bleed dark section (`#133240`/`#f5f0e8`), padding `clamp(80px,11vw,170px) clamp(20px,4vw,56px)`. 12-col grid, `align-items: end`.
- Col 1–7: eyebrow **"07 / Come and see"** (gold); H2 (verbatim, large display): **"Visit the farm, or start with a tray."** (line break after "farm,") — `clamp(38px,5.6vw,88px)`/800/.92/-.038em. Body (verbatim): "We keep the barns closed to casual visitors for biosecurity, but arranged visits are welcome — footbath and farm clothing, no exceptions." (20px/1.6/`rgba(245,240,232,.65)`/max-width 46ch).
- Col 9–12: two stacked CTA buttons (flex column, gap 16px):
  - Primary: `href="Order-Flow.dc.html"`, orange (`#f59268`) background, navy text, "**Order Fresh Eggs →**" (arrow nudges right on hover via `.nn-arrow`).
  - Secondary: `href="Contact.dc.html"`, outlined (`1px solid rgba(245,240,232,.3)`), cream text, "**Arrange a visit →**".

---

## 2. Contact.dc.html

### Live open/closed status logic
Located in the hero (top-right stat block) and driven entirely by client-side JS in the page's `componentDidMount` (runs after a 300ms `setTimeout`):

- Uses `Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Nairobi', weekday: 'short', hour: 'numeric', hour12: false })` on `new Date()` to get the current weekday (`Mon`/`Tue`/.../`Sun`) and hour (0–23) **in Africa/Nairobi time**, regardless of the visitor's local timezone.
- Logic:
  - If `day === 'Sat'`: open when `hour >= 8 && hour < 12`.
  - Else if `day !== 'Sun'` (i.e. Mon–Fri): open when `hour >= 8 && hour < 17`.
  - Else (`Sun`): never open (falls through, `open` stays `false`).
- Displayed text: `#nn-open-state` span shows **"Open now"** when open, or **"Closed — messages still reach us"** when closed.
- Displayed dot (`.previousElementSibling` of the state span): a 7×7px circle. Green `#4ade80` with `nn-blink` pulse animation (2.4s ease-in-out infinite) when open; orange `#f59268` and no animation when closed.
- Static hours line directly below (always shown, not JS-driven): **"Mon–Fri 8:00–17:00 / Sat 8:00–12:00 / Sun closed"** (three lines via `<br/>`).
- On initial page load (before the 300ms timeout/JS runs), the static markup defaults to showing "Open now" with the green blinking dot — i.e. there's a brief flash of the "open" state before JS corrects it if actually closed. Worth avoiding this flash-of-wrong-state in the real build (e.g. compute status server-side or hide until computed).

### Hero section
- Cream background, padding `clamp(56px,8vw,130px) clamp(20px,4vw,56px) clamp(48px,6vw,80px)`. 12-col grid, `align-items: end`.
- Col 1–8: eyebrow (44px terracotta rule + "Contact / Machakos, Kenya", IBM Plex Mono 11px/.24em/uppercase/`rgba(19,50,64,.55)`). H1 (verbatim, two lines via `<br/>`): **"Talk to / the farm."** — `clamp(46px,7.4vw,108px)`/800/.88/-.038em. Body (verbatim): "There is no call centre. Messages reach the people who packed the tray, and most are answered within minutes during working hours." (`clamp(18px,1.4vw,21px)`/1.6/`rgba(19,50,64,.68)`/max-width 46ch).
- Col 10–12: the live status block described above (IBM Plex Mono 11px/.14em/uppercase/`rgba(19,50,64,.55)`, line-height 2.1), with a top border `1px solid rgba(19,50,64,.16)` above the static hours block.

### "Route" cards (3 contact methods)
Full-width stacked rows (not a card grid — full-bleed horizontal bars), wrapper has top border `1px solid rgba(19,50,64,.2)`. Each row is an `<a class="nn-route nn-arrow">` with 3-column grid (`2fr 3fr auto`), gap `clamp(20px,3vw,48px)`, `align-items: center`. `.nn-route:hover { background: rgba(19,50,64,.05) }` (except Route 01 which already has a solid gold background). Bottom border between rows.

1. **Route 01 · Recommended — Order on WhatsApp**
   - `href="Order-Flow.dc.html"` (i.e. this "route" links to the site's own Order-Flow concierge page, not directly to a `wa.me` link — the actual WhatsApp handoff happens inside Order-Flow).
   - Background: gold `#eccc74` (only highlighted row), padding `clamp(30px,4vw,52px) clamp(16px,2vw,28px)`.
   - Label: "Route 01 · Recommended" (IBM Plex Mono 10px/.2em/uppercase/`rgba(19,50,64,.6)`).
   - Title: **"Order on WhatsApp"** (`clamp(28px,3.2vw,46px)`/700/-.03em/line-height 1).
   - Description (verbatim): "The way most customers order. Tell us the product, quantity and area — we confirm the price and the next delivery slot, usually within minutes. No forms, no waiting." (17px/1.7/`rgba(19,50,64,.75)`/max-width 46ch).
   - Right-hand value: **"+254 113 377 623"** (IBM Plex Mono 12px/.14em/uppercase) + arrow.

2. **Route 02 — Call the farm**
   - `href="tel:0113377623"`.
   - Label: "Route 02" (`rgba(19,50,64,.45)`).
   - Title: **"Call the farm"** (`clamp(24px,2.6vw,36px)`/700/-.028em).
   - Description (verbatim): "For standing orders, bulk pricing and anything easier said than typed. Two lines, both answered on the farm."
   - Right-hand value: **"0113 377 623 · 0714 246 534"** — i.e. two phone lines, local-format (no country code) here, vs. the +254 international format used for the WhatsApp number in Route 01. Note: the tel: link itself only encodes the first number (`0113377623`); the second number (`0714 246 534`) is display-only text in this row, not itself a separate tel: link.

3. **Route 03 — Email us**
   - `href="mailto:palacepoultryn.n@gmail.com"`.
   - Label: "Route 03".
   - Title: **"Email us"** (`clamp(24px,2.6vw,36px)`/700/-.028em).
   - Description (verbatim): "Best for invoicing, wholesale agreements and anything that needs a paper trail."
   - Right-hand value: **"palacepoultryn.n@gmail.com"** (IBM Plex Mono 12px/.1em).

  Contact numbers/handles captured verbatim across the file:
  - WhatsApp: **+254 113 377 623**
  - Call line 1: **0113 377 623**
  - Call line 2: **0714 246 534**
  - Email: **palacepoultryn.n@gmail.com**

### Contact form section
- Full-bleed dark section (`#133240`/`#f5f0e8`), padding `clamp(70px,9vw,140px) clamp(20px,4vw,56px)`. 12-col grid, gap `clamp(32px,5vw,80px)`.
- Col 1–4: eyebrow **"Or leave a message"** (gold). H2 (verbatim): **"We'll come back to you."** (`clamp(30px,3.8vw,56px)`/700/1.02/-.03em). Body (verbatim): "If WhatsApp isn't convenient, this reaches the same inbox. Include your area and we can quote a delivery slot in the reply." (18px/1.7/`rgba(245,240,232,.62)`/max-width 40ch). Below, a top-bordered info block (IBM Plex Mono 11px/.14em/uppercase/`rgba(245,240,232,.5)`/line-height 2.1): "Machakos, Kenya / Mon–Fri 8:00–17:00 / Sat 8:00–12:00".
- Col 6–12 (span 7): the form itself, `id="nn-form"`, flex column, gap 34px.

  **Fields (in order):**
  1. Row (2-col grid, gap 34px):
     - **"Your name"** — `<input type="text" id="nn-name" placeholder="Wanjiru M.">`. Error text (hidden by default, shown on invalid submit): "We need a name to reply to."
     - **"Phone"** — `<input type="tel" id="nn-phone" placeholder="07XX XXX XXX">`. Error text: "A number lets us confirm the slot faster."
  2. Row (2-col grid, gap 34px):
     - **"Delivery area"** — `<select id="nn-area">`, options: "Select an area" (empty value, placeholder), "Machakos Town", "Syokimau", "Athi River", "Mlolongo", "Katoloni", "Mwala", "Somewhere else". Error text: "We need an area to quote a delivery slot."
     - **"What do you need?"** — `<select id="nn-product">` (no error state — not validated), options: "Table eggs — 30pc trays", "Poultry manure — 70kg sacks", "Ex-layer hens", "Bulk / wholesale enquiry", "Something else". First option is selected by default (no blank placeholder option here, unlike the area select).
  3. **"Message — optional"** — `<textarea id="nn-msg" rows="3" placeholder="Quantity, preferred day, anything else we should know.">`. No validation.
  4. Submit row: button `id="nn-submit"`, orange `#f59268` background, navy text, "**Send message →**" (arrow nudge on hover). Adjacent caption text (IBM Plex Mono 10px/.16em/uppercase/`rgba(245,240,232,.4)`): **"Prototype — nothing is submitted"** — explicit prototype disclaimer to be removed/replaced with real submit logic in the real build.

  **Validation behavior (JS):**
  - Validated fields: name, phone, area (message and product are not validated).
  - On `input`/`change` of a validated field, if it now has a non-empty trimmed value, its error state is cleared immediately (live-clear, not on blur).
  - On submit: `preventDefault()`, then every validated field is checked; any empty one gets marked bad (border becomes `2px solid #f59268` orange, and its error `<span>` is set to `display: block`). If any field is bad, submission is blocked (form stays visible, nothing else happens). If all three pass, the `<form>` is hidden (`display:none`) and the success panel is shown.

  **Success state** (`id="nn-success"`, hidden by default, shown on valid submit):
  - Bordered panel (`1px solid rgba(236,204,116,.45)`), animates in with `nn-open .6s cubic-bezier(.22,1,.36,1)` (opacity 0→1, translateY 12px→0).
  - Status row: green dot + **"Message received"** (IBM Plex Mono 11px/.2em/uppercase/gold).
  - Heading (verbatim): **"Thank you — we'll reply shortly."** (`clamp(26px,3vw,42px)`/700/-.03em/1.05).
  - Body (verbatim): "During working hours you will usually hear from us within the hour. If you need an answer sooner, WhatsApp is the fastest route." (18px/1.7/`rgba(245,240,232,.62)`/max-width 44ch).
  - Two actions: primary CTA "**Order on WhatsApp →**" (orange, `href="Order-Flow.dc.html"`) and secondary button "**Send another**" (outlined, `id="nn-reset"`) which hides the success panel, resets and re-shows the form (native `form.reset()`), and clears any lingering error/border states on the three validated fields.

  This success panel is the **form success state** pattern referenced in the brief — worth implementing as a reusable component since a similar "confirmation" moment likely recurs (e.g. after Order-Flow's WhatsApp handoff, or elsewhere).

### "Where we deliver" section
- Cream background, padding `clamp(70px,9vw,130px) clamp(20px,4vw,56px)`. 12-col grid.
- Col 1–2: eyebrow **"Where we deliver"**.
- Col 3–11 (span 9): H2 (verbatim): **"Six zones, on the morning route."** (`clamp(28px,3.4vw,50px)`/700/1.02/-.03em).
  - Row of 6 pill/tag chips (flex-wrap, gap 12px, `1px solid rgba(19,50,64,.26)` border, `10px 16px` padding, IBM Plex Mono 11px/.16em/uppercase), in this exact order: **Machakos Town, Syokimau, Athi River, Mlolongo, Katoloni, Mwala.**
  - Closing note (verbatim, 17px/1.7/`rgba(19,50,64,.66)`/max-width 56ch): "Nearby but not on the list? Ask us — we can often arrange something, particularly for standing orders."

  This confirms the canonical six-zone list and order used consistently across the site: **Machakos Town, Syokimau, Athi River, Mlolongo, Katoloni, Mwala** (this exact order also appears in the About page's "Deliver" timeline step and in the Contact form's area `<select>`, and — plus an extra "Collecting at the farm" / "Somewhere else" option — in Order-Flow's delivery-zone step).

---

## 3. Order-Flow.dc.html — the primary conversion mechanism

This is a **5-step client-side wizard** that builds a WhatsApp message and hands off to WhatsApp at the end. All state lives in a single in-memory JS object `S` (no persistence/localStorage) inside the page's `componentDidMount` (again gated behind a 300ms `setTimeout` before wiring up).

### Page hero
- Cream background, padding `clamp(44px,6vw,90px) clamp(20px,4vw,56px) clamp(32px,4vw,56px)`. 12-col grid, `align-items: end`.
- Col 1–7: eyebrow (44px terracotta rule + "Order concierge", IBM Plex Mono 11px/.24em/uppercase/`rgba(19,50,64,.55)`). H1 (verbatim, two lines): **"Five questions, then WhatsApp."** — `clamp(38px,5.6vw,84px)`/800/.9/-.038em.
- Col 9–12: body copy (verbatim): "We build the message for you so nothing gets missed. Nothing is sent until you press the last button." (18px/1.65/`rgba(19,50,64,.68)`).

### Overall step layout
- Cream section, 12-col grid, gap `clamp(32px,5vw,80px)`, `align-items: start`.
- **Left rail (col 1–3, `position: sticky; top: 110px`)** — the step indicator nav, top border `1px solid rgba(19,50,64,.2)`. Five rows, each `data-rail="1..5"` (clickable — `.nn-step-btn { cursor: pointer }`), 20px vertical padding, bottom border between rows (last row's border is the stronger `.2` opacity vs `.14` for the others). Each row: index number (IBM Plex Mono 11px/.16em/`rgba(19,50,64,.4)`) + title (`.nn-rail-t`, 19px/600/-.015em) + dynamic value line (`.nn-rail-v`, IBM Plex Mono 11px/.12em/uppercase/`rgba(19,50,64,.5)`).
  - Row titles: **01 Product, 02 Quantity, 03 Delivery, 04 Note, 05 Review.**
  - Default/static value text before JS runs: Product "Not chosen", Quantity "—", Delivery "—", Note "Optional", Review "—".
  - Below the five rows: a 2px-tall progress track (`rgba(19,50,64,.14)`) containing a fill bar `id="nn-bar"`, default `width: 20%`, color gold `#eccc74` (dynamically recolored to the selected product's accent color once a product is picked — see JS below), `transition: width .6s cubic-bezier(.22,1,.36,1)`.
  - Below that: **"Step {n} of 5"** caption (`id="nn-stepno"` shows "Step 1" etc., static "of 5" suffix), IBM Plex Mono 10px/.16em/uppercase/`rgba(19,50,64,.42)`.
- **Right content (col 5–12, span 8)** — one `.nn-panel[data-step="N"]` per step, only the active one has `display:block` (others `display:none`); each time a panel becomes active its `animation` is force-restarted (`nn-step-in .55s cubic-bezier(.22,1,.36,1)`: `opacity:0, translateY(18px)` → `opacity:1, translateY(0)`) via the reflow trick (`p.style.animation='none'; void p.offsetWidth; p.style.animation='nn-step-in ...'`).
- **Bottom nav bar** (shared across all steps, below the panel column, top border `1px solid rgba(19,50,64,.2)`, `margin-top: clamp(40px,5vw,64px); padding-top: 30px`): flex row, gap 18px —
  - **Back** button (`id="nn-back"`, outlined, `1px solid rgba(19,50,64,.3)`) — hidden on step 1, shown steps 2–5, decrements `S.step`.
  - **Continue →** button (`id="nn-next"`, solid navy `#133240` bg / cream text) — shown on steps 1–4, hidden on step 5, increments `S.step`. Disabled (opacity .35, `pointer-events:none`) when blocked: step 1 with no product chosen, or step 3 with no zone chosen. (Steps 2 and 4 have no hard requirement — quantity always has a default value of 2, and the note is explicitly optional.)
  - **Continue on WhatsApp →** link (`id="nn-send"`, orange `#f59268` bg / navy text) — hidden except on step 5.
  - **Hint text** (`id="nn-hint"`, IBM Plex Mono 10px/.16em/uppercase/`rgba(19,50,64,.42)`): "Choose a product to continue" (step 1, no product), "Choose an area to continue" (step 3, no zone), "Prototype — opens wa.me in production" (step 5), else empty.

### Step 1 — Product
- H2 (verbatim): **"What are you ordering?"** Body (verbatim): "Pick one. You can add a second product in the note at step four." — i.e. the flow is explicitly single-product-select by design; a second product is meant to be hand-typed into the step-4 note field rather than supported as a true multi-item cart.
- Three selectable option rows (`.nn-opt[data-product]`), each a 3-col grid (`96px 1fr auto`), border `1px solid rgba(19,50,64,.24)` (unselected), padding `18px 22px`:
  1. **Table Eggs** — `data-unit="30pc trays"`, `data-accent="#eccc74"` (gold), `data-img="public/norm/table-eggs.png"`. Swatch: gold background square with contained product image. Caption: "30pc trays · collected daily".
  2. **Poultry Manure** — `data-unit="70kg sacks"`, `data-accent="#7a9e7e"` (sage), `data-img="public/norm/manure-bags.png"`. Caption: "70kg sacks · pickup or bulk".
  3. **Ex-Layer Hens** — `data-unit="birds"`, `data-accent="#c0613b"` (terracotta), `data-img="public/norm/ex-layer-hen.png"`. Caption: "Live birds · at the farm".
  - Each row has a `.nn-tick` label reading "Select" (`rgba(19,50,64,.35)`) by default; on click it becomes "Selected" (`#133240`), the row's background tints to the product's accent color at ~18% alpha (`accent + '2e'` hex-alpha suffix) and border becomes solid navy. Selecting a product also updates the progress bar's fill color to that product's accent, updates the quantity-step's unit label/unit-word, and re-runs `show()` (recomputing rail values, preview text, and hint/next-button enabled state).

### Step 2 — Quantity
- H2 (verbatim): **"How many?"** Body (verbatim, dynamic word): "Minimum is one {tray|sack|bird}. Larger volumes are priced on request." — the singular unit word (`nn-unit-word`) is derived from the chosen product's unit string (contains "tray" → "tray"; contains "sack" → "sack"; else → "bird").
- Stepper: **−** button (`id="nn-minus"`, 52×52px square, `1px solid rgba(19,50,64,.28)`), large numeral display (`id="nn-qty"`, default **2**, `clamp(56px,7vw,92px)`/800/-.04em) with unit caption below (`id="nn-unit"`, IBM Plex Mono 11px/.18em/uppercase, defaults to "30pc trays" until a product is picked — this is a minor default/placeholder mismatch worth being deliberate about in the real build, since qty defaults to 2 even before step 1 is completed), **+** button (`id="nn-plus"`). Quantity floors at 1 (`Math.max(1, n)`) — no upper bound in the JS.
- Quick-pick buttons (flex-wrap, gap 10px, outlined chips): **1, 2, 5, 10, 30 — wholesale.** Clicking one sets quantity directly to that value (30 chip sets qty to 30, labeled explicitly as the wholesale threshold).

### Step 3 — Delivery
- H2 (verbatim): **"Where is it going?"** Body (verbatim): "We run a morning route Monday to Saturday. Saturday slots fill early in the week."
- 3-column grid (`repeat(3,1fr)`, gap 12px) of 8 selectable zone chips (`.nn-opt[data-zone]`, border `1px solid rgba(19,50,64,.24)`, padding `20px 18px`, 17px/500), in this order: **Machakos Town, Syokimau, Athi River, Mlolongo, Katoloni, Mwala, Collecting at the farm, Somewhere else.** Selected chip gets `background: rgba(19,50,64,.08)` and navy border (all zone chips share one neutral selected-state color, unlike product cards which use per-product accent colors).
- Below the grid: optional text field **"Street or landmark — optional"**, `id="nn-landmark"`, placeholder "Near Katoloni market", max-width 520px. Feeds into the review/preview as a parenthetical after the zone.

### Step 4 — Note
- H2 (verbatim): **"Anything we should know?"** Body (verbatim): "A preferred day, a second product, an invoice name. Skip it if there is nothing."
- **"Your note"** textarea (`id="nn-note"`, rows 3, placeholder "Deliver Thursday morning if possible. Invoice to the restaurant."), max-width 640px.
- Three preset chips (`.nn-preset.nn-opt`, outlined) that append canned text to the note field on click rather than replacing it: **"Weekly standing order"**, **"Need an invoice"**, **"Saturday delivery"**. Clicking appends `<preset text>.` to the existing note value (space-separated if the note already has content), so multiple presets can be stacked.

### Step 5 — Review
- H2 (verbatim): **"Ready to send."** Body (verbatim): "This is the message that opens in WhatsApp. Edit anything by tapping a step on the left." — confirms the left rail rows are clickable to jump back and edit (rail click handler: clicking rail 1 always works, clicking any other rail only works once a product has been chosen — `if (i === 1 || S.product) { S.step = i; show(); }`).
- Two-column layout (`1fr 1fr`, gap `clamp(20px,3vw,40px)`):
  - **Left: summary table.** Top-bordered rows (`1px solid rgba(19,50,64,.14)` between rows), each `justify-content: space-between`, IBM Plex Mono 11px/.14em/uppercase, right-aligned values:
    - Product — `S.product` or "—"
    - Quantity — `"{qty} {unit}"` or "—"
    - Delivery — `S.zone` or "—"
    - Note — `S.note` or "None"
    - Price — always static text **"Confirmed on reply"** (no price calculation anywhere in this flow — pricing is deliberately deferred to a human reply, consistent with Contact page copy "we confirm the price").
  - **Right: message preview panel.** Dark navy (`#133240`) box, padding `26px 24px`, label "Message preview" (gold, IBM Plex Mono 10px/.2em/uppercase), then a `<pre id="nn-preview">` block (IBM Plex Mono 13px/1.9/`rgba(245,240,232,.85)`, `white-space: pre-wrap`) showing the live-generated WhatsApp message text.

### Exact WhatsApp message format (generated by JS, live-updated on every state change)
```
Hi N&N, I'd like to order:
- {product || '___'} x {qty} {unit}
- Delivery to: {zone || '___'}{landmark ? ' (' + landmark + ')' : ''}
```
Plus, only if a note was entered:
```
- Note: {note}
```
Joined with `\n`. Example with all fields filled (Table eggs, qty 2, zone Syokimau, landmark "Near the church", note "Deliver Thursday"):
```
Hi N&N, I'd like to order:
- Table eggs x 2 30pc trays
- Delivery to: Syokimau (Near the church)
- Note: Deliver Thursday
```

### WhatsApp handoff mechanics — important caveat
This is the one piece of the flow that is **explicitly incomplete/placeholder in the prototype**:
- The step-5 CTA is `<a class="nn-arrow" id="nn-send" href="Home.dc.html" ...>Continue on WhatsApp →</a>` — its `href` is hardcoded to `Home.dc.html`, **not** a `wa.me` deep link. There is no JS anywhere in the file that rewrites `nn-send`'s `href` to a `https://wa.me/...?text=...` URL using the generated message or the WhatsApp number.
- The step-5 hint text explicitly says: **"Prototype — opens wa.me in production"** — i.e. the prototype itself flags that the real `wa.me` handoff is intentionally not wired up here and must be built for real.
- The WhatsApp number to use for the real handoff is the one given on the Contact page's Route 01 card: **+254 113 377 623** (international format, appropriate for a `wa.me/254113377623` link — `wa.me` links require the number without the leading `+` or `0`, i.e. `254113377623`).
- The message text to prefill is exactly the `#nn-preview` content described above, URL-encoded and passed as the `text=` query parameter, e.g. `https://wa.me/254113377623?text=<encoded message>`.
- Nothing in Order-Flow.dc.html itself states the phone number — it must be sourced from Contact.dc.html (Route 01, and also the tel:/Route 02 numbers) since Order-Flow's own markup never mentions a phone number at all.

### Step indicator / rail — reusable pattern
The left sticky rail (`data-rail`, progress bar, "Step N of 5" caption) is a distinct, reusable **order-step-indicator** component: sticky positioning, per-row dynamic value text, active-row highlighting (`.nn-rail-t` color flips to terracotta `#c0613b` when its step is active, else navy), opacity dimming for unreached steps unless a product has been chosen (`r.style.opacity = i <= S.step || S.product ? '1' : '.45'`), and a bottom progress bar whose fill color matches the selected product's accent. This is the "order step indicator" component referenced in the brief's component-reuse list — its exact behavior is as described here since only this file was read (verify final componentization against `Design-System.dc.html` separately, as that file was not part of this extraction).

### Component-reuse notes (testimonial, pull-quote, form success, order step indicator)
Per the brief's ask to note reuse of `Design-System.dc.html` patterns: this extraction only read About/Contact/Order-Flow, not the design-system file itself, so exact shared-component names/props in that file are not verified here. What is verifiable from these three files:
- **Testimonial pattern**: appears on About only (Section 06 "Proof") — one large-quote-plus-attribution "hero testimonial" (David K.) and a 3-up grid of smaller quote+attribution blocks (Wanjiru M., Chef Kamau J., Sarah L.). Consistent typographic treatment (IBM Plex Mono caption for name/location) suggests a single reusable Testimonial component with a "large"/"small" or "featured"/"grid" variant.
- **Pull-quote pattern**: used twice on About as a `<blockquote>` — once in "The people behind it" ("Every egg, every day, done right.") and once as the lead-in to the Proof section's David K. quote. Same type scale family (`clamp(26-52px)`/600/tight line-height/negative letter-spacing).
- **Form success state**: implemented once, on Contact, as `#nn-success` (see full breakdown above) — bordered panel, gold accent status row, heading, body, two CTAs. This exact shape should be componentized since the same "confirmation" moment likely needs to recur if a second form is added later.
- **Order step indicator**: implemented once, on Order-Flow, as the sticky left rail described above — the most complex reusable piece across these three files, tightly coupled to the wizard's state object.

If exact class/prop names from `Design-System.dc.html` are needed for 1:1 component reuse, that file should be read separately — it was intentionally out of scope for this extraction pass.
