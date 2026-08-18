# N&N Poultry Palace — Fresh Build Brief

**Read this before touching any code.** This corrects a mistake from a prior session — get the source-of-truth boundary right before doing anything else.

**Status: the build exists.** This is no longer a greenfield brief. `nn-poultry-fresh/` now holds a working Next.js implementation of every page in the prototype. Incoming work is fidelity correction and feature completion against `nnpoutry/`, not a fresh scaffold. Jump to [Current build state](#current-build-state) for what is already there and [Layout gotchas](#layout-gotchas-learned-the-hard-way) for the traps that have already cost a session.

## The one rule that matters

- **Design source of truth: `C:\Users\fredd\Projects\Websites\nnpoutry\` — ALL of it, pixel- and interaction-level.** Every page, every spacing value, every motion timing in the 15 `.dc.html` files + `motion.js` is the spec. Not inspiration, not a vibe check — the spec.
- **`C:\Users\fredd\Projects\nn-poultry-palace\N-Npoultry` is reference-only.** Pull real business facts from it (see below — most are already extracted into this brief so you may not even need to open it). Do **not** copy its component architecture, its visual system, or its file structure. Do **not** edit anything in that folder — it is explicitly frozen (see `FROZEN.md` at its root for why).
- **Build fresh, here**, in `C:\Users\fredd\Projects\Websites\nn-poultry-fresh\` (this folder). The build now lives here, so treat the folder as established rather than provisional.

## What went wrong last time (so you don't repeat it)

A prior session was given a generic "final production implementation" prompt (`Websites\prompt.md`) that said to treat the existing Next.js repo as the "functional source of truth" and merge it with the prototype. It ran with that literally and edited `N-Npoultry`'s live components directly (Navbar, Contact, product pages, added a new order-flow component, deleted some dead code, etc.) — real, uncommitted changes now sitting in that repo's working tree, frozen and unreverted.

Fredrick's actual intent, stated directly: `nnpoutry/` is the **only** design source of truth, and this is a **fresh build in a new folder** — not a translation into the old repo. If `prompt.md` or anything else implies otherwise, this brief overrides it.

## The prototype package (`nnpoutry/`)

| File | Covers |
|---|---|
| `Design-System.dc.html` | Colors, type scale, spacing rhythm, motion tokens, component patterns (buttons, FAQ rows, gallery, order-step indicator, form success state) |
| `SiteHeader.dc.html` / `SiteFooter.dc.html` | Reusable header/footer, `variant`/`active` props, mobile menu |
| `Home.dc.html` | Homepage: hero, farm stats, product chapters, process strip, gallery, founder quote, testimonials, education teaser, final CTA |
| `Products.dc.html` | Products index: comparison table + 3 product chapters |
| `Table-Eggs.dc.html` / `Poultry-Manure.dc.html` / `Ex-Layer-Hens.dc.html` | One shared product-detail template (hero + gallery, "what it is", why customers choose it, process strip, details/who-it's-for, FAQ accordion, cross-sell) — reuse one layout, don't fork three |
| `About.dc.html` | Origin timeline, "the name" story, values, scroll-synced operations timeline, testimonials |
| `Inside-the-Farm.dc.html` | Education hub index: featured article + category filter + article grid |
| `Article.dc.html` | Article template: reading-progress bar, sticky fact rail, pull-quote, authorNote/farmerTip callouts, related articles |
| `Contact.dc.html` | Live open/closed status, 3 "route" cards (WhatsApp/Call/Email), form, "where we deliver" section |
| `Order-Flow.dc.html` | The 5-step WhatsApp order concierge (Product→Quantity→Delivery→Note→Review) — this is the site's primary conversion mechanism, get it right |
| `Mobile.dc.html` | Mobile recomposition rules per screen — read this before assuming desktop layouts just stack |
| `Motion.dc.html` + `motion.js` | Motion spec: duration/easing tokens, reveal/mask/hero-sequence/parallax/chapter/timeline patterns. Port the *concepts*, not the vanilla-JS/`MutationObserver` implementation. Already ported into `src/lib/motion.ts` + `src/components/motion/` |

**Known internal inconsistencies in the prototype** (worth normalizing to one value rather than porting the inconsistency): motion.js's documented duration tokens vs. some pages' hardcoded inline values drift slightly (e.g. hero settle 1100ms token vs 2.4s used inline); `Design-System.dc.html` uses a 1440px container while every real page uses 1600px; the type scale in `Design-System.dc.html` is the one to trust. The prototype's own font choice ("Made Tommy") is explicitly flagged inside `Design-System.dc.html` as a placeholder stand-in with no real licensed files — do not chase that font. Resolved: the build uses Outfit + IBM Plex Mono, which match the prototype's effective rendering.

**No dedicated `Wholesale-Business.dc.html` or `Delivery-Areas.dc.html` exists.** Delivery-area content is spec'd inline across Home/About/Contact/Order-Flow (6 named zones, consistent everywhere). Wholesale is only scattered signals (a testimonial, a form dropdown option, a "30 — wholesale" quantity preset in Order-Flow) — there's no dedicated wholesale page in the approved design, so don't invent one unless Fredrick asks.

## Real business facts (extracted, so you don't have to reverse-engineer them)

- **Name:** N&N Poultry Palace. **Tagline:** "Fresh and Nutritious — your trusted source for farm-fresh eggs in Machakos."
- **Phones:** 0113377623, 0714246534. **WhatsApp:** 254113377623. **Email:** palacepoultryn.n@gmail.com. **Address:** Machakos, Kenya.
- **Hours:** Mon–Fri 8:00 AM–5:00 PM, Sat 8:00 AM–12:00 PM.
- **Vision:** "To be East Africa's leading provider of sustainable quality poultry products." **Mission:** "Driving progress in the poultry industry while uplifting the economies that sustain it."
- **Founder story:** The Kyalos family, started 2021 as a backyard broiler project during COVID/lockdown, pivoted to layers in 2022, trained via Kenchic seminars/farm visits. Business name "N&N" comes from the founders' two daughters.
- **Delivery zones (all six, used consistently everywhere):** Machakos Town, Syokimau, Athi River, Mlolongo, Katoloni, Mwala.
- **Freshness promise:** "Collected at 2 PM. Packed by 5 PM. On your doorstep before noon."
- **Products:**
  1. **Table Eggs** (gold accent `#eccc74`) — 30pc trays, Mixed Grade (Large & Medium), daily collection, Mon–Sat delivery, breakage replaced at delivery, minimum 1 tray.
  2. **Poultry Manure** (sage accent `#7a9e7e`) — 70kg sacks, naturally sun-dried, N-P-K rich, covers ~50–80 sq m/sack, pickup or bulk delivery.
  3. **Ex-Layer Hens** (terracotta accent `#c0613b`) — 72–80 weeks, fully vaccinated/vet-inspected, primarily farm pickup, bulk lots for businesses.
- **Real named testimonials exist** (Wanjiru M./Syokimau, Chef Kamau J./Machakos Town restaurant owner, Amina S./Athi River kiosk owner, David K./Mlolongo wholesale distributor, Sarah L./Katoloni) — pull exact wording from `nnpoutry/`'s pages, don't paraphrase.
- **Education Hub:** 3 categories (The Chick Journey / Growth & Care / Product Excellence), 6+ articles with distinctive `authorNote`/`farmerTip` voice — these two elements are the brand's strongest authenticity signal, verbatim per `Inside-the-Farm.dc.html`/`Article.dc.html`.
- **No pricing is published anywhere** — price-via-WhatsApp is a deliberate business decision, not a gap. (The frozen `N-Npoultry` repo has since added price ranges/tiers to its product data — that's real data if Fredrick wants it, but confirm before assuming it should carry over; it wasn't part of the original approved prototype's constraint.)
- **Full color palette:** gold `#eccc74`, orange `#f59268`, cream `#f5f0e8`, soil `#8b5e3c`, sage `#7a9e7e`, terracotta `#c0613b`, straw `#d4a847`. **`dark`/`darkDeep` are black, not the prototype's navy** — see deviation #4 below.

## Real photography

`nnpoutry/public/` has the real farm photography referenced by the prototype (eggs, layers, manure, ex-layer hens, farm gallery shots, logo). The frozen `N-Npoultry` repo's `public/` folder has largely the same real assets (same filenames — `eggs.jpeg`, `layers.jpeg`, `manure-hips.jpeg`, etc.) plus a few extras (`og-image.png`, `upscaled-video.mp4`). Reusing real photography is fine and expected — it's not "the old design," it's just real photos of a real farm. Just don't reuse the *components* those photos were wired into.

## Current build state

### Stack (decided, in place)

| Layer | Choice |
|---|---|
| Framework | Next.js 16.3.1 (App Router, Turbopack dev) |
| Runtime | React 19.2.8, TypeScript 5 |
| Styling | Tailwind CSS v4 via `@theme` in `src/app/globals.css`, plus inline styles where the prototype's values are literal (clamps, exact px) |
| Type | `next/font/google`: Outfit 300–800 (display) + IBM Plex Mono 400–600 (mono). "Made Tommy" is ignored on purpose, per the placeholder note above |
| Content | Sanity (`studio/`) for testimonials and education articles, with full static fallbacks in `src/lib/*-data.ts`. Everything else is static |
| Motion | Hand-rolled IntersectionObserver components in `src/components/motion/`, tokens in `src/lib/motion.ts`. **No GSAP, no Framer Motion** |

`gsap` is still listed in `package.json` but is not imported anywhere. Remove it, or use it deliberately, rather than leaving it ambiguous.

### Design tokens (`src/app/globals.css`)

Colors are the full palette above under `@theme` (`--color-dark`, `--color-gold`, etc.), container is `--container-site: 1600px` (the 1600 from the real pages, not Design-System's 1440), and motion lives on `:root` as `--ease-editorial` / `--ease-micro` and `--duration-micro|ui|editorial|hero|sequence` / `--stagger`, mirroring `src/lib/motion.ts` (200 / 340 / 650 / 1100 / 1600ms, stagger 90ms). Both copies exist because CSS animations need the variables and the JS observers need the numbers. **Change them together or they drift.**

### Routes implemented

`/`, `/products`, `/products/[slug]`, `/about`, `/inside-the-farm`, `/inside-the-farm/[slug]`, `/contact` (`force-dynamic`, for the live open/closed status), `/order`, `/privacy`, `/terms`.

Legal pages exist despite being out of scope in the original prototype brief. They are minimal and self-authored, not prototype-derived. Treat them as placeholders, not as spec-backed pages.

### Component map

- `components/motion/` — `Reveal` (generic scroll reveal) and `Chapter` (ports `motion.js`'s `armChapter`: accent rule grows from zero, lead image settles from `scale(1.05)`, block fades in).
- `components/ui/` — `ArrowButton`, `Container`, `EyebrowRule`/`SectionEyebrow`, `MetaTable`/`TagPills`, `StatusDot`, `ZoomImage`, `useNairobiTime`.
- `components/home/` — `HomeHero` (parallax 24px + `nn-hero-settle`), `HomeProductChapter`.
- `components/products/` — `ProductsFullChapter`, `detail-template` (the one shared template behind all three product pages), `gallery`, `hero-status`.
- `components/about|contact|education|order/` — operations timeline, contact form + open status, article grid + reading progress, the 5-step order wizard.

### Deliberate deviations from the prototype

These are intentional. Do not "fix" them without a reason.

1. `Chapter` clears its inline image `transform` once the settle finishes, so the CSS hover-zoom still works. The prototype leaves the inline transform in place, which would outrank `:hover`.
2. The Products comparison table gets a mobile card layout the prototype does not have.
3. Duration tokens follow `motion.js`, except the hero settle, which keeps the pages' inline `2.4s`.
4. **Brand color is black, not the prototype's dark navy.** Fredrick confirmed real brand colors are black and gold, so `--color-dark` (`#133240`→`#111111`) and `--color-dark-deep` (`#0f2833`→`#000000`) — plus every `rgba(19,50,64,X)` literal across `src/` — were rebranded to near-black/black. Don't port the navy back from `nnpoutry/`; the prototype is stale on this one point.
5. **Primary CTA buttons use a gold→orange gradient, not solid orange.** `ArrowButton`'s `primary` variant, plus the contact form submit button and the order wizard's WhatsApp CTA, use `linear-gradient(to right, var(--color-gold), var(--color-orange))` instead of flat `var(--color-orange)`. Non-button uses of `var(--color-orange)` (text color, form error states, status dots) are unaffected — only button backgrounds changed.
6. **Header FAQ "peek" is a single fixed tab, not link-targeted.** After iterating on a design that positioned the peek relative to the Products/About nav links, it was simplified to one fixed tab at the header's far right, below the navbar border. Peek is visible 4.2s, with a 5s gap between cycles (see `FAQ_PEEK_GAP_MS`/`FAQ_PEEK_VISIBLE_MS` in `site-header.tsx`). Don't reintroduce per-link positioning.
7. **"Full details" link removed from product chapters.** `ProductsFullChapter` (used by all three products on `/products`) now renders only the primary CTA button — no secondary "Full details" text link, and `dossierHref` was removed from the component and its call sites. The visually distinct "Full details" button on `inside-the-farm/[slug]` article cross-sell pages is a different context and was deliberately left alone.

## Layout gotchas (learned the hard way)

Product chapters are a 12-column grid with explicit `col-start` on both children. Three separate bugs came out of that, all already fixed. Re-read this before editing `home/product-chapter.tsx` or `products/full-chapter.tsx`.

1. **DOM order must match the prototype, not the visual order.** CSS Grid sparse auto-placement advances to the next row whenever an item's explicit `col-start` sits behind the placement cursor. Emitting text (`col-start-8`) before image (`col-start-1`) silently pushed the image into row 2 and left a large empty block. Both components now emit the image first when `imageSide === "left"`, matching `Products.dc.html`. Mobile ordering is preserved with `order-first md:order-none`, applied **only** where the image is second in DOM.
2. **Image columns need `self-stretch`.** The wrapper grid is `items-center`, so without it the image column collapses to content height instead of matching the text column.
3. **Chapters are full-bleed outside, capped inside.** The prototype puts background and border on the `<article>` and nests a separate `max-width: 1600px; margin: 0 auto` grid inside it. Collapsing those into one element caps the background too.

Also: the photo block's `minHeight` is `clamp(280px, 36vw, 540px)`. It was `260px` at one point, which rendered the photos at roughly half height at 1600px wide.

## Verification

Prefer cheap checks over screenshots. `npx tsc --noEmit` catches most regressions; for layout, `browser_evaluate` returning numeric bounding boxes (do both columns share a `top`? do they have equal heights?) is faster and more conclusive than looking at an image. Full-page screenshots are actively misleading here: IntersectionObserver reveals do not fire without real scrolling, so sections render blank and look broken when they are not.

Dev server on Windows: run it with `dangerouslyDisableSandbox: true` and log to the scratchpad. Turbopack hits `memory allocation failed` under the sandbox's limit.

## Still open

1. **Does this replace the live site**, or run in parallel until it's ready?
2. **Pricing.** Still unpublished, per the prototype's deliberate price-via-WhatsApp decision. The frozen repo has real price ranges if that decision ever changes.
3. **Legal pages.** Currently placeholder text. Confirm whether real privacy/terms copy is needed before launch.
4. **Sanity content.** The schema is deployed and the queries are wired, but the static fallbacks are what actually render until documents exist. Confirm who is populating the studio.

## Do not

- Do not open `C:\Users\fredd\Projects\nn-poultry-palace\N-Npoultry` expecting to extend or restyle it — it's frozen.
- Do not treat `Websites\prompt.md` (the generic "final production implementation" template) as authoritative for this build without checking with Fredrick first — it's what caused the original mix-up.
- Do not invent business facts, stats, or certifications not listed above or in `nnpoutry/`.
- Do not burn a session on Playwright screenshots to confirm fidelity. Read the `.dc.html`, diff it against the component, fix the component. Measure numerically if you need proof.
- Do not add a dependency for something already solved in `src/lib/motion.ts` or `src/components/motion/`.
