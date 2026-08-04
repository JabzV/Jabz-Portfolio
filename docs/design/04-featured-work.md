# 04 · Featured Work

- **y-range:** 1842–3291 (height 1449)
- **Reference:** `docs/design/screens/dark-mode-full.png`, crop **y 1842–3291**
- **Gaps:** 179 px above (intro ends 1663), 257 px below (experiences start 3548)

## Token situation

No variables, no components, no auto-layout. The four project rows are **copy-pasted absolute
elements**, not instances — which is exactly why they have drifted (see below).

## Layout

### Header block

| Element | Node | Geometry |
|---|---|---|
| top rule | `35:5666` | `left: 53; top: 1842; 1334×1` |
| "FEATURED WORK" | `30:5016` | `left: 605; top: 1916`, 112 px, `nowrap` |
| subtitle | `30:5024` | `left: 68; top: 2011; width: 1233` |
| "VIEW PORTFOLIO" button | `30:5017` group | `left: 49; top: 2043` |

Note the subtitle (top 2011, ~34 px tall at 28 px) and the button (top 2043) **butt directly against
each other** with 0 px gap, and the button group's notch starts at x 49 while the subtitle starts at
x 68 — so the button's left notch protrudes 19 px left of the text column. Reproduce, but flag.

"FEATURED WORK" is centred by a hard `left: 605px` rather than a transform (overview defect 10).
Compute: 112 px text, `nowrap`; 605 is roughly centred for the current font, but **the font is a
BLOCKER and will change**, so a hardcoded 605 will visibly de-centre on substitution. Use
`text-align: center` / `mx-auto` instead.

### The four project rows

Each row is: **rule → placeholder image (right) → title + number (left) → rule**. Row pitch is a clean
**~270 px**.

| # | Project | Title node | Title (l, t) | Image node | Image (l, t) | Rule above | Rule below |
|---|---|---|---|---|---|---|---|
| 1 | LIVESWEALTH | `30:5030` | 96, 2435 | `30:5074` | 671, 2222 | `30:5026` @2211 | `30:5031` @2481 |
| 2 | J9 DESIGN AND BUILD | `30:5042` | **95**, 2703 | `30:5075` | 671, 2484 | `30:5031` @2481 | `30:5033` @2751 |
| 3 | BATCHLINX | `30:5054` | 96, 2972 | `30:5080` | 671, 2754 | `30:5033` @2751 | `30:5038` @3021 |
| 4 | BG WEBSITE | `30:5058` | 96, 3242 | `30:5085` | 671, 3029 | `30:5038` @3021 | `30:5040` @3291 |

All four rules: `left: 68; width: 1334×1`. All four images: `766×248`.

**Drift confirmed** (evidence that these are copies, not instances):
- Row 2's title is at `left: 95` while rows 1/3/4 are at 96.
- Rule-to-image offsets are 11, 3, 3, 8 px — should be one value.
- Row pitches (title to title) are 268, 269, 270; image pitches are 262, 270, 275.

Builders should **normalize**: one row component, one gutter (68), one pitch (270), image at x 671.
Note each deviation you flatten so `visual-qa` can distinguish flattened drift from a real bug.

### Build guidance

```
<section>
  <header> rule · h2 · p · NotchedButton </header>
  <ul>                                   /* 4 rows, border-t on each + border-b on last */
    <li class="relative py-*">           /* was 4× absolute blocks */
      <ProjectRow number="//1" title="LIVESWEALTH" image={placeholder} />
    </li>
    …
  </ul>
</section>
```

Within a row the title sits **213 px below the image top** and the image is 248 tall, so the title
overlaps the image's lower region vertically — but the title occupies x 96–471 and the image x
671–1437, so they never collide horizontally. In flow layout the natural expression is a two-column
row (`flex justify-between`) with the title vertically bottom-ish and the image at the top; the exact
248 px image height and 766 px width are load-bearing.

## Type

| Element | Node | Family | Size | Colour | Transform |
|---|---|---|---|---|---|
| "FEATURED WORK" | `30:5016` | SDDystopianDemo Regular | **112** | `#ffffff` | uppercase |
| subtitle | `30:5024` | Glitch Goblin Regular | **28** | `#8d8d8d` | uppercase |
| "VIEW PORTFOLIO" | `30:5022` | Glitch Goblin Regular | **24** | `#000000` | uppercase |
| project titles | `30:5028`, `30:5043`, `30:5055`, `30:5059` | SDDystopianDemo Regular | **48** | `#ffffff` | uppercase |
| project numbers `//n` | `30:5027`, `30:5044`, `30:5056`, `30:5060` | SDDystopianDemo Regular | **22** | `#868686` | uppercase |

All `line-height: normal`, no letter-spacing.

Subtitle text: `View some of my pROJECTS. Combining elegant design with structured architecture`
(note the odd inner capitalisation `pROJECTS` in the source — irrelevant since it renders uppercase,
but keep the string as-is).

### Title/number internal layout

Each title block is a 375×35 box with two absolutely-positioned children:
- number `//n` at `left: 0; top: 15px`
- title at `left: 39px; top: 0`

