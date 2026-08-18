# Education Hub — Design Extraction

Source files (pixel-spec, static `.dc.html`, inline styles):
- `C:\Users\fredd\Projects\Websites\nnpoutry\Inside-the-Farm.dc.html` — Education Hub index (featured article + category filter + grid)
- `C:\Users\fredd\Projects\Websites\nnpoutry\Article.dc.html` — Article template, rendered here for "Welcoming One-Day-Old Chicks" (Field note 01, The Chick Journey)
- Cross-referenced: `C:\Users\fredd\Projects\Websites\nnpoutry\Design-System.dc.html` (section "07 / Patterns" — "Article card" and "Pull quote & breadcrumb" pattern definitions, lines ~330–370)

This document is extraction only. No code. Every heading, paragraph, quote, and label below is copied verbatim from the source files unless explicitly marked as a structural/behavioral description.

---

## 0. Shared tokens seen across both files

**Fonts**
- Body/display: `'Made Tommy', 'Outfit', system-ui, sans-serif` (Outfit loaded from Google Fonts as the fallback/rendered face; "Made Tommy" is a brand font not loaded via the `<link>` tags in these prototypes — treat 'Outfit' as the actual rendered face)
- Mono (labels, eyebrows, meta, captions, numbers-labels): `'IBM Plex Mono', monospace`

