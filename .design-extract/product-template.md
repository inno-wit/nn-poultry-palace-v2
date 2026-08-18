# Product Page Template — Extraction Document

Source prototype files (exact pixel-level spec, static `.dc.html`, inline styles):
- `C:\Users\fredd\Projects\Websites\nnpoutry\Table-Eggs.dc.html`
- `C:\Users\fredd\Projects\Websites\nnpoutry\Poultry-Manure.dc.html`
- `C:\Users\fredd\Projects\Websites\nnpoutry\Ex-Layer-Hens.dc.html`

Cross-referenced against the documented component library:
- `C:\Users\fredd\Projects\Websites\nnpoutry\Design-System.dc.html` (section "07 / Patterns": Product metadata table, FAQ row, Product gallery, Pull quote & breadcrumb, Testimonial)

All three product pages share **one layout template**. Every difference between the three files has been isolated into Part 2. Anything not explicitly present in the HTML (no prices, no phone numbers, no invented facts) has been deliberately omitted — build against this document only, do not infer or add content.

---

## PART 1 — Shared Template Structure

### 1.0 Global page chrome (identical in all three files)

- `<dc-import name="SiteHeader" variant="solid" active="Products" hint-size="100%,85px">` — fixed/solid header, "Products" nav item marked active.
- `<dc-import name="SiteFooter" hint-size="100%,420px">` at the very end, after the cross-sell section.
- Google Fonts: `Outfit` (weights 300;400;500;600;700;800) + `IBM Plex Mono` (weights 400;500;600), loaded via `preconnect` + stylesheet link.
- `body { font-family: 'Made Tommy', 'Outfit', system-ui, sans-serif; }` — **Made Tommy is the intended brand display/body face but is NOT committed as a webfont file** (per Design-System.dc.html's closing note: `public/fonts/made-tommy/` contains only a README, no `.woff2`). The prototype renders using Outfit as a geometric stand-in. Real build should either license/add Made Tommy or intentionally keep the Outfit fallback — this is a known gap, not an oversight to silently "fix" by picking a different font.
- `html, body { background: #f5f0e8; }` (cream), `body { color: #133240; }` (dark navy/ink), `-webkit-font-smoothing: antialiased`.
- `* { box-sizing: border-box; }`
- `a { color: inherit; text-decoration: none; } a:hover { color: #c0613b; }` (terracotta hover on all plain links, global, not product-accent-driven).
- `img { display: block; }`

### 1.1 Global animation/interaction primitives (shared CSS, identical across all three)

```css
@keyframes nn-blink { 0%, 60% { opacity: 1; } 85%, 100% { opacity: .2; } }  /* live-status dot pulse */
.nn-zoom { overflow: hidden; }
.nn-zoom img { transition: transform 1.3s cubic-bezier(.22,1,.36,1); }
.nn-zoom:hover img { transform: scale(1.06); }                              /* image hover zoom, 1.06x / 1.3s — NOTE: 1.3s here vs 1.2s documented in Design-System's .nn-hoverzoom; treat 1.3s as the product-page value */

.nn-arrow span.nn-a { transition: transform .45s cubic-bezier(.22,1,.36,1); display: inline-block; }
.nn-arrow:hover span.nn-a { transform: translateX(7px); }                   /* CTA arrow drift on hover, 7px / .45s */

.nn-navlink { position: relative; }
.nn-navlink::after { content: ''; position: absolute; left: 0; bottom: -6px; height: 1px; width: 0; background: currentColor; transition: width .45s cubic-bezier(.22,1,.36,1); }
.nn-navlink:hover::after { width: 100%; }

.nn-menu-link { transition: color .3s, padding-left .5s cubic-bezier(.22,1,.36,1); }
.nn-menu-link:hover { padding-left: 12px; }

details summary { list-style: none; cursor: pointer; }
details summary::-webkit-details-marker { display: none; }
details .nn-plus { transition: transform .45s cubic-bezier(.22,1,.36,1); display: inline-block; }
details[open] .nn-plus { transform: rotate(45deg); }                        /* FAQ + becomes x on open */
details .nn-ans { animation: nn-open .5s cubic-bezier(.22,1,.36,1) both; }
@keyframes nn-open { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: none; } }

.nn-thumb { opacity: .55; transition: opacity .4s; cursor: pointer; }
.nn-thumb:hover, .nn-thumb[data-on="1"] { opacity: 1; }                     /* inactive gallery thumbs at 55% opacity */
```

**Single easing curve for everything: `cubic-bezier(.22, 1, .36, 1)`.** Nothing bounces. This is stated as a hard rule in Design-System.dc.html section 06.

Responsive breakpoint (max-width: 900px): all 12-column and gallery/process grids collapse to `1fr`, and all explicit `grid-column` placements reset to `auto`. **Inconsistency in the prototype**: Table-Eggs.dc.html's media query only resets `repeat(12, 1fr)` and `repeat(3, 1fr)`; Poultry-Manure.dc.html and Ex-Layer-Hens.dc.html additionally reset `repeat(5, 1fr)` (the 5-column process strip). Table-Eggs is missing that selector, meaning its process strip would NOT collapse to 1 column under 900px in the literal prototype. Treat this as a prototype bug to fix uniformly in the real build (all three should collapse the process strip on mobile) rather than a spec to replicate.

### 1.2 Scroll-reveal behavior (identical `<script type="text/x-dc" data-dc-script>` logic in all three, minor per-page variation only in the gallery swap logic — see 1.4)

Every section marked `data-reveal=""` is animated on scroll into view:
- On mount, an `IntersectionObserver` (`rootMargin: '0px 0px -10% 0px'`) is set up.
- An `arm()` function finds all `[data-reveal]:not([data-armed])`, marks them armed, and sets initial state: `opacity: 0; transform: translateY(28px);` with `transition: opacity 1s cubic-bezier(.22,1,.36,1), transform 1s cubic-bezier(.22,1,.36,1);`, then observes them.
- `arm()` runs immediately and then every 400ms via `setInterval` (to catch any late-mounted content), stopped after 5000ms via `setTimeout(() => clearInterval(...), 5000)`.
- When an observed element intersects, it's set to `opacity: 1; transform: none;` and unobserved.
- Net effect: sections rise 28px and fade in as the user scrolls, once, non-repeating.

Sections marked `data-mask=""` (the full-bleed banner) do NOT get this reveal treatment — they render immediately and rely only on `.nn-zoom` hover.

### 1.3 Section order (identical across all three pages, top to bottom)

1. SiteHeader import
2. Breadcrumb bar
3. Hero (product intro + metadata table + gallery)
4. Section "01 / What it is" — dark band
5. Section "02 / Why customers stay" (label wording varies — see Part 2) — testimonial/statement rows
6. Full-bleed mask/banner image with caption overlay
7. Section "03 / How we handle it" — 5-step process strip
8. Section "04 / Details" + "05 / Who it's for" — combined two-column section
9. Section "06 / Questions" — FAQ accordion
10. Section "07 / Order" — dark CTA band
11. "Also from the farm" cross-sell (links to the other two products)
12. SiteFooter import

No section is reordered, omitted, or duplicated between the three pages — this is a genuinely fixed template.

### 1.4 Section-by-section structure

#### Breadcrumb bar
```
<div style="background:#f5f0e8; padding:22px clamp(20px,4vw,56px) 0;">
  <div style="max-width:1600px; margin:0 auto; font-family:'IBM Plex Mono',monospace; font-size:10px; letter-spacing:.2em; text-transform:uppercase; color:rgba(19,50,64,.45); display:flex; gap:12px;">
    Home / Products / [Current Product Name, color:#133240]
  </div>
</div>
```
Links: `Home.dc.html`, `Products.dc.html`. Slashes are plain `<span>/</span>` separators. Current page name is NOT a link, rendered at full ink color while the rest sits at 45% opacity.

#### Hero
Outer section: `padding: clamp(40px,6vw,80px) clamp(20px,4vw,56px) clamp(56px,7vw,100px);` bg `#f5f0e8`.
Inner: `max-width:1600px; margin:0 auto; display:grid; grid-template-columns:repeat(12,1fr); gap:clamp(28px,4vw,64px);`

**Left column** `grid-column: 1 / span 5`:
1. Eyebrow row: `display:flex; align-items:center; gap:14px; margin-bottom:30px;` — accent-colored rule (`width:34px; height:3px; background:[accent]`) + mono label `font-size:11px; letter-spacing:.24em; text-transform:uppercase; color:rgba(19,50,64,.55)` reading "Product / 0N".
2. `<h1>`: two-line product name via `<br/>`, `font-size:clamp(44px,6.4vw,96px); font-weight:800; line-height:.88; letter-spacing:-.038em; margin:0 0 26px;`
3. Subhead `<p>`: `font-size:clamp(19px,1.5vw,23px); line-height:1.55; color:rgba(19,50,64,.7); max-width:40ch; text-wrap:pretty; margin:0 0 40px;`
4. **Product metadata table** (see 1.5 for the reusable pattern) — always exactly 5 rows, `margin-bottom:36px`.
5. Availability status row: `display:flex; align-items:center; gap:10px; margin-bottom:24px;` — pulsing dot (`width:8px; height:8px; border-radius:50%; background:#4ade80; animation: nn-blink 2.4s ease-in-out infinite;`) + mono status text `font-size:11px; letter-spacing:.16em; text-transform:uppercase; color:rgba(19,50,64,.65);`
6. CTA row: `display:flex; gap:14px; flex-wrap:wrap;`
   - Primary CTA: `class="nn-arrow"`, `display:inline-flex; align-items:center; gap:14px; background:#f59268; color:#133240; padding:20px 32px; font-size:17px; font-weight:600;` → `href="Order-Flow.dc.html"`. Label text is per-product (see Part 2).
   - Secondary CTA: same `nn-arrow` shape, `border:1px solid rgba(19,50,64,.3); color:#133240;` (no fill) → `href="Contact.dc.html"`. Label text per-product.
   - Both end with `<span class="nn-a">→</span>` that drifts 7px on hover.

**Right column** `grid-column: 7 / span 6`:
1. **Main stage**: `class="nn-zoom" id="nn-stage"`, `position:relative; aspect-ratio:4/3; background:#133240;` containing `<img id="nn-stage-img">` at `width:100%; height:100%; object-fit:cover;`.
2. **Thumbnail row**: `display:grid; grid-template-columns:repeat(3,1fr); gap:12px; margin-top:12px;` — exactly 3 thumbs, each `class="nn-thumb"`, `aspect-ratio:4/3;`. First thumb carries `data-on="1"`. Each has `data-src="[path]"`. First two thumbs sit on `background:#133240` (dark) with `object-fit:cover`; the third thumb is always the normalized product cut-out PNG (`public/norm/...`), sitting on the product's accent background color with `display:flex; align-items:center; justify-content:center; padding:8%;` and `object-fit:contain`.
3. Caption: `font-family:'IBM Plex Mono',monospace; font-size:10px; letter-spacing:.16em; text-transform:uppercase; color:rgba(19,50,64,.45); margin-top:14px;` — literal text **"Product gallery — click to change the frame"** on all three pages, verbatim, unchanged.

**Gallery interaction script** (per-page, functionally identical pattern, only the "is this the cutout thumb" test differs):
- 300ms after mount, attaches a click handler to each `.nn-thumb`.
- On click: fades stage image out (`opacity:0`), after 260ms swaps `stage.src` to the thumb's `data-src`, sets `stage.style.objectFit` to `contain` if the src is the cutout PNG else `cover`, sets the stage's background to the product's accent color if cutout else `#133240`, fades back in. Toggles `data-on="1"` onto the clicked thumb only.
- Cutout-detection test per page (this is the ONLY functional difference in the gallery script):
  - Table Eggs: `src.endsWith('egg.png')`
  - Poultry Manure: `src.indexOf('manure-bags') !== -1`
  - Ex-Layer Hens: `src.indexOf('ex-layer-hen') !== -1`
- In a real componentized build this generalizes to: "the gallery's 3rd/cutout image is flagged in the product's own image data, not detected by string matching" — i.e. model each gallery image as `{ src, alt, isCutout: boolean }` rather than porting the string-matching hack.

#### Section "01 / What it is"
`data-reveal=""`, `background:#133240; color:#f5f0e8; padding:clamp(70px,9vw,130px) clamp(20px,4vw,56px);`
Inner grid `repeat(12,1fr)` gap 32px:
- `grid-column:1/span2`: eyebrow mono `font-size:11px; letter-spacing:.2em; text-transform:uppercase; color:[accent]` reading "01 / What it is" (literal on all three).
- `grid-column:3/span7`:
  - `<h2>`: `font-size:clamp(30px,3.8vw,56px); font-weight:700; line-height:1.02; letter-spacing:-.03em; text-wrap:pretty; margin:0 0 30px;`
  - Exactly 2 `<p>` paragraphs: `font-size:19px; line-height:1.7; color:rgba(245,240,232,.66); max-width:56ch; text-wrap:pretty;`. First has `margin:0 0 20px;`, second has `margin:0;`.

#### Section "02 / Why customers stay" (label wording differs — see Part 2)
`data-reveal=""`. Background differs per product (see Part 2 — plain cream for eggs, faint accent tint for manure/hens). `padding:clamp(70px,9vw,130px) clamp(20px,4vw,56px);`
Header row: grid `repeat(12,1fr)` gap 32, `margin-bottom:clamp(40px,5vw,70px);`
- `grid-column:1/span2`: eyebrow mono, `color:rgba(19,50,64,.45)`, "02 / [label]".
- `grid-column:3/span6` (as `<h2>` directly, not a wrapping div): `font-size:clamp(30px,3.8vw,56px); font-weight:700; line-height:1.02; letter-spacing:-.03em; margin:0;`

Body: `border-top:1px solid rgba(19,50,64,.2);` wrapping exactly **3 rows**. Each row: `display:grid; grid-template-columns:repeat(12,1fr); gap:32px; padding:40px 0; border-bottom:1px solid rgba(19,50,64,.16); align-items:start;`
- `grid-column:1/span2`: mono row number ("01"/"02"/"03"), `font-size:11px; letter-spacing:.18em; color:[accent];`
- `grid-column:3/span4`: statement/title, `font-size:clamp(24px,2.4vw,34px); font-weight:600; letter-spacing:-.02em; line-height:1.1;`
- `grid-column:8/span5`: body copy, `font-size:17px; line-height:1.75; color:rgba(19,50,64,.7);`. **Some rows are testimonials** (body text wrapped in curly quotes, followed by an attribution line: `font-family:'IBM Plex Mono',monospace; font-size:11px; letter-spacing:.16em; text-transform:uppercase; color:rgba(19,50,64,.5); margin-top:14px;` reading "Name · Location · Role/Type"), **other rows are plain assertions** with no quote marks and no attribution. This is NOT uniform per page — see Part 2 for exactly which rows are quoted per product. Model each row as `{ number, title, body, isQuote: boolean, attribution?: string }`.

#### Full-bleed mask banner
NOT wrapped in `data-reveal`. `data-mask=""` `class="nn-zoom"`, `position:relative; height:clamp(340px,50vw,620px); background:#133240;`
- Full-bleed `<img>` at `width:100%; height:100%; object-fit:cover;` (zooms 1.06x on hover via `.nn-zoom`).
- Overlay caption box: `position:absolute; left:clamp(20px,4vw,56px); bottom:clamp(20px,4vw,44px); background:rgba(19,50,64,.9); padding:18px 24px; max-width:400px;`
  - Eyebrow: `font-size:10px; letter-spacing:.2em; text-transform:uppercase; color:[accent]; margin-bottom:8px;` — label text differs per product (see Part 2).
  - Body: `font-size:15px; line-height:1.6; color:rgba(245,240,232,.78);`

#### Section "03 / How we handle it"
`data-reveal=""`, `background:#f5f0e8; padding:clamp(70px,9vw,130px) clamp(20px,4vw,56px);`
Header row: identical structure to section 02's header (grid12, col1/2 eyebrow "03 / How we handle it" literal on all three, col3/span6 `<h2>` same type spec).
Process strip: `display:grid; grid-template-columns:repeat(5,1fr); border-top:1px solid rgba(19,50,64,.2);` — exactly **5 steps**.
- Cells 1–4: `border-right:1px solid rgba(19,50,64,.16);` Cell 1 padding `30px 20px 34px 0` (no left padding, flush to grid edge); cells 2–4 padding `30px 20px 34px`; cell 5 padding `30px 0 34px 20px` (no right padding, flush, no border-right).
- Per cell: step number mono `font-size:11px; letter-spacing:.2em; color:[step-number-color]; margin-bottom:18px;`, step title `font-size:22px; font-weight:600; letter-spacing:-.015em; margin-bottom:12px;`, step description `font-size:15px; line-height:1.65; color:rgba(19,50,64,.65);`.
- **Step-number color quirk**: Poultry Manure uses its accent sage `#7a9e7e`; Ex-Layer Hens uses its accent terracotta `#c0613b`; but Table Eggs uses **`#d4a847` (straw)**, NOT its `#eccc74` gold accent. This is a real, deliberate difference in the source HTML (confirmed byte-for-byte), not a typo to silently "correct" — the design system's palette doc lists `#d4a847` as a distinct "Straw / Support" swatch, separate from "N&N Gold / #eccc74". Preserve this per-product override rather than assuming step-number color always equals accent color.

#### Section "04 / Details" + "05 / Who it's for"
`data-reveal=""`, `background:#f5f0e8; padding:0 clamp(20px,4vw,56px) clamp(70px,9vw,130px);` (no top padding — sits directly under the process strip section). Grid `repeat(12,1fr)` gap `clamp(28px,4vw,64px)`.
- `grid-column:1/span2`: eyebrow "04 / Details" (literal, all three), `color:rgba(19,50,64,.45)`.
- `grid-column:3/span5` — **Details column**:
  - `<h2>`: `font-size:clamp(26px,2.6vw,38px); font-weight:600; letter-spacing:-.02em; line-height:1.1; margin:0 0 30px;` — text differs per product (see Part 2).
  - `<ul>` (no list-style, `border-top:1px solid rgba(19,50,64,.16);`), exactly **5 `<li>`** items. Each: `padding:16px 0; border-bottom:1px solid rgba(19,50,64,.16); font-size:17px; line-height:1.6; display:flex; gap:16px;` with a leading mono em-dash `—` marker (`font-size:11px; color:[accent]; padding-top:4px;`) then the item text.
- `grid-column:9/span4` — **"Who it's for" column**:
  - `<h2>` (same type spec as Details `<h2>`, but content is literally **"05 / Who it's for"**, i.e. the section number is baked into this sub-heading rather than living in a separate eyebrow slot).
  - `display:flex; flex-direction:column; gap:2px;` — exactly **3 rows**, each `padding:22px 24px;` with a decreasing-opacity tint of the accent color as background (solid 100% / ~45% / ~20–22%, exact per-product values in Part 2). Row content: title `font-size:19px; font-weight:600;` + subtitle `font-family:'IBM Plex Mono',monospace; font-size:11px; letter-spacing:.14em; text-transform:uppercase; color:rgba(19,50,64,.6); margin-top:6px;`.
  - **Text-color override**: on Ex-Layer Hens only, the first (100%-opacity) row's background is the full-saturation terracotta `#c0613b`, which is too dark for the default ink text — that row explicitly sets `color:#f5f0e8` on the title and `color:rgba(245,240,232,.75)` on the subtitle. Eggs' and Manure's equivalent full-opacity rows (`#eccc74` gold, `#7a9e7e` sage) do NOT need this override — they stay on default dark-ink text because those two accent colors are light enough. Do not blanket-apply white text to all "who it's for" rows; only apply it where the background is dark enough (i.e., make this a per-swatch contrast decision, not a fixed rule).

#### Section "06 / Questions" (FAQ)
`data-reveal=""`, `background:#f5f0e8; padding:0 clamp(20px,4vw,56px) clamp(70px,9vw,130px);` (no top padding). Grid `repeat(12,1fr)` gap 32.
- `grid-column:1/span2`: eyebrow "06 / Questions" (literal, all three).
- `grid-column:3/span8`, `border-top:1px solid rgba(19,50,64,.2);` — a `<details>` per FAQ (count varies: 4 for eggs, 3 for manure, 3 for hens), each `border-bottom:1px solid rgba(19,50,64,.16);`.
  - `<summary>`: `display:flex; justify-content:space-between; gap:32px; align-items:baseline; padding:30px 0;` — question `font-size:clamp(21px,2.1vw,30px); font-weight:600; letter-spacing:-.02em;` + `<span class="nn-plus">` `font-size:26px; font-weight:300; color:#c0613b;` (literal `+`, 45°-rotates open via CSS).
  - **Plus-icon color is always `#c0613b` terracotta on all three pages, regardless of product accent.** This is the one FAQ-chrome element that is NOT accent-driven — confirmed identical across Table Eggs, Poultry Manure, and Ex-Layer Hens source. Do not theme it per product.
  - `<p class="nn-ans">`: `margin:0 0 30px; font-size:18px; line-height:1.7; color:rgba(19,50,64,.68); max-width:56ch;`

#### Section "07 / Order" (closing CTA band)
`data-reveal=""`, `background:#133240; color:#f5f0e8; padding:clamp(80px,11vw,170px) clamp(20px,4vw,56px);` Grid `repeat(12,1fr)` gap 32, `align-items:end;`
- `grid-column:1/span7`:
  - Eyebrow: "07 / Order" (literal), mono `font-size:11px; letter-spacing:.22em; text-transform:uppercase; color:[accent]; margin-bottom:30px;`
  - `<h2>`: two-line via `<br/>`, `font-size:clamp(38px,5.6vw,88px); font-weight:800; line-height:.92; letter-spacing:-.038em; margin:0 0 28px;` — text per product.
  - `<p>`: `font-size:20px; line-height:1.6; color:rgba(245,240,232,.65); max-width:44ch; text-wrap:pretty; margin:0;` — text per product.
- `grid-column:9/span4`, `display:flex; flex-direction:column; gap:16px;`
  - Primary CTA: `class="nn-arrow"`, `display:flex; align-items:center; justify-content:space-between; background:#f59268; color:#133240; padding:24px 28px; font-size:18px; font-weight:600;` → `href="Order-Flow.dc.html"`. Same label text as the hero's primary CTA (repeated verbatim).
  - Secondary CTA: same shape, `border:1px solid rgba(245,240,232,.3); color:#f5f0e8;` → `href="Products.dc.html"`, label **"See all products →"** literal, identical on all three pages.

#### "Also from the farm" cross-sell
`data-reveal=""`, `background:#f5f0e8; padding:clamp(60px,8vw,110px) clamp(20px,4vw,56px);`
- Label row: mono `font-size:11px; letter-spacing:.2em; text-transform:uppercase; color:rgba(19,50,64,.45); padding-bottom:20px; border-bottom:1px solid rgba(19,50,64,.2); margin-bottom:40px;` — literal text **"Also from the farm"** on all three pages.
- `display:grid; grid-template-columns:repeat(2,1fr); gap:clamp(20px,3vw,40px);` — exactly the **other two products** (never the current product), each an `<a class="nn-zoom">` card:
  - Image: `aspect-ratio:16/9; overflow:hidden; background:#133240;` `<img object-fit:cover>`.
  - Tick + label row: `display:flex; align-items:center; gap:12px; margin:18px 0 8px;` — accent-colored tick (`width:22px; height:2px; background:[that product's accent]`) + mono label `font-size:10px; letter-spacing:.18em; text-transform:uppercase; color:rgba(19,50,64,.5);` reading "0N / Product Name".
  - Title: `font-size:clamp(22px,2.2vw,30px); font-weight:600; letter-spacing:-.02em;`
- **Each product's cross-sell card content (image, tick color, number/name label, title line) is identical no matter which page links to it** — i.e. this is data that belongs to the target product itself, not to the linking page. See Part 2 "Cross-sell teaser" fields per product; the real build should read these off the target product's own record rather than duplicating strings on every linking page.

### 1.5 Reusable component patterns (per Design-System.dc.html §07)

**Product metadata table** — "Label 50% ink, value full ink, right-aligned. 24px minimum gap, hairline between rows."
```
<div style="border-top:1px solid rgba(19,50,64,.2);">
  <div style="display:flex; justify-content:space-between; gap:24px; padding:14px 0; border-bottom:1px solid rgba(19,50,64,.14); font-family:'IBM Plex Mono',monospace; font-size:11px; letter-spacing:.14em; text-transform:uppercase; text-align:right;">
    <span style="color:rgba(19,50,64,.5);">[Label]</span><span>[Value]</span>
  </div>
  <!-- repeated, last row still gets border-bottom in the actual product pages (unlike the 3-row system-doc excerpt which drops it on the last) -->
</div>
```
Row count and row labels are NOT fixed across products — each product defines its own 5 label/value pairs (see Part 2). Model as an array of `{ label, value }`, not fixed named fields.

**FAQ row** — native `<details>/<summary>`, no card, no fill, no chevron, plus rotates 45° to indicate open.

**Product gallery** — main stage `aspect-ratio:4/3` over `#133240`, 3-thumb strip below at `repeat(3,1fr)` gap `10–12px`, inactive thumbs at 55% opacity, cut-outs sit on the product accent color, photographic thumbs sit on N&N dark `#133240`.

**Breadcrumb** pattern matches Design-System's "Pull quote & breadcrumb" component exactly: mono, 10px, `.2em` tracking, uppercase, 45%-opacity trail with full-ink current page.

**Testimonial** pattern (Design-System §07): "One dominant quote per page, set large... Never a carousel of equal cards." The product pages' "02 / Why customers stay" rows are a variant of this at smaller scale (17px vs the system doc's 24–34px hero quote), reused 1–3 times per page as noted above.

