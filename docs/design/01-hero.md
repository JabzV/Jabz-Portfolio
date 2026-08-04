# 01 · Hero

- **y-range:** 0–801 (height 801)
- **Reference:** `docs/design/screens/dark-mode-full.png`, crop **y 0–801**
- **Gap to next section:** 41 px (hero ends 801, marquee starts 842)

## Token situation

No Figma variables, no components, no auto-layout. Every element below is absolutely positioned as a
direct child of the 1440×7580 root frame; the coordinates given are **absolute page coordinates**,
which for this section equal section-local coordinates (the section starts at y 0).

## Layout

The hero is a full-bleed 1440×801 band with three overlapping z-layers. Paint order in the design
context, back to front:

1. `hero-cover.png` — `13:55`, `left: 216px; top: 1px; 1440×801`, `object-cover`.
   **Overflows the frame by 216 px on the right** (see overview defect 6). Intended x is `UNKNOWN`.
2. Three layered vertical wordmarks (below).
3. `14:2` — the red panel, `#9c2222`, `left: 0; top: 0; 453×801`. Opaque; it covers the left third of
   the cover image and the left edge of the first wordmark.
4. Everything else.

### The layered vertical wordmark

Three copies of "JABZ VESTIDAS", each rotated **−90°**, each in a 85×777 box at `top: 12px`:

| Node | left | Colour |
|---|---|---|
| `11:8` | 482 | `#f8eeee` (opacity 1) |
| `15:3313` | 567 | `rgba(248,238,238,0.49)` |
| `15:3315` | 652 | `rgba(248,238,238,0.06)` |

All three: SDDystopianDemo Regular **116 px**, `line-height: normal`, `white-space: nowrap`,
`text-shadow: 0px 4px 4px rgba(0,0,0,0.25)`. Horizontal pitch is a clean **85 px** — this is real
design intent and should be encoded as a gap, not three magic left values.

In Figma these are `flex items-center justify-center` boxes containing a `-rotate-90` child. Build as
a single flex row of three items with `gap: 0` and each item `w-[85px] h-[777px]`, child
`rotate-[-90deg]`. Note the rotated text is wider (777) than its 85 px box, so overflow is intended
and visible.

### Layout guidance for builders

**Do not reproduce the absolute coordinates.** Sensible structure:

- Section: `relative h-[801px] w-full overflow-hidden` (the `overflow-hidden` is what the Figma frame
  clipping implies, and is required for the cover-image overflow to behave as designed).
- Cover image and red panel: absolute is correct here — they are true background layers.
- Wordmark stack: absolute-positioned flex row, as above.
- Left content column (`left: 49–51px`): headline / WARNING / resume link are all left-aligned in a
  vertical stack at x ≈ 50. Build as a flex column and keep the *vertical* offsets, which are not
  uniform (321 → 561 → 711).
- Right rail (`left: 1322px`): LinkedIn and Instagram blocks are already `flex flex-col` in Figma
  (`gap: 7px`) — stack them; vertical pitch between the two blocks is 146 px (281 → 427).
- Nav (`top: 19–29px`): a top bar. The four items sit at x 960 / 1092 / 1208 / 1367 with irregular
  gaps — replace with `flex gap-*` and accept a small deviation, or keep the exact gaps and document
  them. Flag: gaps are 132, 116, 159 — **not uniform**.
- Everything else (katakana, decorative glyphs, quote blocks) is decorative absolute overlay and may
  legitimately stay absolute within the 801 px section.

## Type

| Element | Node | Family / weight | Size | Line-height | Colour |
|---|---|---|---|---|---|
| vertical "JABZ VESTIDAS" ×3 | `11:8`, `15:3313`, `15:3315` | SDDystopianDemo Regular | 116 | normal | see table above |
| "FULL-STACK / DEVELOPER / /DESIGNER / /ENGINEER" | `14:15` | SDDystopianDemo Regular | 72 | normal | `#ffffff` |
| nav "About", "WORK", "Contact" | `15:3318`, `15:3320`, `16:3322` | Glitch Goblin Regular | 20 | normal | `#ffffff` |
| "WARNING" prefix | `16:4334` span 1 | General Sans **Semibold** | 14 | normal | `#ffffff` |
| WARNING body | `16:4334` span 2 | General Sans Regular | 14 | normal | `#ffffff` |
| "Linkedin", "instagram" captions | `15:3058`, `15:3311` | SDDystopianDemo Regular | 14 | normal | `#ffffff`, centred |
| BIO card "BIO" | `16:4314` | General Sans Semibold | 20 | normal | `#000000` |
| BIO card "Jabez Vestidas " | `16:4300` | General Sans Semibold | 20 | normal | `#ffffff` |
| BIO card body lines | `16:4303`, `16:4306`, `16:4323`, `16:4318`, `16:4312` | General Sans Regular | 14 | normal | `#000000` |
| BIO card "Graduated" | `16:4316` | General Sans Regular | **8** | normal | `#000000` |
| BIO "LOCATION" prefix | `16:4310` span 1 | General Sans Semibold | 14 | normal | `#000000` |
| BIO ": Philippines" | `16:4310` span 2 | General Sans Regular | 14 | normal | `#000000` |
| quote — Steve Jobs | `16:4337` | General Sans Regular | 14 | normal | `#ffffff` |
| quote — Henry Ford | `16:4339` | General Sans Regular | 14 | normal | `#ffffff` |
| "View it in light mode / (Professional Mode)" | `22:4361` | General Sans Regular | 12 | normal | `#ffffff`, underlined |
| "© Jabez Joshua Vestidas" | `22:4371` | General Sans Regular | 12 | normal | `#ffffff` |
| resume link ">  DOWNLOAD MY RESUME" | `19:4350` | General Sans Regular | 14 | normal | `#ffffff` |
| katakana ジャベス | `22:4364` | General Sans Regular | 48 | **40 px** | `#ffffff` |
| katakana スピード | `22:4365` | General Sans Regular | 48 | **48 px** | `#ffffff` |

