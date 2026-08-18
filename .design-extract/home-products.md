# Design Extraction — Home & Products

Source prototype files (exact spec, styled with inline `style=` attrs):
- `C:\Users\fredd\Projects\Websites\nnpoutry\Home.dc.html`
- `C:\Users\fredd\Projects\Websites\nnpoutry\Products.dc.html`
- Cross-referenced against `Design-System.dc.html` for named component patterns, color tokens, and the "three image roles" system.

This document is the sole reference for implementation. All copy is verbatim. All spacing/type values are exact from source. Do not paraphrase copy when coding.

---

## Global tokens (apply across both pages)

**Colors** (hex, matching brand tokens):
- `#133240` — N&N Dark (navy). Page grounds on dark sections, headers, type-on-cream.
- `#f5f0e8` — Cream. Editorial ground, article body background, light type on dark.
- `#eccc74` — Gold. Table Eggs product accent, status dots' "available" ticks are green not gold — gold is used for eyebrow rules, numerals, "gold tick" markers. NOT the same as the green status dot.
- `#f59268` — Orange. Primary CTA background only ("Order Fresh Eggs" style buttons). Used sparingly.
- `#8b5e3c` — Soil. Support color (not seen directly used in Home/Products body content, part of system palette).
- `#7a9e7e` — Sage. Poultry Manure product accent color.
- `#c0613b` — Terracotta. Ex-Layer Hens product accent color; also the global link-hover color (`a:hover { color: #c0613b; }`) and "Full dossier" / eyebrow link color.
- `#d4a847` — Straw. Support color, not directly used in these two pages' visible content.
- `#4ade80` — status green ("Available" / in-stock dot and text).
- `#ef4444` — status red (out-of-stock, not used on these two pages since everything shows Available).

**Fonts:**
- Display/heading/body: `'Made Tommy', 'Outfit', system-ui, sans-serif` (Made Tommy is the intended brand font; Outfit is the loaded Google Font fallback used in the prototype — weights 300/400/500/600/700/800).
- Mono (all eyebrows, labels, metadata, status text, captions): `'IBM Plex Mono', monospace` — weights 400/500/600.

**Global CSS behavior baked into the prototype (must be replicated in React/Tailwind):**
- `a { color: inherit; text-decoration: none; } a:hover { color: #c0613b; }`
- `img { display: block; }`
- `.nn-zoom` (Home) / `.nn-hoverzoom` (Design System) — wrapping `overflow:hidden` container; inner `img` has `transition: transform 1.3s cubic-bezier(.22,1,.36,1)`; on container hover, `img { transform: scale(1.06) }`.
- `.nn-arrow span.nn-a` — inline-block span (the "→" glyph) with `transition: transform .45s cubic-bezier(.22,1,.36,1)`; on `.nn-arrow:hover`, the span translates `translateX(7px)` (Home) — Design System doc uses 6px for the same pattern, Home.dc.html's own stylesheet defines 7px, use 7px since it's the page's own CSS.
- `.nn-navlink` — relative position; `::after` pseudo-element is a 1px underline, width 0 → 100% on hover, transition `.45s cubic-bezier(.22,1,.36,1)`, positioned `left:0; bottom:-6px`.
- `.nn-menu-link` — transitions `color .3s, padding-left .5s cubic-bezier(.22,1,.36,1)`; hover adds `padding-left: 12px`.
- `.nn-row` (Products page comparison table rows) — `transition: background .4s cubic-bezier(.22,1,.36,1)`; hover → `background: rgba(19,50,64,.045)`.
- Easing curve used everywhere: `cubic-bezier(.22, 1, .36, 1)` — "one easing curve for everything," per Design System. Never use a bounce/spring easing.
- Max content width: `1600px`, centered (`margin: 0 auto`).
- Standard horizontal page padding: `clamp(20px, 4vw, 56px)`.
- Grid: 12-column (`repeat(12, 1fr)`), gap `32px` typically (some inner grids use `clamp(24px, 4vw, 64px)` gap for image/copy chapter pairs).
- Square corners throughout site — **no border-radius anywhere on cards/images/buttons** except the small circular status dots (`border-radius: 50%`).
- No drop shadows, no glassmorphism.

**Responsive breakpoint:** single breakpoint at `max-width: 900px`. Below it:
- Any `repeat(12, 1fr)` or `repeat(5, 1fr)` (Home) / `repeat(3,1fr)` (Products) grid collapses to `1fr` (single column, full stack).
- Any element with an inline `grid-column` style becomes `grid-column: auto` (i.e., stacks naturally).
- Home-specific: elements using `border-right: 1px solid rgba(245,240,232,.18)` (the farm-stats stat dividers) flip to `border-bottom` instead and lose their `padding-left`.
- Header nav (`#nn-nav`) is hidden below 900px via JS (`matchMedia`), replaced by a hamburger "Menu" button (`#nn-menu-open`) which opens the full-screen `#nn-menu` overlay. Word-mark text and location text (`#nn-wordmark`, `#nn-loc`) are also hidden at ≤900px, leaving just the logo mark.

**Reveal-on-scroll animation** (`data-reveal` attribute pattern, appears throughout Home and on the comparison-table section of Products):
- On mount, an `IntersectionObserver` (rootMargin `0px 0px -10% 0px`) arms all `[data-reveal]` elements not yet armed: sets `opacity:0`, `transform: translateY(28px)`, `transition: opacity 1s cubic-bezier(.22,1,.36,1), transform 1s cubic-bezier(.22,1,.36,1)`.
- When an armed element intersects the viewport, JS sets `opacity:1; transform:none` and unobserves it (one-shot, not re-triggered on scroll-out).
- Re-arming runs every 400ms for the first 5 seconds after mount (to catch elements added/present after initial paint), then the interval clears.
- Implementation note for React: this is best replicated with a reusable hook/component (e.g., `useReveal` + wrapping `<Reveal>` component) using `IntersectionObserver`, defaulting to the same translateY(28px)/opacity(0)→1/1s timing.

**Sticky header behavior** (`#nn-header`, both pages via a shared `SiteHeader` component — Products.dc.html literally imports it via `<dc-import name="SiteHeader" variant="solid" active="Products" hint-size="100%,85px">`, Home.dc.html hand-rolls the same header markup inline):
- Fixed, `top:0`, full width, `z-index: 80`.
- Un-scrolled state (Home hero, transparent variant): `background: transparent`; padding `26px clamp(20px,4vw,56px)`; border-bottom transparent; nav text `rgba(245,240,232,.85)`; wordmark `#f5f0e8`; location text `rgba(245,240,232,.55)`; logo image height `46px`.
- Scrolled state (`window.scrollY > 80`): `background:#f5f0e8`; padding shrinks to `14px clamp(20px,4vw,56px)`; border-bottom `rgba(19,50,64,.16)`; nav text `#133240`; wordmark `#133240`; location text `rgba(19,50,64,.5)`; logo height shrinks to `34px`.
- All these properties transition over `.5s cubic-bezier(.22,1,.36,1)` (border-color `.5s` plain).
- **Products.dc.html uses `variant="solid"`** on its imported `SiteHeader` — meaning on the Products page the header is presumably always in the "scrolled"/cream-solid state (not transparent-over-hero), since Products' hero section is on cream `#f5f0e8` background, not a dark image like Home's. Implement `SiteHeader` as a reusable component accepting a `variant` prop (`"transparent"` default that becomes solid on scroll, vs `"solid"` always-on) and an `active` prop to bold/underline the current nav item ("Products" on the Products page).