### 1.6 Cut-out image normalization (applies to every product's 3rd gallery thumb + any cut-out PNG use)

Per Design-System.dc.html §04: all transparent product PNGs are served from `public/norm/` (pre-normalized presentation copies; originals untouched elsewhere). Never place a raw cut-out in a frame. Frame padding for these is 10% in general product frames, 8% specifically in the gallery thumb/stage context (confirmed in all three product pages' inline styles: `padding:8%` on the cutout thumb and stage backgrounds).

---

## PART 2 — Per-Product Data

### 2.0 Quick-reference table

| Field | Table Eggs | Poultry Manure | Ex-Layer Hens |
|---|---|---|---|
| Accent color | `#eccc74` (gold) | `#7a9e7e` (sage) | `#c0613b` (terracotta) |
| Product number | 01 | 02 | 03 |
| Slug / file | `Table-Eggs.dc.html` | `Poultry-Manure.dc.html` | `Ex-Layer-Hens.dc.html` |
| Breadcrumb current label | Table Eggs | Poultry Manure | Ex-Layer Hens |
| H1 (verbatim, `<br/>` shown as `/`) | Table / Eggs | Poultry / Manure | Ex-Layer / Hens |
| §02 heading label | Why customers stay | Why customers stay | Why buyers choose them |
| §02 background | `#f5f0e8` (plain, untinted) | `rgba(122,158,126,.1)` | `rgba(192,97,59,.08)` |
| Process-strip step-number color | `#d4a847` (straw — NOT accent) | `#7a9e7e` (= accent) | `#c0613b` (= accent) |
| FAQ count | 4 | 3 | 3 |
| Hero primary CTA label | Order Table Eggs → | Order Manure → | Enquire on Hens → |
| Hero secondary CTA label | Ask about bulk → | Ask about truck loads → | Ask about bulk lots → |
| §07 primary CTA label | Order Table Eggs → | Order Manure → | Enquire on Hens → |
| §04 details heading | What's in the tray | What's in the sack | What you're buying |

### 2.1 Table Eggs

**Meta**
- Accent: `#eccc74`
- Breadcrumb current: "Table Eggs"
- Eyebrow: "Product / 01"
- H1: `Table<br />Eggs`
- Subhead: "Collected from the farm, delivered the same day. Sold by the thirty-piece tray — ideal for home cooks and food businesses alike."

**Metadata table** (order matters):
| Label | Value |
|---|---|
| Format | 30pc tray · bulk case |
| Collection | Daily, from 2 PM |
| Grade | Mixed — large & medium |
| Best for | Households · Bakeries · Kiosks |
| Farm to door | 24–48 hours |

**Availability status**: "Available — next dispatch tomorrow, 08:00"

**Hero CTAs**: Primary "Order Table Eggs →" → `Order-Flow.dc.html`. Secondary "Ask about bulk →" → `Contact.dc.html`.

**Gallery**
- Stage: `public/eggs.jpeg`, alt "Fresh N&N table eggs"
- Thumb 1 (active by default): `public/eggs.jpeg`, alt "Trays of eggs", bg `#133240`
- Thumb 2: `public/assets/education/grading of eggs.jpeg`, alt "Grading and stacking trays", bg `#133240`
- Thumb 3 (cutout): `public/norm/egg.png`, alt "A single egg", bg `#eccc74`, `object-fit:contain`

**§01 "What it is"**
- H2: "Our most-asked-for product, and the reason most people find us."
- P1: "Collected daily from our layer hens, each egg goes through inspection for shell integrity and size consistency. We hold a high-frequency delivery schedule so a tray reaches you within 24 to 48 hours of laying."
- P2: "Trays are mixed grade — large and medium together — which is what most kitchens actually want. Yesterday's collection is sold in the local market the same day rather than held over."

**§02 "Why customers stay"** — H2: "Three reasons, in their words." (all 3 rows are testimonials, quoted + attributed)

| # | Title | Body (verbatim, incl. quote marks) | Attribution |
|---|---|---|---|
| 01 | Freshness you can see in the yolk | "I've been buying from N&N for over eight months and the eggs are consistently fresh. The yolks are bright and rich — you can really taste the difference." | Wanjiru M. · Syokimau · Household |
| 02 | No rejected batches | "We switched our restaurant supply to N&N six months ago. Wholesale pricing is fair, invoicing is professional, and I have never had a rejected batch." | Chef Kamau J. · Machakos Town · Restaurant |
| 03 | Ordering takes one message | "WhatsApp ordering is super convenient, and they even remind me before I run low. This is the kind of supplier every small business needs." | Amina S. · Athi River · Breakfast kiosk |

(Curly quotes `“ ”` used in source; shown here as straight quotes for markdown safety — use curly in code.)

**Mask banner**: image `public/assets/education/layer-hens.jpeg`, alt "The layer house". Overlay eyebrow: "Where the tray starts". Overlay body: "High-calcium layer mash, a managed lighting schedule, and three collections a day at peak production."

**§03 "How we handle it"** — H2: "From nest box to your door."

| # | Title | Body |
|---|---|---|
| 01 | Care | Morning walk-through, ventilation checked, water intake logged. |
| 02 | Collect | Three times daily at peak — frequency is what keeps shells intact. |
| 03 | Grade | Two until four. Cracks, size and shell quality checked by hand. |
| 04 | Pack | Sealed into 30pc trays by five, marked with the collection day. |
| 05 | Deliver | On the morning route, Mon–Sat, across six zones of the county. |

(Step-number color: `#d4a847`, not the `#eccc74` accent — see Part 1 note.)

**§04 Details — "What's in the tray"** (bullets, dash color `#eccc74`):
- Daily collection for maximum freshness
- Sizes: mixed grade, large and medium
- Hygienically handled and packed
- Available in 30pc egg trays
- Bulk cases for commercial buyers

**§05 "Who it's for"** (heading text is literally "05 / Who it's for"):
| Row bg | Title | Subtitle |
|---|---|---|
| `#eccc74` (solid) | Households | One tray, on the morning route |
| `rgba(236,204,116,.45)` | Bakeries & restaurants | Standing orders, bulk cases |
| `rgba(236,204,116,.22)` | Kiosks & resellers | Reminders before you run low |

(No text-color override needed — default dark ink works on all three rows here.)

**§06 FAQ** (4 items):
1. Q: "Do you deliver on weekends?" — A: "We deliver Monday to Saturday. Saturday slots fill quickly — message early in the week to hold one."
2. Q: "What if an egg breaks in transit?" — A: "At the time of delivery, any breakage is replaced. The standard is ours to hold, not yours to absorb."
3. Q: "Can I order less than a tray?" — A: "Our minimum is one 30pc tray. For smaller quantities, ask us — we may have loose stock on the day."
4. Q: "Which areas do you deliver to?" — A: "Machakos Town, Syokimau, Athi River, Mlolongo, Katoloni and Mwala, daily. If you are nearby, ask — we may be able to arrange it."

**§07 "Order"**
- Eyebrow: "07 / Order"
- H2: `One tray or twenty.<br />Same care.`
- Body: "Tell us the quantity and where you are. We confirm the price and the next slot, usually within minutes."
- Primary CTA: "Order Table Eggs →" → `Order-Flow.dc.html`
- Secondary CTA: "See all products →" → `Products.dc.html`

**Cross-sell teaser (this product's own card, as shown on the OTHER two pages)**:
- Image: `public/eggs.jpeg`, alt "Table eggs"
- Tick color: `#eccc74`
- Label: "01 / Table Eggs"
- Title: "Fresh eggs, collected daily"

**This page's own cross-sell links to** (Poultry Manure and Ex-Layer Hens — see their sections below for the authoritative teaser content).

---

### 2.2 Poultry Manure

**Meta**
- Accent: `#7a9e7e`
- Breadcrumb current: "Poultry Manure"
- Eyebrow: "Product / 02"
- H1: `Poultry<br />Manure`
- Subhead: "Bagged organic fertilizer, nutrient-rich for gardens, farms and commercial agriculture. Available in bulk sacks for large-scale operations."

**Metadata table**:
| Label | Value |
|---|---|
| Format | 70kg sack · FH truck |
| Composition | Nitrogen · Phosphorus · Potassium |
| Treatment | Naturally sun-dried, nothing added |
| Coverage | ≈50–80 m² per sack |
| Collection | Pickup or bulk delivery |

**Availability status**: "Available — sacks ready at the farm"

**Hero CTAs**: Primary "Order Manure →" → `Order-Flow.dc.html`. Secondary "Ask about truck loads →" → `Contact.dc.html`.

**Gallery**
- Stage: `public/manure-hips.jpeg`, alt "Poultry manure drying at the farm"
- Thumb 1 (active by default): `public/manure-hips.jpeg`, alt "Manure heaps", bg `#133240`
- Thumb 2: `public/assets/education/poultry-manure.png`, alt "Manure applied to soil", bg `#133240`
- Thumb 3 (cutout): `public/norm/manure-bags.png`, alt "70kg sacks", bg `#7a9e7e`, `object-fit:contain`

**§01 "What it is"**
- H2: "A circular farm. What leaves the barn feeds the soil."
- P1: "Our organic poultry manure is a potent source of nitrogen, phosphorus and potassium — the nutrients that drive healthy plant growth and soil restoration. Unlike synthetic fertilizer it also adds organic matter, which improves water retention and feeds the microorganisms already in the ground."
- P2: "It comes out of our barns and goes into the sacks. Nothing added, nothing chemically treated, dried in the Machakos sun until it is ready."

**§02 "Why customers stay"** — H2: "Soil health, not just a yield bump." (only row 01 is a quoted testimonial; rows 02–03 are plain assertions, no quote marks, no attribution)

| # | Title | Body | Attribution |
|---|---|---|---|
| 01 | Visible results in one season | "I started using their poultry manure for my kitchen garden last season and the results are incredible. It's rich, well-composted, and significantly improved my soil health." | Sarah L. · Katoloni · Kitchen garden |
| 02 | Ready to apply on arrival | No curing period, no mixing, no waiting. The manure is naturally dried before bagging, so it can go straight into soil as a base dressing or a top dressing. | — (none) |
| 03 | A smaller chemical footprint | For growers moving away from synthetic inputs, this is a direct substitution that improves soil structure at the same time as it feeds the crop. | — (none) |

**Mask banner**: image `public/assets/education/poultry-manure.png`, alt "Manure worked into soil". Overlay eyebrow: "Farmer's tip". Overlay body: "Mix into the soil a week before planting, not the same day. Give the microbes time to activate it — you will see the difference in early growth."

**§03 "How we handle it"** — H2: "From barn floor to sack."

| # | Title | Body |
|---|---|---|
| 01 | Clear | Barns cleared on a cycle that keeps the houses clean and dry for the birds. |
| 02 | Heap | Laid out in the open to dry naturally rather than treated or accelerated. |
| 03 | Dry | The sun concentrates the nutrients and clears most pathogens. The smell tells you when it is ready. |
| 04 | Bag | Filled into 70kg sacks, or loaded loose for FH truck orders. |
| 05 | Move | Collected at the farm, or delivered in bulk by arrangement. |

(Step-number color: `#7a9e7e`, matches accent.)

**§04 Details — "What's in the sack"** (bullets, dash color `#7a9e7e`):
- Highly concentrated nutrient content
- Fully organic and sustainable
- Suitable for all crop types and soils
- Rich in nitrogen & phosphorus
- Available for pickup or bulk delivery

**§05 "Who it's for"**:
| Row bg | Title | Subtitle |
|---|---|---|
| `#7a9e7e` (solid) | Kitchen gardeners | One sack covers 50–80 m² |
| `rgba(122,158,126,.5)` | Commercial farmers | FH truck loads by arrangement |
| `rgba(122,158,126,.24)` | Smallholder farms | Collect from the farm |

(No text-color override needed.)

**§06 FAQ** (3 items):
1. Q: "Is it ready to use straight away?" — A: "Yes — our manure is naturally dried and can be applied directly to soil."
2. Q: "Can I get less than 70kg?" — A: "The standard sack is 70kg. Contact us for arrangements on smaller quantities."
3. Q: "How do I apply it to my garden?" — A: "Mix into soil before planting or apply as a top dressing. One sack covers roughly 50–80 square metres."

**§07 "Order"**
- Eyebrow: "07 / Order"
- H2: `A sack, or a<br />truck load.`
- Body: "Tell us the volume and whether you are collecting or need delivery, and we will price it and set a day."
- Primary CTA: "Order Manure →" → `Order-Flow.dc.html`
- Secondary CTA: "See all products →" → `Products.dc.html`

**Cross-sell teaser (this product's own card, as shown on the OTHER two pages)**:
- Image: `public/manure-hips.jpeg`, alt "Poultry manure"
- Tick color: `#7a9e7e`
- Label: "02 / Poultry Manure"
- Title: "What the barn gives the soil"

**This page's own cross-sell links to Table Eggs and Ex-Layer Hens** (see their sections for authoritative teaser content).

---

### 2.3 Ex-Layer Hens

**Meta**
- Accent: `#c0613b`
- Breadcrumb current: "Ex-Layer Hens"
- Eyebrow: "Product / 03"
- H1: `Ex-Layer<br />Hens`
- Subhead: "Healthy hens sold at the end of their laying cycle — suitable for meat use or re-homing. Raised with care, fed well, housed clean."

**Metadata table**:
| Label | Value |
|---|---|
| Format | Live bird · bulk lots |
| Age | 72–80 weeks |
| Health | Full vaccination programme |
| Best for | Caterers · Bulk buyers · Traditional cooking |
| Collection | At the farm, Machakos |

**Availability status**: "Available — current batch at end of cycle"

**Hero CTAs**: Primary "Enquire on Hens →" → `Order-Flow.dc.html`. Secondary "Ask about bulk lots →" → `Contact.dc.html`.

**Gallery**
- Stage: `public/layers.jpeg`, alt "Layer hens at the end of their cycle"
- Thumb 1 (active by default): `public/layers.jpeg`, alt "Layer hens", bg `#133240`
- Thumb 2: `public/assets/education/grown chicks-hens.jpeg`, alt "Grown hens in the house", bg `#133240`
- Thumb 3 (cutout): `public/norm/ex-layer-hen.png`, alt "An ex-layer hen", bg `#c0613b`, `object-fit:contain`

**§01 "What it is"**
- H2: "Birds that have done their work, offered honestly."
- P1: "Our ex-layer hens are offered at the end of their peak laying cycle. They are healthy, well-fed, and have been under regular veterinary supervision throughout their time on the farm."
- P2: "The meat is firmer than a broiler's — which is exactly why it is favoured for slow-cooked traditional dishes and soup bases. An affordable, high-quality source of lean poultry meat."

**§02 "Why buyers choose them"** — H2: "Known history, known health." (**all 3 rows are plain assertions — none are quoted/attributed testimonials**, unlike eggs which is 3-for-3 quoted and manure which is 1-for-3)

| # | Title | Body |
|---|---|---|
| 01 | You know where the bird has been | Every hen we sell was raised here from the brooder. Vaccination schedule, feed programme and veterinary oversight are all part of our own records — not a middleman's word. |
| 02 | Right for the pot it's going in | Tougher meat is a feature for slow cooking. Caterers and households cooking traditional dishes ask for these specifically, and they hold up to long braising in a way young birds do not. |
| 03 | Nothing on the farm is wasted | The flock produces eggs, the barn produces manure, and at the end of the cycle the birds themselves find a use. That is the whole reason a small farm can run sustainably. |

**Mask banner**: image `public/assets/education/grown chicks to hen.jpeg`, alt "Grown birds in the house". Overlay eyebrow: "A full cycle". Overlay body: "Day-old chick to end of lay is around eighty weeks. Every one of those weeks is logged in a notebook in the farm office."

**§03 "How we handle it"** — H2: "Eighty weeks of care."

| # | Title | Body |
|---|---|---|
| 01 | Brood | Arrive as day-olds, brooder at 32–35°C, electrolyte water from hour one. |
| 02 | Grow | Grower feed, steady weight gain, sample-weighed twice a week. |
| 03 | Vaccinate | A full programme under veterinary supervision, recorded per batch. |
| 04 | Lay | From week 18 to around week 80, on high-calcium layer mash. |
| 05 | Retire | Offered live at the farm for meat use or re-homing. |

(Step-number color: `#c0613b`, matches accent.)

**§04 Details — "What you're buying"** (bullets, dash color `#c0613b`):
- Regularly vaccinated and vet-inspected
- Raised on premium, balanced feed
- Tougher meat ideal for slow-cooked dishes
- Available for live purchase at the farm
- Bulk lots available for businesses

**§05 "Who it's for"**:
| Row bg | Text color override | Title | Subtitle |
|---|---|---|---|
| `#c0613b` (solid) | **Yes** — title `#f5f0e8`, subtitle `rgba(245,240,232,.75)` | Restaurants & caterers | Bulk lots, arranged ahead |
| `rgba(192,97,59,.45)` | No (default dark ink) | Bulk buyers | Speak to us about logistics |
| `rgba(192,97,59,.2)` | No (default dark ink) | Traditional cooking | Collect at the farm |

**§06 FAQ** (3 items):
1. Q: "What age are the hens?" — A: "Typically 72–80 weeks — the end of their laying cycle, and in good health."
2. Q: "Do you deliver live hens?" — A: "We primarily sell at the farm. Speak to us about bulk delivery logistics."
3. Q: "Are they vaccinated?" — A: "Yes — all our birds go through a full vaccination programme under veterinary supervision."

**§07 "Order"**
- Eyebrow: "07 / Order"
- H2: `Tell us how many,<br />and when.`
- Body: "Batches come to the end of lay on a schedule, so bulk lots are worth arranging ahead of time."
- Primary CTA: "Enquire on Hens →" → `Order-Flow.dc.html`
- Secondary CTA: "See all products →" → `Products.dc.html`

**Cross-sell teaser (this product's own card, as shown on the OTHER two pages)**:
- Image: `public/layers.jpeg`, alt "Ex-layer hens"
- Tick color: `#c0613b`
- Label: "03 / Ex-Layer Hens"
- Title: "The end of a good cycle"

**This page's own cross-sell links to Table Eggs and Poultry Manure** (see their sections for authoritative teaser content).

---

## Notes for implementation (not spec, just flags for the build)

1. **Data model shape implied by this extraction**: each product needs — accent color, number, slug, breadcrumb label, H1 (two lines), subhead, metadata rows (array of `{label, value}`, NOT fixed field names), availability text, hero CTA labels (+ shared hrefs `Order-Flow.dc.html` / `Contact.dc.html`), gallery (stage + exactly 3 thumbs, one flagged `isCutout`), "what it is" heading + 2 paragraphs, "why" section heading label + 3 rows (`{number, title, body, isQuote, attribution?}`) + section background tint, mask banner image + eyebrow + body, process steps (exactly 5, `{title, body}`, plus a step-number-color field since it does not always equal accent), details heading + 5 bullets, "who it's for" 3 rows (`{title, subtitle, bg, textOverride?}`), FAQ array (`{q, a}`, count varies 3–4), order-section H2 + body, and its own cross-sell teaser (image/tick/label/title) that the *other two* products' pages will read.
2. Two prototype inconsistencies found and flagged inline above (not to be silently "fixed" without a decision): (a) Table-Eggs' mobile media query is missing the `repeat(5,1fr)` reset that Manure/Hens have; (b) Table Eggs' process-strip step numbers use `#d4a847` (straw) instead of its own `#eccc74` accent, while Manure and Hens both use their own accent for the same element.
3. Made Tommy is referenced as the brand font everywhere but has no committed webfont file — confirm with Fredrick whether the real build should source it or intentionally ship the Outfit fallback.