No `letter-spacing` is set on any node. The two katakana columns are the **only** nodes on the whole
page with an explicit numeric line-height, and they differ from each other (40 vs 48) — flag as
probably unintentional.

Text decorations:
- Both quotes underline **only the quoted sentence**, not the attribution — the attribution is a
  separate unstyled span. Reproduce as two spans, not a single underlined block.
- "View it in light mode (Professional Mode)" is fully underlined.
- Jobs quote uses `text-decoration-skip-ink: none`; Ford quote does not. Trivial inconsistency.

## Colour

| Value | Where |
|---|---|
| `#9c2222` | red panel `14:2` (453×801) |
| `#f8eeee` | wordmark layer 1 |
| `rgba(248,238,238,0.49)` | wordmark layer 2 |
| `rgba(248,238,238,0.06)` | wordmark layer 3 |
| `#ffffff` | all left/right column text; BIO card background `14:7`; the `41px` nav toggle circle |
| `#000000` | BIO card 1px borders (`14:8`, `16:4305`, `16:4308`), BIO card text, the 163×28 label bar `16:4302` |
| `rgba(0,0,0,0.25)` | text-shadow on the three 116 px wordmarks |

Flagged as raw hex with no variable: **all of the above.** There is no variable layer in this file.

## Detailed element geometry

Kept because several of these are structural, not incidental.

### Nav — `16:4299` (a `contents` wrapper; no box of its own)

| Item | left | top | Notes |
|---|---|---|---|
| About | 960 | 29 | rendered as `<li class="list-disc ms-[30px]">` |
| WORK | 1092 | 29 | same |
| Contact | 1208 | 29 | same |
| toggle group `16:3327` | 1367 | 19 | 45×45 |
| ↳ white circle `16:3325` | +3.48 | +2 | 41×41 — `nav-toggle-ellipse.svg`, **use CSS `rounded-full bg-white`** |
| ↳ sun glyph `16:3328` | +12 | +11 | 24×24 — `icon-sun.png`, `object-contain` |

**The bullet discs are real markup in the design context** (see overview defect 11). Verify against the
screenshot before shipping visible bullets; the `ms-[30px]` marker indent means the visible text
starts 30 px right of the stated `left`.

### BIO card — `15:2555`, `left: 1175; top: 573; 265×228`

Coordinates below are **local to the card**, which is the one place in this design that is genuinely
self-contained. Build it as its own component with `position: relative`.

| Part | Node | Box | Notes |
|---|---|---|---|
| card background | `14:7` | 0,0 265×228 | `bg-white` |
| inner outline | `14:8` | 13,11 244×205 | 1px solid `#000` |
| black label bar | `16:4302` | 13,53 163×28 | `bg-black` |
| "Jabez Vestidas " | `16:4300` | 21,53 | 20px Semibold, white — sits on the bar |
| "BIO" | `16:4314` | 23,18 | 20px Semibold, black |
| arrow-outward chip | `16:4320` | 161,20 24×24 | `bg-white`, `overflow-clip` |
| ↳ arrow glyph | `16:4321` | +6,+6 12×12 | `icon-arrow-outward.svg` |
| "About Me" | `16:4318` | 185,22 | 14px |
| year box | `16:4305` | 176,53 81×28 | 1px solid `#000` |
| "2025" | `16:4312` | 202,57 | 14px |
| "Graduated" | `16:4316` | 197,81 | **8px** |
| education box | `16:4308` | 13,102 244×42 | 1px solid `#000` |
| "BS in Computer Engineering" | `16:4303` | 21,104 | 14px |
| "Graduated Cum Laude" | `16:4306` | 21,123 | 14px |
| "LOCATION: Philippines" | `16:4310` | 60,161 | 14px, mixed weight |
| email | `16:4323` | 29,186 | 14px |

Note the card's outer height 228 and the inner outline bottom edge (11+205 = 216) leave a 12 px strip
that the email line (top 186) sits across — the email is **outside** the outline box. Intentional or
not is `UNKNOWN`, but reproduce as-is.

### Social rail