**Full-screen mobile menu (`#nn-menu`):** fixed inset:0, z-index 90, background `#133240`, flex column `justify-content: space-between`, padding `28px 24px 40px`, gap `40px`, `overflow-y:auto`, hidden by default (`opacity:0; pointer-events:none`), transitions `opacity .5s cubic-bezier(.22,1,.36,1)`.
  - Top row: "Machakos, KE" (mono, 11px, letterspacing .2em, uppercase, `rgba(245,240,232,.5)`) left; "Close" button right (same mono style, `color:#f5f0e8`).
  - Middle: vertical nav list, each link `font-size: clamp(30px, 8vh, 56px)`, `font-weight:700`, `letter-spacing:-.03em`, `line-height:1.15`, color `#f5f0e8`, class `nn-menu-link` (hover indents 12px). Links: **Products** → `Products.dc.html`, **Our Farm** → `About.dc.html`, **Inside the Farm** → `Inside-the-Farm.dc.html`, **About** → `About.dc.html` (note: "Our Farm" and "About" both point to `About.dc.html` — duplicate target, preserve as-is), **Contact** → `Contact.dc.html`.
  - Bottom: status row (green blinking dot + "Eggs, manure & hens available" mono uppercase 11px `rgba(245,240,232,.6)`), then a full-width CTA button "Order Fresh Eggs →" (`background:#f59268; color:#133240; padding:22px 26px; font-size:18px; font-weight:600`, flex row `justify-content:space-between`) linking to `Order-Flow.dc.html`.
  - `nn-blink` keyframes: `0%,60% {opacity:1} 85%,100% {opacity:.2}`, `animation: nn-blink 2.4s ease-in-out infinite` (with staggered `.4s`/`.8s` delays where multiple dots appear together, e.g. the Home farm-status bar).