**Colors (hex, as used)**
- `#f5f0e8` — cream / page background ("editorial ground")
- `#133240` — near-black navy (body text color AND dark section background AND placeholder/image background)
- `#c0613b` — terracotta (link hover, category eyebrow labels, field-note numbers, arrow-link accents on cream backgrounds)
- `#eccc74` — gold (accent rule above pull-quotes, "Featured" label, farmer's-tip label, stat numbers on dark, progress bar fill, CTA eyebrow on dark)
- `#f59268` — peach/orange (primary CTA button fill, used once on dark CTA band)
- `rgba(19,50,64, X)` — navy at various opacities for secondary text/borders on cream
- `rgba(245,240,232, X)` — cream at various opacities for secondary text/borders on navy
- `#4ade80` — green (form-success dot, from Design System, not used in these two files but part of shared palette)

**Global CSS behaviors (both files carry identical rules)**
- `.nn-zoom` — image container `overflow:hidden`; child `img` has `transition: transform 1.3s cubic-bezier(.22,1,.36,1)`; on `:hover` the image scales to `1.06`. This is THE hover treatment for every photo/card image in both files.
- `.nn-arrow` — link with a trailing `<span class="nn-a">→</span>`; on hover the arrow translates `translateX(7px)` over `.45s cubic-bezier(.22,1,.36,1)`.
- `.nn-navlink` / `.nn-menu-link` — header nav underline/indent hover states (from `SiteHeader` import, not redefined here).
- `a:hover { color: #c0613b; }` globally.
- `img { display: block; }`, `box-sizing: border-box` globally, no rounded corners anywhere, no box-shadows anywhere — square corners is a hard site-wide rule (confirmed explicitly in Design-System.dc.html: "Square corners throughout — no rounded cards, no glass, no drop shadows").
- Responsive breakpoint: at `max-width: 900px`, any inline style containing `repeat(12, 1fr)`, `repeat(3, 1fr)`, or `repeat(2, 1fr)` collapses to `1fr` (single column), and any element with an inline `grid-column` resets to `grid-column: auto`. This is the only responsive rule defined in either file — everything else is fluid via `clamp()`.
- Both pages import `<dc-import name="SiteHeader" variant="solid" active="Inside" hint-size="100%,85px">` and `<dc-import name="SiteFooter" hint-size="100%,420px">` — header/footer are shared components, not defined in these files.
- Page background is `#f5f0e8` cream, set on `html, body`.

---

## 1. Inside-the-Farm.dc.html — Education Hub Index

### 1.1 Page structure (top to bottom)

1. SiteHeader import (`variant="solid"`, `active="Inside"`)
2. Hero/title section (cream)
3. Featured article — single full-width image block (cream section wrapper)
4. Filter bar + article grid (cream)
5. Dark CTA band ("From notes to trays")
6. SiteFooter import

### 1.2 Hero/title section

- Section padding: `clamp(56px, 8vw, 120px) clamp(20px, 4vw, 56px) clamp(40px, 5vw, 70px)`, background `#f5f0e8`.
- Inner wrapper: `max-width: 1600px`, `margin: 0 auto`, 12-col grid, `gap: 32px`, `align-items: end`.
- **Left column** (`grid-column: 1 / span 8`):
  - Eyebrow row: 44px-wide, 1px terracotta (`#c0613b`) horizontal rule + mono label, uppercase, `11px`, letter-spacing `.24em`, color `rgba(19,50,64,.55)`. Text: **"Field notes from Machakos"**
  - `<h1>`: **"Inside<br />the Farm"** — `font-size: clamp(46px, 7.6vw, 112px)`, `font-weight: 800`, `line-height: .88`, `letter-spacing: -.038em`, no margin.
- **Right column** (`grid-column: 10 / span 3`):
  - Paragraph, `18px`, `line-height:1.65`, color `rgba(19,50,64,.68)`: **"What we have learned raising layers in Machakos County — written by the people doing the work, not a content team."**
  - Mono meta line below, `10px`, uppercase, letter-spacing `.16em`, color `rgba(19,50,64,.42)`, `line-height:1.9`: **"Seven notes · three sections"** (line break) **"Publication dates come from Sanity"**

  > Note: the meta line explicitly states "Seven notes" but the grid below renders exactly 6 article cards (Field notes 02–07) plus the featured one (Field note 01) = 7 total pieces of content across the page. Treat "seven notes" as the real content count (1 featured + 6 grid cards = 7 field notes), and "three sections" as the three categories.

### 1.3 Featured article block

- Wrapping section: cream, no top padding, `padding: 0 clamp(20px,4vw,56px) clamp(56px,7vw,90px)`.
- The whole block is a single `<a class="nn-zoom" href="Article.dc.html">`, `max-width: 1600px`, centered.
- Image container: `position: relative; aspect-ratio: 21/9; overflow: hidden; background: #133240;`
  - `<img src="public/assets/education/one day old chicks.jpeg" alt="Day-old chicks in the brooding house">`, `object-fit: cover`, full bleed.
  - Gradient scrim overlay (`position:absolute; inset:0`): `linear-gradient(180deg, rgba(19,50,64,.15) 0%, rgba(19,50,64,.25) 45%, rgba(19,50,64,.9) 100%)` — darkens toward the bottom so the text block sits on a near-opaque navy wash.
  - Text block pinned bottom-left-to-right (`position:absolute; left:0; right:0; bottom:0`), padding `clamp(28px,4vw,60px)`:
    - Eyebrow row (flex, gap 16px, wrap, margin-bottom 22px, mono 11px uppercase letter-spacing .2em):
      - **"Featured · Field note 01"** in gold `#eccc74`
      - **"The Chick Journey"** in `rgba(245,240,232,.55)`
    - `<h2>` **"Welcoming One-Day-Old Chicks"** — `font-size: clamp(28px,4.4vw,68px)`, `font-weight:700`, `line-height:.98`, `letter-spacing:-.035em`, color `#f5f0e8`, `max-width:22ch`.
    - Excerpt paragraph, `font-size: clamp(16px,1.4vw,20px)`, `line-height:1.6`, color `rgba(245,240,232,.72)`, `max-width:52ch`:
      **"The critical first twenty-four hours of a chick's life on the farm — heaters on before seven, water lines flushed, and a backup heat source on hand."**
    - `.nn-arrow` link, mono `11px` uppercase letter-spacing `.18em`, color gold `#eccc74`, bottom border `1px solid rgba(236,204,116,.5)`, padding-bottom `6px`: **"Read the note →"**

**This differs from a grid card in three ways:** (1) it's a full-bleed 21:9 image with text overlaid directly on a dark gradient scrim rather than image-above/text-below; (2) it carries a "Featured · Field note 01" gold eyebrow instead of a plain terracotta field-note-number + category pair; (3) it has a visible "Read the note →" CTA link, which no grid card has.

### 1.4 Filter bar

- Sits inside the grid section, above the article grid, inside the same `max-width:1600px` wrapper.
- Flex row, `gap:26px`, wraps, `align-items:center`, `padding-bottom:20px`, `border-bottom: 1px solid rgba(19,50,64,.2)`, `margin-bottom: clamp(36px,4vw,56px)`.
- Contents, left to right:
  1. Static mono label, `10px` uppercase letter-spacing `.2em`, color `rgba(19,50,64,.42)`: **"Filter"**
  2. Four `<button class="nn-filter" data-filter="...">` elements, all `background:none; border:0`, mono `11px` uppercase letter-spacing `.18em`, each with its own `border-bottom` (1px):
     - `data-filter="all"` `data-on="1"` (active by default) — text **"All notes"**, border-bottom `#133240` (solid navy), color `#133240`
     - `data-filter="chick"` — text **"The Chick Journey"**, border-bottom `transparent`, color `rgba(19,50,64,.5)`
     - `data-filter="care"` — text **"Growth & Care"**, border-bottom `transparent`, color `rgba(19,50,64,.5)`
     - `data-filter="product"` — text **"Product Excellence"**, border-bottom `transparent`, color `rgba(19,50,64,.5)`
  3. Right-aligned (`margin-left:auto`) live counter, `id="nn-count"`, mono `10px` uppercase letter-spacing `.16em`, color `rgba(19,50,64,.42)`: default text **"Showing 6 of 6"**

**Filter behavior (from the inline `<script data-dc-script>`):**
- On click of any `.nn-filter` button: all buttons reset to inactive style (`color: rgba(19,50,64,.5)`, `border-bottom-color: transparent`, `data-on` attribute removed), then the clicked button gets `data-on="1"`, `color:#133240`, `border-bottom-color:#133240`.
- `apply(filter)` walks every `.nn-item`: if the item's `data-cat` matches the filter (or filter is `"all"`), it's shown (`opacity:1`, `display:''`); otherwise it fades out (`opacity:0`) and after a 300ms delay gets `display:'none'`. This produces a fade-out-then-collapse, fade-in-immediately pattern — no fade-IN transition is defined via CSS class (only inline opacity set to `1` synchronously), so the show transition is effectively instant while hide is a 300ms crossfade-then-remove.
- The `#nn-count` text updates to `Showing {shown} of {total}` on every filter change.
- Filtering initializes on a 300ms `setTimeout` after mount (`apply('all')` runs once at load).
- This filter logic is plain vanilla JS/DOM (`querySelectorAll`, inline style mutation) — not React state — so a Next.js port should re-implement it as component state (`useState` for active filter, conditional render/opacity) rather than porting the DOM-mutation approach directly.

### 1.5 Article grid — layout and card pattern

- Grid: `display:grid; grid-template-columns: repeat(12, 1fr); gap: clamp(24px,3vw,48px) clamp(20px,3vw,40px);` inside the same 1600px wrapper.
- 6 grid items (`<a class="nn-item nn-zoom" data-cat="...">`), each `data-cat` matching a filter value (`chick` / `care` / `product`).
- **Cross-referenced canonical "Article card" pattern** (Design-System.dc.html, lines 330–338, labelled "Article card"): image (`aspect-ratio 3/2`, `overflow:hidden`, `background:#133240`) → meta row (flex, gap 16px, margin `18px 0 10px`, mono `10px` uppercase letter-spacing `.18em`: field-note number in terracotta `#c0613b` FIRST, then category in `rgba(19,50,64,.5)`) → title (`26px` weight 600 in the design-system spec; sizes vary by card size in the actual grid, see below). Design system's own annotation: *"No border, no shadow. Category in terracotta, note number first. Image zoom on hover."* — note the design-system text says "category in terracotta" but the actual markup (both in the pattern block and in the live grid) colors the **field-note number** terracotta and the **category** at 50% navy opacity — the annotation is imprecise; follow the actual rendered styles, not the annotation prose.
- Card variants actually present in the grid (asymmetric bento layout, not a uniform grid):
  1. **Card 1** (`grid-column: span 7`) — image `aspect-ratio 16/9`; title `font-size: clamp(24px,2.6vw,38px)` weight 600; HAS an excerpt paragraph (`17px`, `line-height:1.65`, `rgba(19,50,64,.66)`, `max-width:48ch`).
  2. **Card 2** (`grid-column: span 5`, `align-self:end`) — image `aspect-ratio 4/5` (portrait); title `clamp(22px,2.2vw,32px)`; HAS excerpt (`16px`, `max-width:44ch`).
  3. **Card 3** (`grid-column: span 4`) — image `aspect-ratio 3/2`; title `clamp(20px,2vw,28px)`; NO excerpt.
  4. **Card 4** (`grid-column: span 4`) — image `aspect-ratio 3/2`; title `clamp(20px,2vw,28px)`; NO excerpt.
  5. **Card 5** (`grid-column: span 4`) — image `aspect-ratio 3/2`; title `clamp(20px,2vw,28px)`; NO excerpt.
  6. **Card 6** (`grid-column: span 12`, full-width horizontal layout) — `display:grid; grid-template-columns: 5fr 7fr; gap: clamp(20px,3vw,48px); align-items:center;`, has a top border (`border-top:1px solid rgba(19,50,64,.16)`) and its own top padding (it's visually separated from the 3-up row above it as a closing full-bleed feature row). Image `aspect-ratio 16/10`. Title `clamp(24px,3vw,44px)` weight 600. HAS excerpt (`17px`, `line-height:1.7`, `max-width:56ch`).
- Meta-row spacing differs slightly by card size: large cards (1, 2, 6) use `margin: 20px 0 12px` (or `margin-bottom:16px` for card 6) for the eyebrow row; smaller cards (3, 4, 5) use `margin: 18px 0 10px`.

### 1.6 All six articles verbatim (grid) + the featured article

| # | Field note | Category (`data-cat`) | Title (verbatim) | Excerpt (verbatim, if shown) | Image path | Aspect ratio | Grid span |
|---|---|---|---|---|---|---|---|
| Featured | Field note 01 | The Chick Journey (label shown as "Featured · Field note 01") | **Welcoming One-Day-Old Chicks** | "The critical first twenty-four hours of a chick's life on the farm — heaters on before seven, water lines flushed, and a backup heat source on hand." | `public/assets/education/one day old chicks.jpeg` | 21/9 | full width, standalone block |
| 02 | Field note 02 | `chick` — The Chick Journey | **The Science of Chick Feeding** | "Building a strong skeletal and immune system through nutrition — and why we weigh a random sample twice a week." | `public/assets/education/chicks feeding.jpeg` | 16/9 | span 7 |
| 03 | Field note 03 | `care` — Growth & Care | **From Pullet to Layer Hen** | "The transition handled over a week, not overnight — and why first light stimulation waits until exactly seventeen weeks." | `public/assets/education/pullets.jpeg` | 4/5 | span 5 |
| 04 | Field note 04 | `care` — Growth & Care | **Flock Care and Daily Operations** | none shown | `public/assets/education/grown chicks-hens.jpeg` | 3/2 | span 4 |
| 05 | Field note 05 | `product` — Product Excellence | **Peak Production: The Layer Phase** | none shown | `public/assets/education/layers.jpeg` | 3/2 | span 4 |
| 06 | Field note 06 | `product` — Product Excellence | **Sustainable Farming with Organic Manure** | none shown | `public/assets/education/poultry-manure.png` | 3/2 | span 4 |
| 07 | Field note 07 | `care` — Growth & Care | **Controlled Access for Enhanced Biosecurity** | "We don't allow casual visitors into the barns — even family. One outbreak can wipe out months of work, and the most common entry point isn't people. It's second-hand equipment." | `public/images/biosecurity.jpeg` | 16/10 | span 12 (full width) |

Alt text used per image, verbatim:
- Featured: "Day-old chicks in the brooding house"
- 02: "Chicks feeding"
- 03: "Pullets in the grower house"
- 04: "Daily flock walk-through"
- 05: "Layer hens at peak production"
- 06: "Organic manure on soil"
- 07: "Controlled access to the barns"

Category tallies: The Chick Journey = 2 pieces (featured + #02), Growth & Care = 3 pieces (#03, #04, #07), Product Excellence = 2 pieces (#05, #06). Total 7 field notes across the page (matches the "Seven notes" meta line), but only 6 are inside the filterable `.nn-item` grid (the featured block is outside the filter system entirely and is not tagged with `data-cat`).

All 7 articles link to the same placeholder target: `href="Article.dc.html"` — i.e., in the prototype every card points at one shared article template; real slugs/routes will need to be assigned per article when building the actual Next.js site.

### 1.7 Reveal animation (both grid and CTA section)

- `<section data-reveal>` elements (only the dark CTA band uses `data-reveal` in this file) animate in via `IntersectionObserver`: initial state `opacity:0; transform: translateY(28px)`, transitioning to `opacity:1; transform:none` over `1s cubic-bezier(.22,1,.36,1)` (both opacity and transform), triggered when the element enters viewport with `rootMargin: '0px 0px -10% 0px'`.

### 1.8 Dark CTA band ("From notes to trays")

- Full-width section, `background:#133240`, `color:#f5f0e8`, padding `clamp(80px,11vw,160px) clamp(20px,4vw,56px)`, has `data-reveal` (fades/slides in on scroll).
- 12-col grid, `align-items:end`.
- **Left** (`grid-column: 1 / span 7`):
  - Eyebrow, mono `11px` uppercase letter-spacing `.22em`, color gold `#eccc74`, margin-bottom `30px`: **"From notes to trays"**
  - `<h2>` **"All of this ends<br />up in a tray."** — `clamp(36px,5.2vw,82px)`, weight 800, `line-height:.92`, `letter-spacing:-.038em`.
  - Paragraph, `20px`, `line-height:1.6`, color `rgba(245,240,232,.65)`, `max-width:44ch`: **"Everything written here is why the eggs taste the way they do. You can taste the practice, not just read about it."**
- **Right** (`grid-column: 9 / span 4`), flex column, `gap:16px`, two `.nn-arrow` buttons:
  - Primary: `href="Order-Flow.dc.html"`, filled `background:#f59268`, `color:#133240`, padding `24px 28px`, `18px` weight 600: **"Order Fresh Eggs →"**
  - Secondary: `href="Products.dc.html"`, outlined `border:1px solid rgba(245,240,232,.3)`, `color:#f5f0e8`, same padding/size: **"See all products →"**

---

## 2. Article.dc.html — Article Template (rendered as Field note 01, "Welcoming One-Day-Old Chicks")

### 2.1 Page structure (top to bottom)

1. Fixed reading-progress bar (`#nn-progress`)
2. SiteHeader import (`variant="solid"`, `active="Inside"`)
3. Breadcrumb strip
4. Header (category/note-number/read-time meta, H1, dek)
5. Full-bleed hero figure with caption
6. Article body: 12-col grid with sticky fact rail (left, 2 cols) + body copy (center, 6 cols, offset to col 4) + sticky "Farmer's tip" callout (right, 2 cols)
7. Two-image duo figure with caption
8. Dark "The numbers" stat band
9. "Keep reading" related-articles grid (3-up)
10. Gold product cross-sell CTA band
11. SiteFooter import

### 2.2 Reading-progress bar

- Element: `<div id="nn-progress">`, fixed position.
- Exact style: `position: fixed; top: 0; left: 0; height: 2px; width: 0; background: #eccc74; z-index: 95; transition: width .12s linear;`
- It is a thin (2px) solid gold horizontal bar pinned to the very top edge of the viewport, full document width available, but its own `width` is animated from 0% to 100%.
- Behavior (inline `<script data-dc-script>`): on scroll (`passive:true` listener) and once on mount, computes `scrollHeight - innerHeight` as the scrollable distance, sets `bar.style.width = (scrollY / thatDistance) * 100 + '%'`. Guards against divide-by-zero (`h > 0 ? ... : 0`). No debounce/throttle beyond the browser's native scroll event cadence; the `.12s linear` CSS transition smooths the visual update between scroll ticks.
- z-index 95 — sits above normal content but the value implies it's designed to sit under a z-index-100+ header/nav if one exists (SiteHeader import is a shared component not shown here, so its own z-index isn't visible in this file, but 95 suggests intentional layering just below it).
- Renders BEFORE the SiteHeader import in DOM order but is fixed so visual stacking is independent of DOM order.

### 2.3 Breadcrumb

- Wrapping div: `background:#f5f0e8`, `padding: 22px clamp(20px,4vw,56px) 0` (sits directly under the header, before the article `<header>`).
- Inner: `max-width:1600px`, centered, mono `10px` uppercase letter-spacing `.2em`, color `rgba(19,50,64,.45)`, flex row, `gap:12px`, wraps.
- Verbatim content: **Home** / **Inside the Farm** / **The Chick Journey** — where "Home" links `Home.dc.html`, "Inside the Farm" links `Inside-the-Farm.dc.html`, and the final crumb (current page's category, NOT the article title) is plain text (not a link) in the darker `color:#133240` (vs `rgba(19,50,64,.45)` for the linked crumbs).
- Separator between crumbs is a literal `/` character in its own `<span>`.
- Pattern matches the Design-System.dc.html "Pull quote & breadcrumb" example almost exactly (same mono sizing/letter-spacing), except the design-system's demo breadcrumb terminates on a specific page name ("Table Eggs") rather than a category — confirms the last crumb is the *current page's identity*, and for an article that's rendered as the category, not the article title.

### 2.4 Header block

- `<header>`, cream, padding `clamp(44px,6vw,90px) clamp(20px,4vw,56px) clamp(40px,5vw,70px)`.
- Inner: `max-width:1600px`, 12-col grid, content constrained to `grid-column: 2 / span 8` (i.e., inset from the left edge by one column, NOT full width — distinct from the hub page's hero which starts at column 1).
- Meta row: flex, `gap:22px`, wraps, `margin-bottom:34px`, mono `11px` uppercase letter-spacing `.2em`:
  - **"The Chick Journey"** — color `#c0613b` (terracotta, category)
  - **"Field note 01"** — color `rgba(19,50,64,.5)`
  - **"6 min read"** — color `rgba(19,50,64,.5)`
- `<h1>` **"Welcoming One-Day-Old Chicks"** — `font-size: clamp(38px,6vw,92px)`, weight 800, `line-height:.92`, `letter-spacing:-.038em`, margin-bottom `34px`.
- Dek/subhead paragraph, `font-size: clamp(20px,1.8vw,27px)`, `line-height:1.5`, color `rgba(19,50,64,.72)`, `max-width:44ch`:
  **"The critical first twenty-four hours of a chick's life on the farm — and why those few hours set the tone for everything that follows."**

  (Note: this dek is a variant/extension of the hub-page excerpt — same opening clause, different close. Treat the hub excerpt and the article dek as independently-authored fields, not the same string reused.)

### 2.5 Hero figure

- `<figure>`, margin-bottom `clamp(48px,6vw,90px)`.
- Image container: `height: clamp(340px,52vw,720px)` (height-driven, not aspect-ratio-driven, unlike every other image on the site), `overflow:hidden`, `background:#133240`.
- `<img src="public/assets/education/one day old chicks.jpeg" alt="Day-old chicks under the brooder">` — same source photo as the hub's featured-article image but different alt text. `object-fit:cover`, plus a CSS keyframe animation on load: `animation: nn-hero-settle 2.2s cubic-bezier(.22,1,.36,1) both;` where `@keyframes nn-hero-settle { from { transform: scale(1.06); } to { transform: scale(1); } }` — the hero image starts zoomed in 6% and settles to normal scale over 2.2s on page load (a Ken-Burns-style entrance, distinct from the hover-zoom used elsewhere).
- `<figcaption>`: `max-width:1600px`, centered, padding matches page gutter, mono `10px` uppercase letter-spacing `.16em`, color `rgba(19,50,64,.45)`. Verbatim: **"Brooding house, arrival morning — heaters on, water lines flushed, lighting kept bright"**

### 2.6 Article body grid + sticky fact rail

- `<article>`, cream, padding `0 clamp(20px,4vw,56px) clamp(60px,8vw,110px)`.
- Inner: `max-width:1600px`, 12-col grid, `gap:32px`.
- **Left rail** (`grid-column: 1 / span 2`, `<aside>`): `align-self:start`, **`position:sticky; top:110px;`** (this is the sticky fact rail). Mono `10px` uppercase letter-spacing `.16em`, color `rgba(19,50,64,.5)`, `line-height:2`.
  - Four stacked fact blocks, each `border-top: 1px solid rgba(19,50,64,.2)`, `padding-top:14px`, `margin-bottom:24px` (last one has no margin-bottom). Each block: a small dim label (`color: rgba(19,50,64,.4)`) then a bold value line (`color:#133240`, `font-size:15px`, `letter-spacing:.04em`).
  - Verbatim fact rail content, in order:
    1. Label **"Brooder temp"** → value **"32–35°C"**
    2. Label **"Arrival window"** → value **"Before 07:00"**
    3. Label **"Hatchery"** → value **"Nairobi"**
    4. Label **"Critical period"** → value **"First 24 hrs"**
  - This rail is purely presentational static data pulled from the article's own content (matches the "32 to 35 degrees" and "before seven in the morning" facts stated in the body copy) — i.e., it's a quick-reference summary of numbers embedded elsewhere in the prose, not independent data.
- **Center body column** (`grid-column: 4 / span 6`) — see §2.7 for full verbatim copy.
- **Right rail** (`grid-column: 11 / span 2`, `align-self:start`) — the "Farmer's tip" callout box, see §2.8.

Grid math check: columns 1–2 (rail) + gap + col 3 empty + cols 4–9 (body, span 6) + col 10 empty + cols 11–12 (tip box) = 12 columns total, with columns 3 and 10 acting as intentional whitespace gutters flanking the reading column. This is a 5-column asymmetric layout (rail / gutter / body / gutter / tip), not a simple 3-column split.

### 2.7 Full body copy — verbatim, in exact order and structure

This is the complete rendered article body for "Welcoming One-Day-Old Chicks." Every paragraph, heading, and the pull-quote below is copied exactly as written in the source file.

---

**[body paragraph, lede style — 20px, line-height 1.75, color rgba(19,50,64,.82)]**

> The journey of our high-quality table eggs begins with healthy, vigorous one-day-old chicks. When they arrive at our farm, the first twenty-four hours are critical for their long-term health and productivity.

**[body paragraph — 19px, line-height 1.8, color rgba(19,50,64,.72)]**

> We receive our day-old chicks from a trusted hatchery in Nairobi. The moment they arrive — usually before seven in the morning — we're already in the brooding house: heaters on, water lines flushed and ready. Those first few hours set the tone for everything.

**[H2 — clamp(26px,2.8vw,40px), weight 700, letter-spacing -.028em, line-height 1.08]**

> A chick cannot keep itself warm

**[body paragraph]**

> We prepare specialised brooding houses with precise temperature control, around 32 to 35 degrees, because young chicks cannot yet regulate their own body temperature. Lighting is kept deliberately bright so they can locate water and feed without hunting for it.

**[body paragraph]**

> Immediate access to clean, electrolyte-infused water and high-quality starter feed lets them recover from transport stress and begin healthy growth straight away. A chick that drinks in the first hour is a chick that eats in the second.

**[Pull-quote — blockquote, see §2.9 for full styling detail]**

> "One power cut on a cold Machakos night is all it takes to lose an entire batch."
> — The Kyalos · Founders

**[H2]**

> What we do differently

**[body paragraph]**

> From experience, we always keep a backup heat source on hand for the first week. It is the least glamorous item on the farm and the one we would replace first. Reliability at this stage is not about equipment quality — it is about having a second option when the first one fails at two in the morning.

**[body paragraph]**

> Everything after this point compounds. Uniform, well-started chicks become uniform pullets, and uniform pullets become a flock that reaches peak production together rather than in a long, uneven tail.

---

**Body typography summary:**
- Lede paragraph (first only): `20px / 1.75 / rgba(19,50,64,.82)` — slightly larger and darker/more opaque than the rest of the body, `margin-bottom:28px`.
- Standard body paragraphs: `19px / 1.8 / rgba(19,50,64,.72)`, `margin-bottom:44px` on paragraphs that precede a new section (H2 or blockquote), `margin-bottom:28px` on paragraphs immediately followed by another paragraph.
- H2s: `clamp(26px,2.8vw,40px)`, weight 700, `letter-spacing:-.028em`, `line-height:1.08`, `margin-bottom:22px`. Two H2s total in this article: "A chick cannot keep itself warm" and "What we do differently."
- All body text uses `text-wrap: pretty` for improved line-wrap ragging.
- No H3s, no bulleted/numbered lists, no inline links, no bold/italic inline emphasis anywhere in the sample body copy — the prose is plain paragraphs and two H2 section breaks plus one blockquote.

### 2.8 "Farmer's tip" callout box — exact styling

This is the sticky right-rail box (`grid-column: 11 / span 2`, `align-self:start` — NOT `position:sticky` itself; only the left fact-rail uses `position:sticky` in this file. The right box scrolls normally with the body copy, it is not pinned).

Exact inline style of the box: `background: #133240; color: #f5f0e8; padding: 26px 22px;`

Contents:
1. Label, mono `10px`, uppercase, letter-spacing `.18em`, color gold `#eccc74`, margin-bottom `16px`: **"Farmer's tip"**
2. Body paragraph, `15px`, `line-height:1.7`, color `rgba(245,240,232,.75)`, `text-wrap:pretty`, no heading icon of any kind (no emoji, no SVG icon — the label text itself, in gold caps, is the only visual marker):
   **"Keep a backup heat source for the first week. A single power cut on a cold night is all it takes."**

**On "authorNote":** No separate `authorNote` callout box is rendered anywhere in Article.dc.html — only the single "Farmer's tip" (`farmerTip`) box appears in this file. Do not invent an authorNote box styling from this source; if the CMS schema has an `authorNote` field distinct from `farmerTip`, its visual treatment is not demonstrated in either prototype file read for this extraction. The closest "author's own voice" moment on the page is the pull-quote (§2.9), attributed directly to "The Kyalos · Founders" — that may be the intended authorNote surface, but it uses the pull-quote component, not a distinct boxed callout. Flag this gap to whoever builds the CMS schema / component before assuming a second box style exists.

### 2.9 Pull-quote — exact styling, cross-referenced with Design System

Article.dc.html markup (in the body column, between paragraphs 3 and 4):

```
<blockquote style="margin: 0 0 44px; padding: 34px 0; border-top: 2px solid #eccc74; border-bottom: 1px solid rgba(19,50,64,.2);">
  <p>"One power cut on a cold Machakos night is all it takes to lose an entire batch."</p>
  <div>The Kyalos · Founders</div>
</blockquote>
```
(reconstructed structure; exact inline styles below)

- Quote text: `font-size: clamp(24px,2.6vw,38px)`, weight 600, `line-height:1.2`, `letter-spacing:-.028em`, `text-wrap:pretty`, margin-bottom `18px`.
- Attribution line: mono, `11px`, uppercase, letter-spacing `.18em`, color `rgba(19,50,64,.55)`.
- Rule treatment: **2px solid gold (`#eccc74`) border-top**, **1px solid `rgba(19,50,64,.2)` border-bottom**, `34px 0` vertical padding, no left border, no background fill, no quotation-mark glyph/icon — the quote marks are literal curly-quote characters (`"..."`) typed into the text itself.

**Cross-reference, Design-System.dc.html "Pull quote & breadcrumb" pattern (lines 363–370):** matches exactly — same gold-2px-top / hairline-bottom rule treatment, same quote used as the demo example ("One power cut on a cold night is all it takes." — note the design-system demo version drops "Machakos" and "to lose an entire batch" for brevity, but the real article renders the fuller line above; use the Article.dc.html version as canonical). Design system's own annotation for this pattern: *"Gold 2px rule above, hairline below. Attribution in mono, never italic."*

Design-System.dc.html also documents a second, larger-scale "Testimonial" pull-quote variant (lines 404–413, e.g. "I have never had a rejected batch." — Chef Kamau J.) with a `border-top` attribution rule instead of the gold-rule-above style and larger type (`clamp(24px,2.4vw,34px)`). That testimonial variant is NOT used in Article.dc.html — the article template uses only the gold-rule-above blockquote style. Do not conflate the two; the testimonial variant belongs to product/review pages, not the article template.

### 2.10 Two-image duo figure

- `<figure>`, cream background, margin-bottom `clamp(48px,6vw,90px)`.
- Grid: `max-width:1600px`, centered, `padding:0 clamp(20px,4vw,56px)`, `display:grid; grid-template-columns: repeat(2,1fr); gap: clamp(16px,2vw,32px);`.
- Two `.nn-zoom` image cells, each `aspect-ratio:4/3`, `overflow:hidden`, `background:#133240`, `data-mask` attribute present (no visible effect defined for `data-mask` in the CSS shown — likely a hook for a JS/CSS effect defined elsewhere, e.g. `motion.js`, not visible in this file).
  - Left: `chicks feeding.jpeg`, alt "Chicks at the feeding line"
  - Right: `pullets.jpeg`, alt "The same batch as pullets"
- Caption row: same container width/padding as the images, mono `10px` uppercase letter-spacing `.16em`, color `rgba(19,50,64,.45)`, flex row `gap:40px` wraps:
  - **"Left — week one at the feeding line"**
  - **"Right — the same batch at week sixteen"**

This is a before/after growth comparison device — same photographic subjects as grid cards 02 and 03 on the hub page, repurposed here as a paired "then vs. now" visual.

### 2.11 "The numbers" stat band (dark)

- Full-width section, `background:#133240`, `color:#f5f0e8`, padding `clamp(60px,8vw,110px) clamp(20px,4vw,56px)`. No `data-reveal` attribute on this section (unlike the hub page's CTA band).
- 12-col grid inside `max-width:1600px` wrapper.
- Left label (`grid-column:1/span 2`), mono `11px` uppercase letter-spacing `.2em`, color gold `#eccc74`: **"The numbers"**
- Right stat row (`grid-column: 3/span 9`), `display:grid; grid-template-columns: repeat(3,1fr);`, `border-top: 1px solid rgba(245,240,232,.2)`. Three cells, each separated by `border-right: 1px solid rgba(245,240,232,.2)` (except the last), padding roughly `32px 24px 28px` (edge cells lose the outer horizontal padding on their outward side).
  - Each cell: big number `font-size: clamp(38px,4vw,60px)`, weight 800, `letter-spacing:-.035em`, color gold `#eccc74`, `line-height:1`; label below in mono `10px` uppercase letter-spacing `.18em`, color `rgba(245,240,232,.5)`, `margin-top:14px`.
  - Verbatim stats:
    1. **"32–35°"** — "Brooder temperature, week one"
    2. **"20–22%"** — "Protein in starter crumble"
    3. **"17 wks"** — "First light stimulation"

  (Cross-check against fact rail §2.6: brooder temp matches "32–35°C"; "17 wks" matches the hub-page card-03 excerpt claim of "exactly seventeen weeks" for first light stimulation. The 20–22% protein stat is new information not stated elsewhere on this page or the hub page — treat it as this article's exclusive fact.)

### 2.12 "Keep reading" related articles

- Cream section, padding `clamp(60px,8vw,120px) clamp(20px,4vw,56px)`.
- Section label above a hairline: mono `11px` uppercase letter-spacing `.2em`, color `rgba(19,50,64,.45)`, `padding-bottom:20px`, `border-bottom:1px solid rgba(19,50,64,.2)`, `margin-bottom:40px`: **"Keep reading"**
- Grid: `repeat(3, 1fr)`, `gap: clamp(20px,3vw,40px)`. Three `.nn-zoom` cards, each: image (`aspect-ratio 3/2`, `background:#133240`) → category label (mono `10px` uppercase letter-spacing `.18em`, color terracotta `#c0613b`, margin `18px 0 10px`) → title (`clamp(20px,2vw,27px)`, weight 600, `letter-spacing:-.02em`, `line-height:1.15`). Simpler than the hub grid card: no field-note number shown, no excerpt, category only.
- Verbatim related-article cards:
  1. **"The Chick Journey"** — **"The Science of Chick Feeding"** (`chicks feeding.jpeg`)
  2. **"Growth & Care"** — **"From Pullet to Layer Hen"** (`pullets.jpeg`)
  3. **"Growth & Care"** — **"Controlled Access for Enhanced Biosecurity"** (`public/images/biosecurity.jpeg`)
  - All three link to `Article.dc.html` (same shared placeholder target as the hub page).
  - These three picks are curated to exclude the current article and skew toward the same/adjacent categories (2 of 3 are "Growth & Care"; none are "Product Excellence") — likely "same category first, recency second" curation logic, not random.

### 2.13 Product cross-sell CTA band (gold)

- Full-width section, `background:#eccc74` (gold — the only section on either page using gold as a full background rather than an accent), padding `clamp(60px,8vw,120px) clamp(20px,4vw,56px)`.
- 12-col grid, `align-items:center`, `gap: clamp(24px,4vw,56px)`.
- **Product image** (`grid-column:1/span 3`): square, `background: rgba(255,255,255,.35)` (white wash at 35% over the gold), `padding:10%`, image `object-fit:contain` — `table-eggs.png`, alt "A 30pc tray of table eggs".
- **Copy** (`grid-column:5/span 4`):
  - Eyebrow, mono `11px` uppercase letter-spacing `.22em`, color `rgba(19,50,64,.6)`, margin-bottom `22px`: **"The product this becomes"**
  - `<h2>` **"Table Eggs"** — `clamp(28px,3.2vw,46px)`, weight 700, `line-height:1.02`, `letter-spacing:-.03em`.
  - Paragraph, `18px`, `line-height:1.65`, color `rgba(19,50,64,.72)`, `max-width:38ch`: **"Every tray starts with a chick that drank in its first hour. Sold by the thirty-piece tray, collected daily."**
- **CTAs** (`grid-column:10/span 3`), flex column `gap:14px`:
  - Primary: `href="Order-Flow.dc.html"`, filled `background:#133240`, `color:#f5f0e8`, padding `22px 26px`, `17px` weight 600: **"Order Table Eggs →"**
  - Secondary: `href="Table-Eggs.dc.html"`, outlined `border:1px solid rgba(19,50,64,.35)`, same padding/size: **"Full dossier →"**

This is an article→product bridge pattern: every article template ends by tying its subject matter back to a specific purchasable product (here, table eggs, since the chick-rearing article is framed as "every tray starts with a chick that drank in its first hour"). Expect this block's product/image/copy to change per-article based on which product category the article belongs to (Chick Journey and Growth & Care articles likely point to Table Eggs; Product Excellence articles about manure would presumably point to the manure product instead — not confirmed in this file, inferred from the pattern's evident purpose).

### 2.14 Article-page JS behavior summary

Single `componentDidMount`/`componentWillUnmount` pair:
- Attaches a `passive` scroll listener that recomputes `#nn-progress` bar width as a percentage of `scrollY / (scrollHeight - innerHeight)`.
- Calls the handler once immediately on mount so the bar is correct before any scroll happens.
- Cleans up the listener on unmount.
- No IntersectionObserver / reveal-on-scroll logic in this file (unlike the hub page) — nothing on the article page fades in on scroll; the hero image's only entrance animation is the CSS `nn-hero-settle` keyframe on load (§2.5), not a scroll-triggered reveal.

---

## 3. Open questions / gaps for implementation

1. **`authorNote` callout has no rendered example anywhere in the two source files.** Only `farmerTip` is demonstrated. Confirm with the CMS/content schema whether `authorNote` is a real distinct field or whether "farmer's tip" is the only callout type that actually exists in production content.
2. **All article links in both files point to the same placeholder `Article.dc.html`** — real per-article slugs/routes are not defined in the prototype and will need to be assigned.
3. **The hub page states "Seven notes · three sections"** but only 6 items live inside the filterable grid; the featured article is the 7th and sits outside the filter system (no `data-cat`). Confirm whether the featured slot should also carry a category tag for future filtering, or is intentionally always-shown regardless of filter state.
4. **Product cross-sell block's product/image likely varies per article/category** — only the Table Eggs variant is shown here (attached to a Chick Journey article). No Product Excellence (e.g., manure) or general Growth & Care variant is demonstrated.
5. **`data-mask` attribute** on the two-image duo figure (§2.10) has no corresponding CSS/behavior visible in either file — likely defined in the external `motion.js` (not read as part of this extraction) or the shared component chrome; flag for the implementer to check `motion.js`/`support.js` if this attribute needs to do something.
