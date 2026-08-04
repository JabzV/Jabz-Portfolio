# Dark Mode — Overview

- **File:** `h3RHMC2cHOWAzKUW743IOO`
- **Frame:** `4:3` "Dark Mode"
- **Dimensions:** 1440 × 7580 px (single desktop frame only)
- **Reference screenshot:** `docs/design/screens/dark-mode-full.png` (1440 × 7580, 1:1 px)
- **Assets:** `public/figma/` (19 files)

## Token situation — READ THIS FIRST

**There are no Figma variables.** `get_variable_defs` on `4:3` returns `{}`. There are also **no Figma
components, no component instances, and no auto-layout anywhere in the frame**. Every value in this
design is a hardcoded hex or px literal, and every element is absolutely positioned as a direct child
of the root frame.

Consequences for `token-architect`:
- The colour/type/spacing scale below is **reverse-engineered by me from raw literals**, not extracted
  from a designer-authored token set. Names are my proposal, not the designer's.
- There is no light-mode counterpart in this frame (the hero links to "View it in light mode
  (Professional Mode)", but that frame is outside this node — see Uncertainties).
- Nothing in the design constrains a spacing scale. Offsets are arbitrary (51, 53, 68, 71, 96, 129…).
  Do not invent a 4pt/8pt scale and claim it came from Figma.

Consequences for `component-builder`:
- **Do not reproduce absolute positioning.** 7580 px of `absolute`/`top-[Npx]` is unmaintainable and
  will not respond. Each section spec names the flow/flex/grid structure that should replace the
  coordinates, and states which coordinates are load-bearing (real design intent) vs incidental.
- There are no breakpoints in the design. Responsive behaviour below 1440 is **undesigned** — every
  spec flags this, and the orchestrator must get a user decision rather than let builders improvise.

## Fonts — BLOCKER

Three non-system families are used. **None is wired up in the project.**

| Family | Used for | Weights seen | Loader | Status |
|---|---|---|---|---|
| `SDDystopianDemo` | all display/heading text | Regular only | `next/font/local` | **BLOCKER** |
| `Glitch Goblin` | nav items, body accent paragraphs, button labels | Regular only | `next/font/local` | needs file + licence check |
| `General Sans` | body copy, BIO card, quotes, katakana, footer | Regular, Semibold | `next/font/local` | Fontshare — free, but not on Google Fonts |

### `SDDystopianDemo` — BLOCKER, must be resolved before Phase 3

The name carries the `Demo` suffix that foundries use for free trial cuts. Demo/trial fonts are
**normally licensed for personal/mockup use only and explicitly exclude webfont embedding** — shipping
the `.woff2` would be redistribution. This affects *every heading on the page* (116, 112, 92, 72, 48,
38, 28, 22 px), so it cannot be worked around locally.

Resolution requires a **user decision**, one of:
1. Purchase the full commercial + webfont licence for the retail version of the family.
2. Substitute a licensable display face with comparable proportions (condensed, squarish, techno).
3. Ship it anyway — **not recommended**, and not a call any agent should make.

I did not install, download, or vendor any font file.

### `Glitch Goblin`

No foundry/licence information is available from the Figma data — the design context reports only the
family name and `Regular` style. Availability, source, and licence terms are `UNKNOWN`. If a file is
obtained, `next/font/local` is the correct loader (it is not a Google Font).

### `General Sans`

Published by Indian Type Foundry via Fontshare, free for commercial use including webfonts. It is
**not** in the Google Fonts catalogue, so `next/font/google` will not resolve it — use
`next/font/local` with self-hosted `.woff2` for `Regular` (400) and `Semibold` (600).

### Font-size inventory (every distinct size on the page)

| px | Family | Where |
|---|---|---|
| 8 | General Sans Regular | BIO card "Graduated" microlabel |
| 12 | General Sans Regular | "View it in light mode", hero "© Jabez Joshua Vestidas" |
| 14 | General Sans Regular / Semibold | WARNING paragraph, BIO card body, quotes, resume link |
| 14 | SDDystopianDemo | "Linkedin" / "instagram" captions |
| 18 | General Sans Regular | experience date strings |
| 20 | Glitch Goblin | nav items (About / WORK / Contact) |
| 20 | General Sans Semibold | BIO card "BIO", "Jabez Vestidas" |
| 22 | SDDystopianDemo | `//n` project numbers, role subtitles, `[ n ]`, `(Insert LOGO)` |
| 24 | Glitch Goblin | button labels, services descriptions, contact values, tagline |
| 24 | General Sans Regular | footer copyright |
| 28 | Glitch Goblin | section subtitles (featured work, experiences) |
| 28 | SDDystopianDemo | experience company names |
| 38 | Glitch Goblin | the "9" in "J9 DESIGN AND BUILD" |
| 38 | SDDystopianDemo | contact row labels (Email / Contact / Alt Contact) |
| 48 | General Sans Regular | katakana columns |
| 48 | SDDystopianDemo | project titles, services titles |
| 54 | Glitch Goblin | intro statement |
| 72 | SDDystopianDemo | hero headline, "EXPERIENCES" |
| 92 | SDDystopianDemo | "LET'S WORK TOGETHER" |
| 112 | SDDystopianDemo | "FEATURED WORK", "SERVICES" |
| 116 | SDDystopianDemo | vertical "JABZ VESTIDAS" ×3, marquee |

`line-height` is `normal` (i.e. font default) for every text node **except** the katakana columns
(40 px and 48 px respectively) — see `01-hero.md`. No `letter-spacing` is set anywhere on the page;
all tracking is the font default.

## Colour inventory (every colour, with role)

| Hex | Proposed token | Role |
|---|---|---|
| `#11141c` | `--color-bg` | page background; also empty experience cards, the four 45° diamond accents, and the notch cut-outs inside the project placeholder |
| `#9c2222` | `--color-accent` | hero red panel (453×801); "MORE ABOUT ME" button |
| `#1a0303` | `--color-surface-filled` | the three filled experience cards |
| `#4c4c4c` | `--color-border-card` | 1px border on all six experience cards |
| `#363636` | `--color-rule` | every horizontal rule and contact-row underline (the `Line 1` / `Line 9` SVG stroke) |
| `#f8eeee` | `--color-display` | vertical "JABZ VESTIDAS" and the marquee |
| `rgba(248,238,238,0.49)` | `--color-display/49` | 2nd layered "JABZ VESTIDAS" |
| `rgba(248,238,238,0.06)` | `--color-display/6` | 3rd layered "JABZ VESTIDAS" |
| `#ffffff` | `--color-fg` | most headings and body copy; BIO card background; nav toggle circle |
| `#000000` | `--color-fg-inverse` | BIO card borders, BIO card text, black label bar |
| `#8d8d8d` | `--color-fg-muted` | Glitch Goblin paragraphs (intro, subtitles, services descriptions, contact values, tagline) |
| `#868686` | `--color-fg-subtle` | `//n` numbers and experience role subtitles |
| `#c75057` | `--color-accent-soft` | experience date strings |
| `#e4e4e4` | `--color-button-light` | "VIEW PORTFOLIO" rect; "CONTACT ME DIRECTLY" notched shape |
| `#d9d9d9` | `--color-placeholder` | project-image placeholder rect; contact `Subtract` shape fill |

One effect is used, on the four 116 px display texts only:
`text-shadow: 0px 4px 4px rgba(0,0,0,0.25)`.

Two background images run at `opacity: 0.10` (cityscape, contact texture). No other opacity, blur,
blend mode, or gradient appears anywhere.

## Asset inventory

All in `public/figma/`. Format was determined by sniffing the downloaded bytes, not guessed.

| File | Type | Natural size | Used by |
|---|---|---|---|
| `hero-cover.png` | PNG | 1440×801 | hero cover image |
| `hero-image-2.png` | PNG | 272×275 | hero decorative, over red panel |
| `hero-image-3.png` | PNG | 379×33 | hero decorative strip |
| `hero-arrow-glyph.png` | PNG | ~140×83 | hero glyph, 4 instances at 3 sizes |
| `hero-badge-glyph.png` | PNG | 106×109 | hero right-side glyph |
| `social-linkedin.svg` | SVG | 100×100 | LinkedIn block |
| `social-instagram.svg` | SVG | 100×100 | Instagram block |
| `icon-sun.png` | PNG | 24×24 | light-mode toggle glyph |
| `nav-toggle-ellipse.svg` | SVG | 41×41 | white circle behind sun — **replace with CSS** |
| `icon-arrow-outward.svg` | SVG | 12×12 | BIO card arrow |
| `texture-scanline.png` | PNG | (cropped) | two hero/intro texture crops |
| `cityscape-bg.jpg` | JPEG | 1440×881 box | intro background at 10% |
| `contact-bg-texture.jpg` | JPEG | 1440×1274 box | contact background at 10% |
| `rule-line-1.svg` | SVG | 1334×1 | all 14 horizontal rules — **replace with CSS** |
| `contact-row-underline.svg` | SVG | 528×1 | 3 contact-row underlines — **replace with CSS** |
| `project-placeholder.svg` | SVG | 766×248 | all 4 featured-work images — **placeholder, not art** |
| `button-shape.svg` | SVG | 314.418×60 | "CONTACT ME DIRECTLY" notched button — keep |
| `contact-subtract-shape.svg` | SVG | 381.999×640.354 | contact panel shape — keep |
| `artifact-group-9.svg` | SVG | 32×32 | **empty file, no drawable content** — do not ship |

### Assets that must NOT be shipped as images

| Asset | Actual content | Replace with |
|---|---|---|
| `rule-line-1.svg` | a single `<line stroke="#363636">` | `border-top: 1px solid #363636` on a 1334 px element |
| `contact-row-underline.svg` | a single `<line stroke="#363636">` | `border-top: 1px solid #363636` on a 528 px element |
| `nav-toggle-ellipse.svg` | one `<circle fill="white">` | `<div className="size-[41px] rounded-full bg-white" />` |
| `artifact-group-9.svg` | `<g id="Group 9"><g id="Subtract"></g></g>` — **empty** | nothing; delete the node |

`button-shape.svg` and `contact-subtract-shape.svg` are genuine notched-corner geometry (a single
filled path each) and are legitimately SVG. Either inline them or express them as `clip-path:
polygon(...)`, which would let the fill colour be a token instead of baked into the file.

`project-placeholder.svg` is a `#D9D9D9` rectangle with two `#11141C` triangles punched out of the
corners. It is a **greybox, not a project image** — see defects.

## Design defects — confirmed, NOT fixed

All six items the orchestrator flagged are confirmed in the design context. Do not silently correct
any of them during Phase 3; parity means reproducing them. Each needs a user decision at Phase 6.

1. **All four Services items are numbered `//1`.** Confirmed: nodes `40:29`, `40:53`, `40:60`,
   `40:67` all read `//1`. Should almost certainly be `//1`–`//4`. (Featured Work numbers `//1`–`//4`
   correctly, which makes this clearly an oversight rather than intent.)
2. **All three experience cards contain literal `(Insert LOGO)` placeholder text** at 22 px
   SDDystopianDemo — nodes `40:21`, `40:23`, `40:25`. Real logos do not exist in the file.
3. **All four Featured Work images reuse the same asset.** Nodes `30:5074`, `30:5075`, `30:5080`,
   `30:5085` all point at `Group 5` / `project-placeholder.svg`. There are no real project images
   anywhere in the frame.
4. **Zero-size artifact node `40:75`** — `size-0` with `rotate-90`, wrapping the empty
   `artifact-group-9.svg`. Renders nothing. Leftover scratch node; omit it.
5. **"© Jabez Joshua Vestidas" appears twice** — hero at 12 px General Sans (`22:4371`, y 12) and
   footer at 24 px General Sans (`35:5664`, y 7366). Duplicated content, two different sizes.
6. **The hero cover image overflows the frame.** `13:55` is `left: 216px; top: 1px; width: 1440px`
   inside a 1440-wide frame, so 216 px hangs off the right edge and is clipped. Either the intended
   position is `left: 0`, or the image is intentionally offset and should be narrower. **Which one is
   `UNKNOWN`** — needs the designer.

Additional defects I found that were not in the discovery list:

7. **Two 1 px x-misalignments.** Experience card `30:5108` sits at `left: 1016px` while its column
   mates `30:5100`/`30:5102` sit at `1015px`. Experience content block `40:15` sits at `top: +28px`
   inside its card while `40:9`/`40:8` sit at `+35px`.
8. **The 14 horizontal rules use four different left offsets** — 41, 53, 68, and 71 px — with no
   pattern. `35:5666` (y1842) is at 53, `35:5673` (y6002) at 53, `41:118` (y7349) at 71, the Featured
   Work and Services rules at 68, the four in-Services rules at 41. Almost certainly all meant to be
   68 (or all 41). Builders should pick one gutter and note the deviation rather than encode four.
9. **The 1440-wide marquee container sits at `left: 17px`,** so it extends to 1457 and is clipped by
   the frame. Should be `left: 0`.
10. **`FEATURED WORK` (112 px) is positioned by a hard `left: 605px`** while `SERVICES` (112 px) and
    `LET'S WORK TOGETHER` (92 px) are centred via `left: 50%` + transform. Inconsistent centring
    method; `LET'S WORK TOGETHER` is additionally offset `+18px` off true centre.
11. **Nav items render as `<ul><li className="list-disc">`,** i.e. real bullet-list markup with
    visible discs and a 30 px marker indent. This is likely a Figma list-style artifact rather than
    intended nav design. Confirm with the screenshot before reproducing the bullets.

## Section map

| # | Spec | y-range | Reference crop of `dark-mode-full.png` |
|---|---|---|---|
| 1 | `01-hero.md` | 0–801 | y 0–801 |
| 2 | `02-marquee.md` | 842–927 | y 842–927 |
| 3 | `03-intro.md` | 944–1663 | y 944–1663 |
| 4 | `04-featured-work.md` | 1842–3291 | y 1842–3291 |
| 5 | `05-experiences.md` | 3548–4418 | y 3548–4418 |
| 6 | `06-services.md` | 4568–5737 | y 4568–5737 |
| 7 | `07-contact.md` | 6002–7349 | y 6002–7349 |
| 8 | `08-footer.md` | 7349–7580 | y 7349–7580 |

Gaps between ranges (801–842, 927–944, 1663–1842, 3291–3548, 4418–4568, 5737–6002) are empty
background. In flow layout these become the section margins; the exact values are listed per spec.

## Uncertainties (all `UNKNOWN` values on the page)

| # | Item | Why unknown |
|---|---|---|
| U1 | `SDDystopianDemo` licence and source | not in Figma data; requires foundry lookup + purchase decision |
| U2 | `Glitch Goblin` licence and source | not in Figma data |
| U3 | Responsive behaviour below 1440 | only one frame exists; no breakpoints designed |
| U4 | Light-mode frame | hero links to it, but it is not `4:3` and no node id was given |
| U5 | Intended hero-cover x-position | 216 vs 0 — see defect 6 |
| U6 | All link targets | no prototype links; nav, resume, social, and portfolio destinations are undefined |
| U7 | Interactive states | no hover/focus/active/pressed variants anywhere; buttons and links have one state only |
| U8 | Real project images and logos | do not exist in the file (defects 2, 3) |
| U9 | Whether the nav bullet discs are intentional | see defect 11 |
| U10 | Marquee seamless-loop distance | animated x-range (−5340) does not divide the text width (6444) — see `02-marquee.md` |
| U11 | Letter-spacing intent | none set anywhere; unclear whether the display font's default tracking was accepted or never considered |
| U12 | Focus order / semantics | flat absolute frame gives no reading order; DOM order must be authored, not extracted |