**Footer** (`SiteFooter`, imported on Products via `<dc-import name="SiteFooter" hint-size="100%,420px">`; hand-rolled on Home — same content, treat as one shared component):
- `background:#0f2833` (darker than page navy #133240), text `rgba(245,240,232,.6)`, padding `clamp(56px,7vw,96px) clamp(20px,4vw,56px) 40px`.
- Content max-width 1600px centered.
- Top row: 12-col grid, gap 32px, padding-bottom 56px, border-bottom `1px solid rgba(245,240,232,.14)`.
  - Col 1 (span 4): "N&N Poultry Palace" (22px, 700, `#f5f0e8`, letter-spacing -.02em); below it "Fresh and Nutritious" (mono, 11px, letterspacing .18em, uppercase, `#eccc74`, margin-top 10px); below that mission paragraph (15px, line-height 1.7, max-width 34ch): **"To be East Africa's leading provider of sustainable quality poultry products."**
  - Col 2 (span 2): heading "Pages" (mono, 10px, letterspacing .2em, uppercase, `rgba(245,240,232,.4)`); links (15px, line-height 2.2, block): Products → `Products.dc.html`, About → `About.dc.html`, Inside the Farm → `Inside-the-Farm.dc.html`, Contact → `Contact.dc.html`.
  - Col 3 (span 2): heading "Products"; links: Table Eggs → `Table-Eggs.dc.html`, Poultry Manure → `Poultry-Manure.dc.html`, Ex-Layer Hens → `Ex-Layer-Hens.dc.html`.
  - Col 4 (span 4): heading "Contact" (mono styling as above); mono lines (12px, line-height 2.2, letterspacing .06em): "0113 377 623 · 0714 246 534", "palacepoultryn.n@gmail.com", "Machakos, Kenya", then dimmed line "Mon–Fri 8:00–17:00 · Sat 8:00–12:00" (`color: rgba(245,240,232,.4)`, margin-top 12px).
- Bottom row: flex, `justify-content:space-between`, padding-top 28px, mono 10px letterspacing .18em uppercase `rgba(245,240,232,.35)`: left "© 2026 N&N Poultry Palace"; right links "Mobile states" (`Mobile.dc.html`, dim `rgba(245,240,232,.55)`) and "Design system" (`Design-System.dc.html`, `#eccc74`). **These two utility links are prototype-only scaffolding — do not port them into the production footer.**

**Real business facts (verbatim, zero-tolerance for invention):**
- Company name: N&N Poultry Palace.
- Location: Machakos, Kenya (specifically Katoloni for the layer house).
- Phone: 0113 377 623 · 0714 246 534.
- Email: palacepoultryn.n@gmail.com.
- Hours: Mon–Fri 8:00–17:00 (also written "Mon–Fri 8–5"), Sat 8:00–12:00 (also written "Sat 8–12").
- Delivery zones (6): Machakos Town, Syokimau, Athi River, Mlolongo, Katoloni, Mwala.
- History: began 2021 as a backyard broiler project during Covid. When eateries closed and the broiler market collapsed, the family moved to layers in 2022 and registered the company. Disease challenges followed, addressed via online training, seminars, and farm visits.
- Name origin: "The name comes from a family setup — two daughters bear the initials."
- Founders: "The Kyalos" — Founders & Directors · 5 years farming.
- Founder guiding-principles quote (verbatim): **"Integrity, teamwork and consistency are our guiding principles."**
- Mission statement (footer, verbatim): **"To be East Africa's leading provider of sustainable quality poultry products."**
- Tagline (footer eyebrow): **"Fresh and Nutritious"**.
- Testimonials (verbatim, real names/roles as given in source — do not alter):
  1. **Chef Kamau J.** · Machakos Town · Restaurant owner — *"We switched our restaurant supply to N&N six months ago. Their wholesale pricing is fair, invoicing is professional, and I have never had a rejected batch."* (Also appears shortened in Design-System.dc.html as *"I have never had a rejected batch."* — the full quote above is the one actually used on Home; use the full version.)
  2. **Wanjiru M.** · Syokimau — *"The yolks are bright and rich — you can really taste the difference."*
  3. **Amina S.** · Athi River — *"WhatsApp ordering is convenient, and they remind me before I run low."*
  4. **David K.** · Mlolongo — *"Supply chain reliability is everything. N&N delivers on time, every time."*
- Products offered: Table Eggs (30pc trays, mixed grade large/medium), Poultry Manure (70kg sacks / FH truck), Ex-Layer Hens (72–80 weeks old, sold live at the farm).
- Egg collection window: daily, 2 PM–4 PM (grading runs "two until four").
- Packing: sealed by 5 PM.
- Farm-to-door time: 24–48 hours.
- Delivery days: Monday to Saturday, morning route.

**Three image roles** (per Design-System.dc.html §04/Imagery — every photo on the site must be one of these three, square corners, no rounded cards/glass/shadows, mono captions sit *under* the frame not overlaid):
1. **Hero** — full-bleed, 16:10 aspect (or similar wide ratio), no dark scrim by design-system default (Home's actual hero uses a gradient scrim over the image — treat Home's hero as an intentional exception for text-legibility, noted below). Zoom 1.06 / 1.2s on hover where applicable.
2. **Editorial** — tighter crop (e.g. 3:4), documentary/behind-the-scenes shots (hands, barns, process), mono caption below.
3. **Product cutout** — transparent PNG product photography served from `public/norm/` (pre-normalized: trimmed to alpha bbox, re-canvased to a shared 1200×1200 transparent square, optically scaled to constant geometric mean ≈914/1200, optically centered per-asset — hen −2%, tray +3%, sacks +1%), placed on a solid color block (usually the product's accent color or `#133240`), `object-fit: contain`, frame padding 10% (gallery thumbs 8%, chapter tiles 3%). Never place a raw/un-normalized cutout in a frame.

---

## HOME.dc.html — section by section

### Header (shared `SiteHeader`, transparent-over-hero variant on this page)
Fixed header, transparent by default (dark hero behind it), described in Global Tokens above. Logo: `<img src="public/nn-poultry-logo.png">` height 46px→34px on scroll, wordmark "N&N Poultry Palace" (16px, 700, letterspacing -.01em) beside it. Nav links (15px, 500, `nn-navlink` underline-on-hover): Products, Our Farm (→About.dc.html), Inside the Farm, About. Right side: location "Machakos, KE" (mono 10px), CTA button "Order Fresh Eggs →" (`background:#f59268; color:#133240; padding:14px 24px; font-size:15px; font-weight:600`) → `Order-Flow.dc.html`, hamburger "Menu" button (hidden ≥900px).

### 1. Hero section
- Full-viewport (`min-height:100vh`), `background:#133240`, flex column, content pinned to bottom via `justify-content: flex-end`, `overflow:hidden`.
- **Background image:** `public/assets/education/grading of eggs.jpeg`, alt "Stacking trays of graded eggs at the N&N farm". Positioned absolute, `inset: -34px 0` (slight overscan for the settle animation), `object-fit:cover`, `object-position: 62% 50%`. Has `data-parallax="24"` attribute (parallax scroll effect — implies JS-driven parallax at a factor/offset of 24, presumably shifts the image on scroll; replicate with a scroll-linked transform or a parallax library/hook at similar intensity).
- Image has a settle-in animation on load: `animation: nn-hero-settle 2.4s cubic-bezier(.22,1,.36,1) both;` — keyframes `from { transform: scale(1.07) } to { transform: scale(1) }` (image starts slightly zoomed and eases to normal scale).
- **Gradient scrim overlay** on top of image: `linear-gradient(90deg, rgba(19,50,64,.9) 0%, rgba(19,50,64,.62) 44%, rgba(19,50,64,.12) 78%, rgba(19,50,64,.3) 100%)` — strongest dark on the left (where text sits), fading toward the right, with a slight re-darkening at the far right edge.
- **Content grid:** max-width 1600px, 12-col, gap 32px, padding `200px clamp(20px,4vw,56px) 0`, `align-content:center`, `flex:1`.
  - Text block occupies `grid-column: 1 / span 7`.
  - Eyebrow row (margin-bottom 34px): 44px×1px gold (`#eccc74`) line + mono uppercase 11px letterspacing .24em `#eccc74` text: **"Machakos / Kenya"**.
  - H1 (`font-size: clamp(52px, 8.4vw, 122px); font-weight:800; line-height:.87; letter-spacing:-.038em; color:#f5f0e8`): **"From our flock<br />to your table."** (explicit two-line break after "flock").
  - Body paragraph (margin-top 34px, max-width 44ch, `font-size: clamp(18px,1.5vw,22px)`, line-height 1.55, `color: rgba(245,240,232,.72)`): **"Eggs laid here, graded here, dispatched from here. No cold storage, no middlemen — a family farm in Machakos County that has been getting the ordinary thing right since 2021."**
  - CTA row (margin-top 44px, flex gap 16px, wrap): 
    - Primary: "Order Fresh Eggs →" — `background:#f59268; color:#133240; padding:20px 32px; font-size:17px; font-weight:600` → `Order-Flow.dc.html`.
    - Secondary (outline): "Explore the Farm →" — `border:1px solid rgba(245,240,232,.34); color:#f5f0e8; padding:20px 32px; font-size:17px; font-weight:600` → `About.dc.html`.
  - All four hero elements (eyebrow, h1, paragraph, CTA row) have staggered entrance animations on page load (not scroll-triggered): `nn-hero-in` keyframes `from{opacity:0; transform:translateY(30px)} to{opacity:1; transform:translateY(0)}`, durations ~0.9–1s, delays staggered at `.2s / .34s / .48s / .62s` respectively (each element starts slightly after the previous).
- **Farm Status bar** (bottom of hero, full width): `border-top:1px solid rgba(245,240,232,.16)`, `background: rgba(19,50,64,.55)`, its own entrance animation `nn-hero-in` at `.8s` delay. Inner row: max-width 1600px, padding `22px clamp(20px,4vw,56px)`, flex wrap, `justify-content:space-between`, gap `14px 44px`.
  - Left label: "Farm Status" (mono 10px, letterspacing .24em, uppercase, `#eccc74`).
  - Middle: three status items (mono 11px, letterspacing .16em, uppercase, `rgba(245,240,232,.8)`), each with a blinking green dot (7×7px circle, `#4ade80`, `nn-blink` 2.4s infinite, staggered delays 0/.4s/.8s): **"Table eggs — Available"**, **"Manure — Available"**, **"Ex-layers — Available"**.
  - Right: "Updated {{ updatedAt }} EAT" (mono 10px, letterspacing .18em, `rgba(245,240,232,.45)`) — `updatedAt` is a live-computed Africa/Nairobi HH:mm timestamp set in `componentDidMount` via `Intl.DateTimeFormat`. In the React port this should be computed client-side (e.g., `useEffect` setting state, or server time formatted to Africa/Nairobi) — not a static string.

### 2. Section 01 — "The Farm" intro strip
- `background:#f5f0e8`, padding `clamp(88px,12vw,190px) clamp(20px,4vw,56px) clamp(56px,7vw,96px)`. Has `data-reveal`.
- 12-col grid, gap 32px, `align-items:start`.
  - Col `1/span 2`: mono eyebrow stack (11px, letterspacing .2em, uppercase, `rgba(19,50,64,.45)`, line-height 2): **"01 / The Farm"** then line break, then `<span style="color:#c0613b">Machakos</span>`, then line break, then **"Daily care"**.
  - Col `3/span 9`: H2 (`font-size: clamp(36px,5.6vw,84px); font-weight:700; line-height:.98; letter-spacing:-.035em; text-wrap:pretty`): **"Every product begins with how we care for the flock."**

### 3. Full-bleed editorial image — layer house
- `data-reveal`, class `nn-zoom` (hover-zoom image), `position:relative; height:clamp(400px,62vw,760px); background:#133240`.
- Image: `public/assets/education/layer-hens.jpeg`, alt "Layer hens in the N&N barn", `object-fit:cover`, fills container.
- Caption overlay, bottom-left: `position:absolute; left:clamp(20px,4vw,56px); bottom:clamp(20px,4vw,44px); background:rgba(19,50,64,.9); padding:18px 24px; max-width:380px`.
  - Eyebrow (mono 10px, letterspacing .2em, uppercase, `#eccc74`, margin-bottom 8px): **"Layer house — Katoloni"**.
  - Body (15px, line-height 1.6, `rgba(245,240,232,.78)`): **"Low stocking density, constant ventilation, and a walk-through before anyone checks a phone in the morning."**
- Image role: Editorial (per three-image-roles system), though here rendered wide/full-bleed rather than the typical 3:4 crop.

### 4. Section 02 — "Operations" / "The day, in numbers." (farm stats)
- `background:#133240; color:#f5f0e8`, padding `clamp(80px,10vw,150px) clamp(20px,4vw,56px)`. Content max-width 1600px.
- **Heading row** (`data-reveal`, margin-bottom `clamp(48px,6vw,88px)`), 12-col grid gap 32px:
  - Col `1/span 2`: mono eyebrow `#eccc74`: **"02 / Operations"**.
  - Col `3/span 6`: H2 (`clamp(32px,4.4vw,62px); 700; line-height:1; letter-spacing:-.03em`): **"The day, in numbers."** Below it (margin 0, 19px, line-height 1.6, `rgba(245,240,232,.6)`, max-width 46ch): **"Nothing here is a marketing figure. These are the times we work to and the window we hold ourselves to."**
- **Stat grid** (`data-reveal`, separate reveal group): `display:grid; grid-template-columns: repeat(auto-fit, minmax(220px,1fr)); border-top:1px solid rgba(245,240,232,.18)`. Four stat cells, each `border-right:1px solid rgba(245,240,232,.18)` except the last:
  1. Padding `40px 28px 34px 0`. Big number (`clamp(48px,5vw,76px); 800; letter-spacing:-.04em; line-height:1; color:#eccc74`): **"2 PM"**. Label below (mono 10px, letterspacing .2em, uppercase, `rgba(245,240,232,.5)`, margin-top 16px): **"Collection starts"**. Description (15px, line-height 1.65, `rgba(245,240,232,.55)`, margin-top 12px, max-width 30ch): **"Hens lay from dawn to past midday. Grading runs two until four."**
  2. Padding `40px 28px 34px`. Number: **"5 PM"**. Label: **"Packed & sealed"**. Description: **"Shell-checked by hand. Anything that fails is ours to absorb."**
  3. Padding `40px 28px 34px`. Number: **"24–48"**. Label: **"Hours, farm to door"**. Description: **"Yesterday's collection goes to the local market, never into tomorrow's tray."**
  4. Padding `40px 0 34px 28px` (no right border — last cell). Number: **"06"**. Label: **"Delivery zones"**. Below (instead of a description paragraph): a wrapped tag list (flex, gap 8px, margin-top 14px, mono 10px letterspacing .12em uppercase `rgba(245,240,232,.6)`), each tag `border:1px solid rgba(245,240,232,.2); padding:5px 9px`: **Machakos Town**, **Syokimau**, **Athi River**, **Mlolongo**, **Katoloni**, **Mwala**.
- On mobile (≤900px), the `border-right` dividers flip to `border-bottom` per global media query, and the grid collapses to 1 column (from the `repeat(auto-fit...)` — note: the mobile CSS override specifically targets `repeat(12,1fr)` and `repeat(5,1fr)`, NOT `repeat(auto-fit,...)`, so this particular stat grid actually keeps its auto-fit responsive behavior naturally reflowing via `minmax(220px,1fr)` rather than being forced to 1fr by the override rule — implement equivalently with a responsive grid that naturally stacks under ~220px column width).

### 5. Section 03 — "Products" intro + 3 product chapters
**Intro strip** (padding-top only, `clamp(88px,11vw,170px) 0 0`, `background:#f5f0e8`):
- Inner (`data-reveal`, padding `0 clamp(20px,4vw,56px) clamp(48px,6vw,80px)`), 12-col grid gap 32px:
  - Col `1/span 2`: eyebrow **"03 / Products"** (mono 11px, uppercase, `rgba(19,50,64,.45)`).
  - Col `3/span 7`: H2 (`clamp(32px,4.4vw,62px); 700; line-height:1; letter-spacing:-.03em`, margin-bottom 20px): **"Three things. Each done properly."** Paragraph (19px, line-height 1.6, `rgba(19,50,64,.66)`, max-width 46ch): **"The flock produces eggs, the barn produces manure, and at the end of the laying cycle the hens themselves. Nothing on this farm is wasted."**

**Chapter 1 — Table Eggs** (`<article data-reveal>`, `border-top:1px solid rgba(19,50,64,.16)`, background inherits cream):
- 12-col grid, gap `clamp(24px,4vw,64px)`, `align-items:center`, inner padding `0 clamp(20px,4vw,56px)`.
- Text col `1/span 5`, padding `clamp(56px,7vw,110px) 0`:
  - Eyebrow row: 34×2px gold rule + mono 11px uppercase `rgba(19,50,64,.55)`: **"01 / Table Eggs"**.
  - H3 (`clamp(36px,4.6vw,68px); 700; line-height:.96; letter-spacing:-.035em`, margin-bottom 22px): **"Fresh eggs,<br />collected daily."**
  - Body (18px, line-height 1.65, `rgba(19,50,64,.68)`, max-width 40ch, margin-bottom 36px): **"Sold by the thirty-piece tray. Mixed grade, large and medium, inspected for shell integrity and size before packing."**
  - **Product metadata table** pattern (border-top hairline, rows `border-bottom:1px solid rgba(19,50,64,.16)`, each row flex `justify-content:space-between`, padding `13px 0`, mono 11px letterspacing .14em uppercase, label at `rgba(19,50,64,.5)` left, value full-opacity right-aligned): 
    - Collection → Daily, from 2 PM
    - Unit → 30pc tray / bulk case
    - Best for → Households · Bakeries · Kiosks
  - CTA: "Order Table Eggs →" (`background:#133240; color:#f5f0e8; padding:18px 30px; font-size:16px; font-weight:600`) → `Table-Eggs.dc.html`.
- Image col `7/span 6`, class `nn-zoom`, `min-height:clamp(320px,42vw,620px)`: `public/eggs.jpeg`, alt "Trays of fresh N&N table eggs", absolute-fill `object-fit:cover`. (Editorial-scene image role.)

**Chapter 2 — Poultry Manure** (`<article data-reveal>`, `background: rgba(122,158,126,.09)` — faint sage tint, `border-top` hairline):
- **Image and text columns are swapped** vs chapter 1 (image left, text right) — creates alternating rhythm.
- Image col `1/span 6`, class `nn-zoom`, same min-height: `public/manure-hips.jpeg`, alt "Poultry manure heaps drying in the sun".
- Text col `8/span 5` (note: starts at col 8, not 7, leaving a 1-col gap from the image which ends at col 6 — asymmetric gutter), padding `clamp(56px,7vw,110px) 0`:
  - Eyebrow row: 34×2px **sage** (`#7a9e7e`) rule + **"02 / Poultry Manure"**.
  - H3: **"What the barn<br />gives the soil."**
  - Body: **"Nothing added, nothing treated. Dried naturally in the Machakos sun, which concentrates the nutrients and clears most pathogens."**
  - Metadata table: Composition → Nitrogen · Phosphorus · Potassium; Unit → 70kg sack / FH truck; Coverage → ≈50–80 m² per sack.
  - CTA: "Order Manure →" → `Poultry-Manure.dc.html`.

**Chapter 3 — Ex-Layer Hens** (`<article data-reveal>`, `border-top` hairline, plain cream background, image-right layout like chapter 1):
- Text col `1/span 5`:
  - Eyebrow row: 34×2px **terracotta** (`#c0613b`) rule + **"03 / Ex-Layer Hens"**.
  - H3: **"The end of<br />a good cycle."**
  - Body: **"Healthy birds at 72–80 weeks, vet-inspected and raised on balanced feed. Firm meat, favoured for slow-cooked traditional dishes."**
  - Metadata table: Age → 72–80 weeks; Health → Full vaccination programme; Collection → Sold live, at the farm.
  - CTA: "Enquire on Hens →" → `Ex-Layer-Hens.dc.html`.
- Image col `7/span 6`, class `nn-zoom`: `public/layers.jpeg`, alt "Ex-layer hens at N&N Poultry Palace".

### 6. Section 04 — Process strip ("Care, collect, grade, pack, deliver.")
- `background:#133240; color:#f5f0e8`, padding `clamp(80px,10vw,150px) clamp(20px,4vw,56px)`.
- Heading row (not itself `data-reveal` — only the two inner blocks are, per source structure: the outer `<div>` wrapping heading+grid is NOT `data-reveal`, but note the heading row `<div>` here has no `data-reveal` attr in source — only the parent `<section>` has it): 12-col grid gap 32px, margin-bottom `clamp(48px,6vw,88px)`.
  - Col `1/span 2`: eyebrow **"04 / Process"** (`#eccc74`).
  - Col `3/span 7`: H2 (`clamp(32px,4.4vw,62px); 700; line-height:1; letter-spacing:-.03em`): **"Care, collect, grade,<br />pack, deliver."**
- **5-column step grid**: `grid-template-columns: repeat(5,1fr)`, `border-top:1px solid rgba(245,240,232,.18)`. Each cell has `border-right` (except last), numbered `01`–`05` in mono gold (`#eccc74`, 11px, letterspacing .2em, margin-bottom 22px), then a title (`clamp(20px,1.7vw,26px); 600; letter-spacing:-.015em`, margin-bottom 14px), then description (15px, line-height 1.65, `rgba(245,240,232,.55)`):
  1. Padding `34px 22px 40px 0`. **Care** — *"A walk-through of the flock before anything else. You learn to read a bird."*
  2. Padding `34px 22px 40px`. **Collect** — *"Three times a day at peak. Frequency is what keeps eggs clean and uncracked."*
  3. Padding `34px 22px 40px`. **Grade** — *"Shell integrity and size consistency, checked by hand between two and four."*
  4. Padding `34px 22px 40px`. **Pack** — *"Sealed into 30pc trays by five, labelled with the day they were collected."*
  5. Padding `34px 0 40px 22px` (no right border). **Deliver** — *"On the morning route, Monday to Saturday, across six zones of the county."*
- On mobile this 5-col grid is forced to 1-col via the global `repeat(5, 1fr)` override rule, with border-right→border-bottom flip.

### 7. Section 05 — Gallery ("A year on the farm, in nine frames.")
- `background:#f5f0e8`, padding `clamp(80px,10vw,160px) clamp(20px,4vw,56px)`.
- Heading row, 12-col grid gap 32px, margin-bottom `clamp(40px,5vw,72px)`:
  - Col `1/span 2`: eyebrow **"05 / The Farm"**.
  - Col `3/span 6`: H2 (`clamp(30px,3.6vw,52px); 700; line-height:1.02; letter-spacing:-.03em`): **"A year on the farm, in nine frames."** (Note: only 4 images actually appear in this section despite the "nine frames" copy — that headline number is intentional prototype copy referencing a larger planned gallery; port the headline text as-is, verbatim, but only 4 `<figure>` tiles exist in source to implement.)
- **Asymmetric image grid**, 12-col, gap `clamp(16px,2vw,32px)`, class `nn-zoom` on each figure (Editorial image role, mono caption below each in 10px letterspacing .16em uppercase `rgba(19,50,64,.5)`, margin-top 12px):
  1. `grid-column: 1/span 8`, aspect-ratio 16/9, bg `#133240`: `public/assets/education/grown chicks to hen.jpeg`, alt "Growing birds in the house". Caption: **"Grower house — low stocking density, constant ventilation"**.
  2. `grid-column: 10/span 3`, `align-self:end`, aspect-ratio 3/4: `public/assets/education/one day old chicks.jpeg`, alt "Day-old chicks in the brooder". Caption: **"Day one — brooder at 32–35°C"**.
  3. `grid-column: 2/span 3`, `margin: clamp(24px,4vw,72px) 0 0` (pushed down to break the row), aspect-ratio 4/5: `public/assets/education/pullets.jpeg`, alt "Pullets in the grower house". Caption: **"Week 17 — first light stimulation"**.
  4. `grid-column: 6/span 7`, same top margin, aspect-ratio 16/10: `public/assets/education/grading of eggs.jpeg`, alt "Stacking graded trays". Caption: **"Grading room — every tray checked before it is sealed"**.
  - Note the deliberate off-grid/gapless-bento asymmetry (tile 2 doesn't start at column 9, tile 3 doesn't start at column 1) — preserve these exact column starts/spans, do not "clean up" to a symmetric grid.

### 8. Section 06 — Founder quote ("The people behind it")
- `background:#133240; color:#f5f0e8`, no section-level horizontal padding on outer section (padding is on the inner grid via the container).
- 12-col grid, gap `clamp(24px,4vw,64px)`, `align-items:center`, padding `0 clamp(20px,4vw,56px)`.
- Image col `1/span 5`, class `nn-zoom`, `min-height:clamp(360px,46vw,700px)`: `public/assets/education/grown chicks-hens.jpeg`, alt "The N&N flock". Has an overlay caption strip at the bottom: `background: rgba(19,50,64,.88)`, padding `14px 20px`, mono 10px letterspacing .16em uppercase `rgba(245,240,232,.6)`: **"Founder portrait to be photographed — flock imagery standing in"**. **This is a known placeholder note in the prototype** — it explicitly says the founder photo doesn't exist yet and flock imagery is a stand-in. Flag this for the client/content team; do not silently drop or silently treat the flock image as the "real" founder photo without this disclosure carried into a CMS/content note.
- Text col `7/span 6`, padding `clamp(64px,8vw,130px) 0`:
  - Eyebrow row: 34×1px gold line + **"06 / The people behind it"** (mono 11px, `#eccc74`).
  - Blockquote (`clamp(28px,3.4vw,50px); 600; line-height:1.1; letter-spacing:-.03em`, margin-bottom 36px): **"Integrity, teamwork and consistency are our guiding principles."**
  - Paragraph 1 (17px, line-height 1.75, `rgba(245,240,232,.62)`, max-width 52ch, margin-bottom 18px): **"N&N began in 2021 as a backyard broiler project during Covid. When the eateries closed and the broiler market went with them, the family moved to layers in 2022 and registered the company. Disease challenges came next, and with them online training, seminars and a long run of farm visits."**
  - Paragraph 2 (same styling, margin-bottom 40px): **"The name comes from a family setup — two daughters bear the initials. The first year was hard. Batches were lost, mistakes were made. The quality of what left the farm never moved."**
  - Attribution block: `border-top:1px solid rgba(245,240,232,.2)`, padding-top 22px. Name (18px, 600): **"The Kyalos"**. Role line (mono 11px, letterspacing .16em, uppercase, `#eccc74`, margin-top 6px): **"Founders & Directors · 5 years farming"**.
- Component reuse: this is the "Pull quote & breadcrumb" pattern's blockquote half from Design-System (large serif-weight quote + mono attribution), though here without the breadcrumb, and colored for dark background rather than cream.

### 9. Section 07 — Testimonials ("Trust")
- `background:#eccc74` (gold section — the only gold full-section background on the page), padding `clamp(80px,10vw,160px) clamp(20px,4vw,56px)`.
- 12-col grid gap 32px.
  - Col `1/span 2`: eyebrow **"07 / Trust"** (mono 11px, `rgba(19,50,64,.55)`).
  - Col `3/span 8`: 
    - **Dominant testimonial** (Testimonial pattern — "one dominant quote per page, set large, never a carousel"): blockquote (`clamp(28px,3.8vw,58px); 600; line-height:1.12; letter-spacing:-.032em`, margin-bottom 40px): **"We switched our restaurant supply to N&N six months ago. Their wholesale pricing is fair, invoicing is professional, and I have never had a rejected batch."** Attribution row: `border-top:1px solid rgba(19,50,64,.28)`, padding-top 22px, flex baseline gap 20px wrap: name **"Chef Kamau J."** (19px, 600) + role **"Machakos Town · Restaurant owner"** (mono 11px, letterspacing .18em, uppercase, `rgba(19,50,64,.6)`).
    - **Secondary testimonial row**, same col span, `display:grid; grid-template-columns: repeat(auto-fit, minmax(260px,1fr)); gap:40px`, margin-top `clamp(48px,6vw,80px)` — 3 smaller quotes, each: paragraph (16px, line-height 1.7, `rgba(19,50,64,.72)`, margin-bottom 14px) + mono attribution (11px, letterspacing .16em, uppercase, `rgba(19,50,64,.55)`):
      1. **"The yolks are bright and rich — you can really taste the difference."** — Wanjiru M. · Syokimau
      2. **"WhatsApp ordering is convenient, and they remind me before I run low."** — Amina S. · Athi River
      3. **"Supply chain reliability is everything. N&N delivers on time, every time."** — David K. · Mlolongo

### 10. Section 08 — Education teaser ("Inside the Farm")
- `background:#f5f0e8`, padding `clamp(80px,10vw,160px) clamp(20px,4vw,56px)`.
- Heading row, 12-col grid gap 32px, `align-items:end`, margin-bottom `clamp(40px,5vw,72px)`:
  - Col `1/span 2`: eyebrow **"08 / Education"**.
  - Col `3/span 6`: H2 (`clamp(30px,3.8vw,56px); 700; line-height:1; letter-spacing:-.03em`): **"Inside the Farm"**.
  - Col `11/span 2`, `justify-self:end`: link "All writing →" (mono 11px, letterspacing .18em, uppercase, `#c0613b`, `border-bottom:1px solid rgba(192,97,59,.4)`, padding-bottom 6px) → `Inside-the-Farm.dc.html`.
- **Article card grid** (Article Card pattern from Design System — "no border, no shadow, category in terracotta, note number first, image zoom on hover"): 12-col, gap `clamp(20px,3vw,40px)`, all links `class="nn-zoom"` → `Article.dc.html`:
  1. `grid-column: span 6`, aspect-ratio 4/3: `public/assets/education/chicks feeding.jpeg`, alt "Chicks feeding". Category label (mono 10px, letterspacing .18em, uppercase, `#c0613b`, margin `18px 0 10px`): **"The Chick Journey"**. Title (`clamp(22px,2.2vw,32px); 600; letter-spacing:-.02em; line-height:1.15`): **"The Science of Chick Feeding"**.
  2. `grid-column: span 3`, aspect-ratio 4/5: `public/assets/education/poultry-manure.png`, alt "Poultry manure". Category: **"Product Excellence"**. Title (20px, 600, letter-spacing -.015em, line-height 1.2): **"Sustainable Farming with Organic Manure"**.
  3. `grid-column: span 3`, aspect-ratio 4/5: `public/images/biosecurity.jpeg`, alt "Biosecurity". Category: **"Growth & Care"**. Title: **"Controlled Access for Enhanced Biosecurity"**.
  - Note: the first article card is visually double-width (span 6) with a larger title clamp than the other two (span 3 each) — this size hierarchy (1 large + 2 small) must be preserved, not made uniform.

### 11. Final CTA ("Order")
- `background:#133240; color:#f5f0e8`, padding `clamp(90px,12vw,180px) clamp(20px,4vw,56px)`.
- 12-col grid, gap 32px, `align-items:end`.
  - Col `1/span 7`: eyebrow **"Order"** (mono 11px, letterspacing .22em, uppercase, `#eccc74`, margin-bottom 30px). H2 (`clamp(38px,6vw,92px); 800; line-height:.92; letter-spacing:-.038em`, margin-bottom 28px): **"Send a message.<br />Eat tomorrow."** Paragraph (20px, line-height 1.6, `rgba(245,240,232,.65)`, max-width 44ch): **"Tell us the quantity and where you are. We confirm price and the next delivery slot, usually within minutes."**
  - Col `9/span 4`: flex column gap 16px:
    - "Order Fresh Eggs →" button (`background:#f59268; color:#133240; padding:24px 28px; font-size:18px; font-weight:600`, flex `justify-content:space-between`) → `Order-Flow.dc.html`.
    - "Talk to us →" outline button (`border:1px solid rgba(245,240,232,.3); color:#f5f0e8`, same padding/size) → `Contact.dc.html`.
    - Contact mono block (11px, letterspacing .14em, uppercase, `rgba(245,240,232,.45)`, line-height 2, margin-top 8px): **"0113 377 623 · 0714 246 534"** / **"Mon–Fri 8–5 · Sat 8–12"**.

### Footer
Shared `SiteFooter` — see Global Tokens section above for full content (identical on both pages).

---

## PRODUCTS.dc.html — section by section

### Header
`<dc-import name="SiteHeader" variant="solid" active="Products" hint-size="100%,85px">` — solid/always-cream variant (page has no dark hero behind the header), current nav item "Products" should be visually marked active (e.g., persistent underline or bold, consistent with `.nn-navlink` hover treatment — source doesn't show the exact "active" visual since it's a black-box import, but implement by reusing the underline style permanently on the active link).

### 1. Hero / page intro
- `background:#f5f0e8`, padding `clamp(60px,9vw,140px) clamp(20px,4vw,56px) clamp(48px,6vw,90px)`. Content max-width 1600px, 12-col grid gap 32px, `align-items:end`. **Not wrapped in `data-reveal`** in source (loads in immediately, unlike Home's equivalent intro).
  - Col `1/span 8`:
    - Eyebrow row (margin-bottom 32px): 44×1px terracotta (`#c0613b`) line + mono 11px letterspacing .24em uppercase `rgba(19,50,64,.55)`: **"Products / N&N Poultry Palace"**.
    - H1 (`clamp(46px,7.4vw,108px); 800; line-height:.88; letter-spacing:-.038em`): **"Three products.<br />Each done properly."**
    - Paragraph (margin-top 34px, max-width 48ch, `clamp(18px,1.4vw,21px)`, line-height 1.6, `rgba(19,50,64,.68)`): **"Table eggs from the layer house, organic manure from the barn floor, and hens at the end of their laying cycle. One flock, three things, nothing wasted."**
  - Col `10/span 3` (right-aligned status block, mono 11px letterspacing .14em uppercase `rgba(19,50,64,.55)`, line-height 1.9):
    - Row: green blinking dot + **"All three available today"** (margin-bottom 14px).
    - `border-top:1px solid rgba(19,50,64,.16)`, padding-top 12px: **"Updated {{ updatedAt }} EAT"** (live Nairobi time, same computed-state pattern as Home) then line break **"Machakos, Kenya"**.

### 2. Comparison table (Products / Unit / Collection / Best for / Status)
- `data-reveal`, `background:#f5f0e8`, padding `0 clamp(20px,4vw,56px) clamp(56px,7vw,100px)`. Container max-width 1600px, `border-top:1px solid rgba(19,50,64,.2)`.
- **Header row**: `display:grid; grid-template-columns: 3fr 2fr 2fr 2fr 1fr; gap:24px`, padding `14px 0`, `border-bottom:1px solid rgba(19,50,64,.16)`, mono 10px letterspacing .2em uppercase `rgba(19,50,64,.45)`. Columns: **Product**, **Unit**, **Collection**, **Best for**, **Status** (right-aligned).
- **Three data rows**, each an `<a class="nn-row">` (hover background `rgba(19,50,64,.045)`, transition `.4s cubic-bezier(.22,1,.36,1)`), same 5-col grid, padding `26px 0`, `border-bottom:1px solid rgba(19,50,64,.16)` (last row's border is `.2` opacity instead of `.16`, slightly darker to close the table), `align-items:center`:
  1. → `Table-Eggs.dc.html`. Product cell: 26×3px gold tick + **"01  Table Eggs"** (`clamp(20px,2vw,28px); 600; letter-spacing:-.02em`, note the two literal `&nbsp;` spaces between number and name in source). Unit: **"30pc tray"**. Collection: **"Daily, from 2 PM"**. Best for: **"Households · Bakeries"**. Status: **"Available"** (`color:#4a7c59`, right-aligned).
  2. → `Poultry-Manure.dc.html`. 26×3px sage tick + **"02  Poultry Manure"**. Unit: **"70kg sack"**. Collection: **"Pickup or bulk delivery"**. Best for: **"Gardeners · Farms"**. Status: **"Available"**.
  3. → `Ex-Layer-Hens.dc.html`. 26×3px terracotta tick + **"03  Ex-Layer Hens"**. Unit: **"Live bird / bulk lot"**. Collection: **"At the farm"**. Best for: **"Caterers · Bulk buyers"**. Status: **"Available"**.
- Component reuse: this is a bespoke "comparison table" row pattern, related to but distinct from the Design System's "Product metadata table" pattern (that one is label/value stacked pairs within a single product's chapter; this one is a full-width sortable-looking row-per-product table with a leading color tick and trailing status badge). Implement as its own `ComparisonTableRow` component, reusable for the tick-color + status-dot idiom used elsewhere.
- Mobile: the `3fr 2fr 2fr 2fr 1fr` grid is NOT one of the two patterns targeted by the page's own media-query override (`repeat(12,1fr)` / `repeat(3,1fr)`), so on ≤900px this table's columns do not automatically collapse via the prototype's blunt override — this is likely an oversight in the prototype ports poorly to narrow screens as-is. **Recommend implementing a genuinely responsive stacked-row layout for mobile** (e.g., product name + tick on one line, then unit/collection/best-for/status as a 2-col label:value mini-list) rather than porting the fixed 5-column grid verbatim below 900px.

### 3. Product Chapter 1 — Table Eggs (`<article data-chapter="" id="table-eggs">`)
- `background:#f5f0e8`, `border-top:1px solid rgba(19,50,64,.16)`.
- 12-col grid, gap `clamp(24px,4vw,64px)`, `align-items:center`, padding `0 clamp(20px,4vw,56px)`.
- Text col `1/span 5`, padding `clamp(56px,7vw,118px) 0`:
  - Eyebrow row: 34×2px gold rule + **"01 / Table Eggs"** (mono 11px, `rgba(19,50,64,.55)`).
  - H2 (`clamp(36px,4.6vw,68px); 700; line-height:.96; letter-spacing:-.035em`, margin-bottom 22px): **"Fresh eggs,<br />collected daily."**
  - Body (18px, line-height 1.65, `rgba(19,50,64,.68)`, max-width 42ch, margin-bottom 32px): **"Our most-asked-for product. Collected from the layer house daily and inspected for shell integrity and size consistency before packing. Mixed grade — large and medium in the same tray."** (Note: longer/different copy than Home's chapter — this is the Products-page-specific version, do not reuse Home's paragraph here.)
  - **Tag pills** (flex wrap, gap 10px, margin-bottom 34px), each mono 10px letterspacing .16em uppercase `border:1px solid rgba(19,50,64,.24)` padding `8px 13px`: **"Collected daily"**, **"30pc trays"**, **"Households + businesses"**.
  - CTA row (flex gap 14px wrap): primary "Order Table Eggs →" (`background:#133240; color:#f5f0e8; padding:18px 30px; font-size:16px; font-weight:600`) → `Order-Flow.dc.html`; secondary text link "Full dossier →" (mono 11px, letterspacing .18em, uppercase, `#c0613b`, `border-bottom:1px solid rgba(192,97,59,.4)`, `align-self:center`) → `Table-Eggs.dc.html`.
- Image col `7/span 6`, `align-self:stretch`, inner `display:grid; grid-template-columns: 2fr 1fr; gap:16px`, padding `clamp(24px,3vw,48px) 0`:
  - Left (2fr): class `nn-zoom`, `min-height:clamp(280px,36vw,540px)`: `public/eggs.jpeg`, alt "Fresh N&N table eggs" (Editorial role).
  - Right (1fr), flex column gap 16px, two stacked cells:
    - Top cell: centered product cutout, padding 3%: `public/norm/table-eggs.png`, alt "A 30pc tray of table eggs", `object-fit:contain` (Product cutout role, uses the pre-normalized `public/norm/` asset per Design System rules).
    - Bottom cell: `background:#133240`, padding 22px, flex column `justify-content:flex-end`. Big stat number (42px, 800, letter-spacing -.03em, `color:#eccc74`): **"30"**. Label (mono 10px, letterspacing .18em, uppercase, `rgba(245,240,232,.55)`, margin-top 8px): **"Eggs per tray"**.
  - This 2fr/1fr image + stacked-cutout-and-statblock layout is the **Product gallery**-adjacent pattern (related to Design System's "Product gallery" pattern but simplified to 2 cells rather than a hero + 3-thumb strip). Reuse this exact `image / [cutout-over-statblock]` layout for all three chapters on this page (mirrored for chapter 2).

### 4. Product Chapter 2 — Poultry Manure (`<article data-chapter="" id="poultry-manure">`)
- `background: rgba(122,158,126,.1)` (sage tint), `border-top` hairline.
- **Layout mirrored**: image block is col `1/span 6` (image+cutout on the LEFT this time), text col `8/span 5` (RIGHT) — alternating rhythm matching Home's chapter pattern.
- Image col `1/span 6`, inner grid `1fr 2fr` (cutout/stat FIRST, then photo — reversed order from chapter 1's `2fr 1fr`), padding `clamp(24px,3vw,48px) 0`:
  - Left (1fr), flex column gap 16px: top cell centered cutout `public/norm/manure-bags.png`, alt "70kg sacks of poultry manure"; bottom cell `background:#133240` stat block — number **"70kg"** (`color:#7a9e7e`), label **"Standard sack"**.
  - Right (2fr): class `nn-zoom`, `public/manure-hips.jpeg`, alt "Poultry manure drying in the sun".
- Text col `8/span 5`, padding `clamp(56px,7vw,118px) 0`:
  - Eyebrow row: 34×2px sage rule + **"02 / Poultry Manure"**.
  - H2: **"What the barn<br />gives the soil."**
  - Body (max-width 42ch, margin-bottom 32px): **"A potent source of nitrogen, phosphorus and potassium that improves soil structure as well as feeding the crop. Dried naturally, nothing added, ready to apply straight to soil."** (Products-page-specific copy, distinct from Home's manure chapter paragraph.)
  - Tag pills: **"Fully organic"**, **"70kg sacks · FH truck"**, **"≈50–80 m² per sack"**.
  - CTA row: primary "Order Manure →" → `Order-Flow.dc.html`; secondary "Full dossier →" → `Poultry-Manure.dc.html`.

### 5. Product Chapter 3 — Ex-Layer Hens (`<article data-chapter="" id="ex-layer-hens">`)
- `background:#f5f0e8`, `border-top` hairline. Layout matches chapter 1's orientation (text left col `1/span 5`, image right col `7/span 6`, inner image grid `2fr 1fr`).
- Text col `1/span 5`:
  - Eyebrow row: 34×2px terracotta rule + **"03 / Ex-Layer Hens"**.
  - H2: **"The end of<br />a good cycle."**
  - Body (max-width 42ch): **"Birds offered at the end of their peak laying cycle — healthy, well-fed and under regular veterinary supervision. Firmer meat, favoured for slow-cooked traditional dishes and soup bases."** (Products-page-specific copy — richer than Home's equivalent paragraph; note it adds "and soup bases" not present in Home's chapter.)
  - Tag pills: **"Vet-inspected"**, **"Sold live at the farm"**, **"Bulk lots available"**.
  - CTA row: primary "Enquire on Hens →" → `Order-Flow.dc.html`; secondary "Full dossier →" → `Ex-Layer-Hens.dc.html`.
- Image col `7/span 6`, inner grid `2fr 1fr`:
  - Left (2fr): class `nn-zoom`, `public/layers.jpeg`, alt "Layer hens at the end of their cycle".
  - Right (1fr): top cutout `public/norm/ex-layer-hen.png`, alt "An ex-layer hen"; bottom stat block — number **"72–80"** (`color:#c0613b`), label **"Weeks of age"**.

### 6. Final CTA ("Ready when you are")
- `data-reveal`, `background:#133240; color:#f5f0e8`, padding `clamp(80px,11vw,170px) clamp(20px,4vw,56px)`.
- 12-col grid gap 32px, `align-items:end`.
  - Col `1/span 7`: eyebrow **"Ready when you are"** (mono 11px, letterspacing .22em, uppercase, `#eccc74`, margin-bottom 30px). H2 (`clamp(38px,5.6vw,88px); 800; line-height:.92; letter-spacing:-.038em`, margin-bottom 28px): **"Know what you need?<br />Let's get it to you."** Paragraph (20px, line-height 1.6, `rgba(245,240,232,.65)`, max-width 44ch): **"Most orders are settled in a few messages — quantity, area, and the next slot on the morning route."**
  - Col `9/span 4`: flex column gap 16px:
    - "Order on WhatsApp →" (`background:#f59268; color:#133240; padding:24px 28px; font-size:18px; font-weight:600`) → `Order-Flow.dc.html`. **Note the button label here is "Order on WhatsApp" — different wording from Home's "Order Fresh Eggs" CTA — preserve this page-specific label, do not normalize it to match Home.**
    - "Talk to N&N →" outline button (`border:1px solid rgba(245,240,232,.3); color:#f5f0e8`) → `Contact.dc.html`. (Also distinct wording from Home's "Talk to us".)
    - Mono line (11px, letterspacing .14em, uppercase, `rgba(245,240,232,.45)`, margin-top 8px): **"Mon–Sat delivery · Sat slots fill early"**.

### Footer
`<dc-import name="SiteFooter" hint-size="100%,420px">` — identical shared component, see Global Tokens section.

---

## Cross-page component inventory (for shared component extraction in the real build)

| Component | Used on | Notes |
|---|---|---|
| `SiteHeader` | Home (transparent→solid on scroll), Products (`variant="solid"`, always cream) | Needs `variant` and `active` props |
| `SiteFooter` | Both, identical | Static content, minus the two prototype-only utility links |
| Mobile full-screen menu (`#nn-menu`) | Both (part of header) | Same 5 nav links, same CTA |
| `.nn-zoom` / hover-zoom image wrapper | Both, many places | 1.06 scale, 1.3s ease on Home / 1.2s per Design System — Home's own CSS says 1.3s, treat 1.3s as authoritative for these two pages |
| `.nn-arrow` CTA button (primary orange, secondary outline, tertiary text-link) | Both | 3 visual variants: filled orange, outlined, mono text-link with underline |
| Product metadata table (label:value rows) | Home (3 product chapters), Design System §07 | Label at 50% opacity, value full, right-aligned |
| Comparison table row (`.nn-row`) | Products only | Distinct from metadata table — full row per product with tick + status |
| Product chapter (eyebrow + H2/H3 + body + tags/table + dual CTA + image) | Home (3x, simpler — table only, no tag pills) and Products (3x, tag pills + table-like image/cutout/stat block) | **Home and Products chapters are NOT identical** — Home uses only the metadata table; Products additionally has tag pills AND a cutout+stat-block image treatment. Do not collapse into one shared component without a variant prop for these differences. |
| Stat block (dark cell, big number + mono label) | Home (4x in "day in numbers"), Products (3x in each chapter's image grid, colored per product) | Products' version sits inside the image grid and uses the product's accent color for the number instead of always gold |
| Testimonial (dominant quote + attribution) | Home only (Trust section) | Also documented as a generic pattern in Design System |
| Article card | Home only (Education teaser) | Two size variants: span-6 (large) and span-3 (small), different title font sizes |
| Gallery figure (aspect-ratio image + mono caption) | Home only (nine-frames gallery) | Asymmetric column placement, must preserve exact grid-column values per tile |
| Farm status bar (blinking dot + label list) | Home hero footer strip, Products hero status block | Slightly different layouts (horizontal bar vs. stacked block) but same status-dot + mono-label idiom |
| Live "Updated HH:mm EAT" timestamp | Home hero status bar, Products hero status block | Both computed client-side via `Intl.DateTimeFormat` in Africa/Nairobi timezone, `hour12:false` |
| `data-reveal` scroll-reveal wrapper | Both, most sections | Shared IntersectionObserver hook/component, translateY(28px)→0 + opacity 0→1, 1s cubic-bezier(.22,1,.36,1) |

## Open items / things not fully specified in the prototype
- The founder-quote image caption on Home explicitly states the founder portrait has not been photographed yet and flock imagery is a placeholder stand-in — flag to content/photography team before launch.
- The Home gallery section headline promises "nine frames" but only 4 images are implemented in the prototype — either source 5 more real photos or adjust the copy before shipping.
- The Products comparison table's fixed 5-column grid has no mobile-specific stacking rule in the prototype's own CSS overrides — needs a real responsive treatment in the production build (recommendation given above).
- `SiteHeader`/`SiteFooter` are referenced via `<dc-import>` (prototype-tool component imports) on Products.dc.html but hand-inlined on Home.dc.html — confirms they are meant to be one shared component across the whole site; use Home's inlined markup as the literal source of truth for what SiteHeader/SiteFooter must render since Products' `<dc-import>` is an opaque reference in the static export.