Both are `flex flex-col items-center gap-[7px] w-[100px]`, so this is the only auto-layout-like
structure Figma reported in the hero.

| Block | Node | left | top | Icon | Icon node |
|---|---|---|---|---|---|
| LinkedIn | `15:3059` | 1322 | 281 | `social-linkedin.svg` 100×100 | `15:2807` |
| Instagram | `15:3060` | 1322 | 427 | `social-instagram.svg` 100×100 | `16:4064` |

The LinkedIn icon wrapper is `h-[100px] w-full`; the Instagram one is `size-[100px]`. Same result,
different authoring — normalize to `size-[100px]`.

### Decorative glyphs

| Node | Asset | Box | Transform |
|---|---|---|---|
| `21:4353` "image 2" | `hero-image-2.png` | 32,33 272×275 | none, `object-cover` |
| `21:4356` "image 3" | `hero-image-3.png` | 37,669 379×33 | none, `object-cover` |
| `22:4376` | `hero-arrow-glyph.png` | 980,684 139.991×83 | **rotate 180°** |
| `23:4381` | `hero-arrow-glyph.png` | 374,746 70.839×42 | **rotate 180°** |
| `23:4385` | `hero-arrow-glyph.png` | 210,746 70.839×42 | **rotate 180°** |
| `23:4383` | `hero-arrow-glyph.png` | 291,749 70.839×42 | none |
| `23:4379` | `hero-badge-glyph.png` | 1317,123 106×109 | none |

The three small arrow glyphs sit at 210 / 291 / 374 — pitch 81 and 83, and the un-rotated middle one
is 3 px lower (749 vs 746). Both look like hand-placement drift; flag but reproduce.

All five glyph images are **decorative** — `alt=""` and `aria-hidden`.

### Text blocks at absolute positions

| Element | Node | left | top | width |
|---|---|---|---|---|
| headline (72px) | `14:15` | 51 | 321 | auto, `nowrap` |
| WARNING paragraph | `16:4334` | 51 | 561 | 371 |
| resume link | `19:4350` | 49 | 711 | auto, `white-space: pre` |
| Jobs quote | `16:4337` | 751 | 696 | 178 |
| Ford quote | `16:4339` | 1017 | 120 | 182 |
| light-mode link | `22:4361` | 332 | 9 | 111 |
| hero copyright | `22:4371` | 15 | 12 | 143 |
| katakana ジャベス | `22:4364` | 304 | 89 | auto |
| katakana スピード | `22:4365` | 362 | 85 | auto |

Left column uses x = 49 and 51 for different elements — pick one (51 for the two blocks that share it,
49 is the odd one out) and note the 2 px deviation.

## Assets

| Path | Alt text |
|---|---|
| `public/figma/hero-cover.png` | `""` — decorative full-bleed background |
| `public/figma/hero-image-2.png` | `""` — decorative |
| `public/figma/hero-image-3.png` | `""` — decorative |
| `public/figma/hero-arrow-glyph.png` | `""` — decorative, 4 instances |
| `public/figma/hero-badge-glyph.png` | `""` — decorative |
| `public/figma/social-linkedin.svg` | `"LinkedIn"` (or `""` if the "Linkedin" caption is the accessible label — preferred) |
| `public/figma/social-instagram.svg` | `"Instagram"` (same note) |
| `public/figma/icon-sun.png` | `""` — inside the toggle; the toggle needs `aria-label="Switch to light mode"` |
| `public/figma/icon-arrow-outward.svg` | `""` — decorative affordance on the BIO card |
| `public/figma/nav-toggle-ellipse.svg` | **do not ship** — replace with `rounded-full bg-white` |

## Components to extract

| Proposed component | Instances here | Figma component name |
|---|---|---|
| `SocialBlock` (icon + caption, `flex-col gap-7`) | 2 | none — **no Figma components exist in this file** |
| `BioCard` | 1 | none |
| `NavBar` | 1 | none |
| `ThemeToggle` (circle + sun) | 1 | none |
| `LayeredWordmark` (rotated text ×3 with opacity ramp) | 1 (3 layers) | none |
| `QuoteBlock` (underlined quote + plain attribution) | 2 | none |

## Uncertainties

- **U5** — hero cover x-position 216 vs 0. The image overflows the frame; intended value `UNKNOWN`.
- **U6** — link targets for nav (About/WORK/Contact), resume download, LinkedIn, Instagram, and
  "View it in light mode" are all `UNKNOWN`. No prototype links in the file.
- **U7** — no hover/focus/active states designed for any nav item, link, social block, or the toggle.
- **U9** — whether the nav `list-disc` bullets are intentional.
- Whether the BIO card's email line falling outside the inner outline is intentional.
- Nav item gaps are non-uniform (132 / 116 / 159); whether that is intent or drift is `UNKNOWN`.
- The `hero-badge-glyph.png` and `hero-arrow-glyph.png` files have Figma-scratch layer names
  (`fhbsfhsfhsfh 1`, `adghaagdha 1`) — their intended meaning is `UNKNOWN`; treated as decorative.