So the number is baseline-offset 15 px down from the title — a deliberate superscript-ish stagger.
This 39 px indent and 15 px drop are **real design intent**; encode them, don't flatten.

### Special case — "J9 DESIGN AND BUILD" (`30:5043`)

This title is **three spans with mixed font and size**:

| Span | Text | Family | Size |
|---|---|---|---|
| 1 | `j` | SDDystopianDemo Regular | 48 |
| 2 | `9` | **Glitch Goblin Regular** | **38** |
| 3 | ` DESIGN AND BUILD` | SDDystopianDemo Regular | 48 |

The parent `<p>` carries `text-[0px]` with `leading-[0]` — a Figma mixed-style artifact; do **not**
copy `font-size: 0` to the parent, set the sizes on the spans. The "9" being a different face at a
smaller size appears intentional (stylised logotype), so preserve it.

## Colour

| Value | Role |
|---|---|
| `#ffffff` | section heading, project titles |
| `#8d8d8d` | subtitle |
| `#868686` | `//n` numbers |
| `#363636` | all six rules (`rule-line-1.svg` stroke) |
| `#e4e4e4` | "VIEW PORTFOLIO" rect fill |
| `#000000` | "VIEW PORTFOLIO" label |
| `#11141c` | the two 45° notch squares; also the triangle cut-outs inside the placeholder image |
| `#d9d9d9` | placeholder image rectangle fill |

All raw hex.

## "VIEW PORTFOLIO" button — geometry

Same `NotchedButton` shape as `03-intro.md`, light variant.

| Part | Node | Geometry |
|---|---|---|
| rect | `30:5019` | `left: 70; top: 2064; 240×60`, fill `#e4e4e4` |
| notch A | `30:5020` | box at `left: 49; top: 2103` — 30×30 `#11141c` square, `rotate-45` → **bottom-left** corner |
| notch B | `30:5021` | box at `left: 289; top: 2043` — same → **top-right** corner |
| label | `30:5022` | 24 px Glitch Goblin, `#000000`, uppercase, `left: calc(50% - 625px)`, width 189 |

Identical geometry to MORE ABOUT ME (240×60, same two corners, same 30×30 rotated squares) with the
fill and label colour swapped. One component, two variants.

## Assets

| Path | Alt text |
|---|---|
| `public/figma/project-placeholder.svg` | `""` — **placeholder greybox, not a project image** |
| `public/figma/rule-line-1.svg` | **do not ship** — replace with `border-top: 1px solid #363636` |

### `project-placeholder.svg` — what it actually is

```
766×248 canvas
  rect  #D9D9D9  x=62.823 y=20  640.354×208
  tri   #11141C  bottom-left notch  (62.823,176)→(117.229,230)→(8.417,230)
  tri   #11141C  top-right notch    (703.177,72)→(648.771,18)→(757.583,18)
```

It is a grey rectangle with two triangular bites, in the page background colour — the same notched
motif as the buttons, at image scale. **It is a greybox awaiting real screenshots** (overview defect
3): all four rows point at this one asset.

Recommendation for builders: render it as a **styled container with `clip-path`**, not as an `<img>`,
so that when real project images arrive they drop into the same notched frame. The 640.354×208 inner
rect inset within the 766×248 outer box (x-inset 62.823, y-inset 20) is the actual image area and
must be preserved as the aspect/geometry — the outer box is larger because the triangles overhang.

Once real images exist each needs descriptive alt text (project name + what is shown). Until then
`alt=""` with `aria-hidden` is correct, since a greybox conveys nothing.

## Components to extract

| Proposed component | Instances | Figma component name |
|---|---|---|
| `ProjectRow` (number + title + notched image frame + rules) | 4 | none — no Figma components exist in this file |
| `SectionHeading` (SDDystopianDemo, uppercase, centred) | 3 page-wide (112/112/92 px) | none |
| `NotchedButton` (light variant) | shared with `03-intro.md`, `07-contact.md` | none |
| `Rule` (1334×1, `#363636`) | 14 page-wide | none |
| `NumberedTitle` (`//n` + 48 px title, 39 px indent, 15 px drop) | 4 here + 4 in services + 3 contact rows | none |

`NumberedTitle` is the single highest-value extraction on the page — the identical 375×35 / 39 px /
15 px structure appears in Featured Work, Services, and (label-only) the contact rows.

## Uncertainties

- **U8** — no real project images exist. All four are the same greybox.
- **U6** — "VIEW PORTFOLIO" and the four project titles have no link targets; whether project rows are
  clickable at all is `UNKNOWN`.
- **U7** — no hover state for project rows. A 48 px title over a 766 px image with no hover treatment
  is unusual for a portfolio; likely an omission, but **do not invent one** — propose at Phase 6.
- Which gutter is canonical: rules at 68, top rule at 53, titles at 95/96, button notch at 49.
  `UNKNOWN`; recommend 68.
- Whether the subtitle/button 0 px vertical gap is intentional.
- "FEATURED WORK" hard `left: 605` centring will break on font substitution — intended centring method
  is `UNKNOWN`; recommend true centring.
