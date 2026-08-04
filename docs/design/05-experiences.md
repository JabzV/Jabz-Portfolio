# 05 · Experiences

- **y-range:** 3548–4418 (height 870)
- **Reference:** `docs/design/screens/dark-mode-full.png`, crop **y 3548–4418**
- **Gaps:** 257 px above (featured work ends 3291), 150 px below (services rule at 4568)

## Token situation

No variables, no components, no auto-layout. The six cards are six independent rectangles.

## Layout

### Header block (left column)

| Element | Node | Geometry |
|---|---|---|
| "EXPERIENCES" | `30:5091` | `left: 68; top: 3630`, 72 px, `nowrap` |
| subtitle | `30:5090` | `left: 68; top: 3704; width: 389` |

Unlike Featured Work and Services (both centred, 112 px), this heading is **left-aligned at 72 px**.
That asymmetry is a deliberate layout change, not drift — the right two-thirds of the band is occupied
by the card grid, so the header sits in the left gutter.

Note there is **no rule above this section** — Featured Work's closing rule at y 3291 is 257 px away.
Every other major section is introduced by a 1334 px rule; Experiences is not. Flag as a possible
omission but reproduce.

### The card grid — 3 rows × 2 columns, offset checkerboard

Six cards, each **381×290**, 1 px border `#4c4c4c`. Columns at x **635** and **1015**; rows at y
**3548**, **3838**, **4128**.

| Node | left | top | Fill | Row/col |
|---|---|---|---|---|
| `30:5093` | 635 | 3548 | `#1a0303` **filled** | r1 c1 |
| `30:5100` | 1015 | 3548 | `#11141c` empty | r1 c2 |
| `30:5104` | 635 | 3838 | `#11141c` empty | r2 c1 |
| `30:5102` | 1015 | 3838 | `#1a0303` **filled** | r2 c2 |
| `30:5106` | 635 | 4128 | `#1a0303` **filled** | r3 c1 |
| `30:5108` | **1016** | 4128 | `#11141c` empty | r3 c2 |

Pattern: filled cards on the diagonal **c1, c2, c1** going down — i.e. a checkerboard where the three
filled cells carry content and the three `#11141c` cells are visually empty (they match the page
background, so only their `#4c4c4c` border is visible).

Column pitch is **380** (635 → 1015), and the cards are 381 wide, so **adjacent cards overlap by 1 px**
— the two borders share a pixel line. Row pitch is exactly **290**, equal to the card height, so rows
also share border pixels. This is a collapsed-border grid: build as `grid grid-cols-2` with a shared
1 px border (e.g. `gap-0` + `-ml-px`/`-mt-px`, or a `border-collapse`-style approach), **not** as six
independently bordered boxes with gaps — six separate borders would produce visible 2 px double lines.

**Drift:** `30:5108` sits at `left: 1016` instead of 1015 (overview defect 7). Normalize to 1015.

Grid extent: x 635–1397 (762 wide), y 3548–4418 (870 tall). Right edge at 1397 does not align with the
1334-wide rules used elsewhere (which end at 68+1334 = 1402) — 5 px short. Flag.

### Content blocks — three, one per filled card

Each is a 337×219 block with five absolutely-positioned text children.

| Node | left | top | Card | Offset within card |
|---|---|---|---|---|
| `40:9` — BATCHLINX | 657 | 3583 | `30:5093` (635, 3548) | +22, **+35** |
| `40:8` — PrinceTechnologies | 1038 | 3873 | `30:5102` (1015, 3838) | +23, **+35** |
| `40:15` — FREELANCE | 657 | 4156 | `30:5106` (635, 4128) | +22, **+28** |

**Drift:** `40:15` is at +28 vertically while the other two are at +35 (overview defect 7), and x
offsets are 22 / 23 / 22. Normalize to a single padding of +22/+35 (or better, one padding token) and
log the deviation.

### Content-block internal layout (local coordinates, 337×219)

Identical structure in all three. Figma expresses these with `left` + `right` pairs; the `right`
values differ per block only because the strings differ in length — they are **text-width artifacts,
not design intent**. Use `left` + natural width.

| Part | left | top | Size | Colour |
|---|---|---|---|---|
| `(Insert LOGO)` | 0 | 0 | 22 | `#ffffff` |
| `[ n ]` | 295 | 0 | 22 | `#ffffff` |
| company name | 0 | 104 | 28 | `#ffffff` |
| role | 0 | 173 | 22 | `#868686` |
| date range | 0 | 195 | 18 | `#c75057` |

So: a top row (logo slot left, index right), then a 104 px gap, then name / role / date stacked with
69 px and 22 px offsets. The 104 px gap is where a logo image would go if one existed.

### Build guidance

```
<section class="relative">
  <header class="…">EXPERIENCES + subtitle</header>   /* left column, x 68 */
  <ul class="grid grid-cols-2 …">                     /* 6 cells, collapsed 1px borders */
    <ExperienceCard filled>…</ExperienceCard>
    <ExperienceCard />                                /* empty cell */
    …
  </ul>
</section>
```

The header and the grid overlap vertically (header y 3630–3760, grid starts 3548) but not horizontally
(header x 68–457, grid x 635+). So the section is a **two-column layout**: `flex` with the header in
the left column and the grid in the right, header vertically offset ~82 px from the grid top. Absolute
positioning is not needed for either.

The three empty cells must still exist in the DOM (their borders are visible), but they carry no
content — render as `<li aria-hidden="true">` or an empty presentational div so screen readers see
three experiences, not six.

## Type

| Element | Nodes | Family | Size | Colour | Transform |
|---|---|---|---|---|---|
| "EXPERIENCES" | `30:5091` | SDDystopianDemo Regular | **72** | `#ffffff` | uppercase |
| subtitle | `30:5090` | Glitch Goblin Regular | **28** | `#8d8d8d` | uppercase |
| company names | `40:11`, `40:5`, `40:17` | SDDystopianDemo Regular | **28** | `#ffffff` | none set |
| roles | `40:12`, `40:6`, `40:18` | SDDystopianDemo Regular | **22** | `#868686` | none set |
| `[ n ]` index | `40:13`, `40:3`, `40:19` | SDDystopianDemo Regular | **22** | `#ffffff` | none set |
| `(Insert LOGO)` | `40:21`, `40:23`, `40:25` | SDDystopianDemo Regular | **22** | `#ffffff` | none set |
| date ranges | `40:10`, `40:2`, `40:16` | **General Sans** Regular | **18** | `#c75057` | none set |

All `line-height: normal`, no letter-spacing, all `white-space: nowrap`.

The date ranges are the **only** place General Sans appears outside the hero and footer — a deliberate
switch from the display face to the body face for metadata.

### Content

| Card | Company | Role | Date | Index |
|---|---|---|---|---|
| r1 c1 | `BATCHLINX [STARTUP]` | `PROJECT LEAD` | `//2026 - Present ` | `[ 3 ]` |
| r2 c2 | `PrinceTechnologies ` / `Corporation` (two lines) | `software developer` | `// Jan 2025 - Present ` | `[ 2 ]` |
| r3 c1 | `FREELANCE` | `software developer` | `// Aug 2024 - Present ` | `[ 1 ]` |

Notes:
- The indices count **down** the page as 3, 2, 1 — reverse-chronological numbering. Intentional.
- `PrinceTechnologies Corporation` is a hard two-line break (`40:5` has two `<p>` children with
  `white-space: pre`), the others are single-line. The break is manual, so it will fall differently
  under a substitute font; prefer letting it wrap naturally in a 337 px column.
- Date strings carry trailing spaces and inconsistent separators: `//2026` has no space after the
  slashes, `// Jan 2025` and `// Aug 2024` do. Flag; trim in code or keep for parity — recommend
  keeping for Phase 3 parity and fixing at Phase 6.
- `//2026 - Present` for a role starting in 2026 while today is 2026 is plausible, but the mixed
  `//YYYY` vs `// Mon YYYY` granularity is a content inconsistency.

## Colour

| Value | Role |
|---|---|
| `#1a0303` | the three filled cards — a near-black warm red, used nowhere else on the page |
| `#11141c` | the three empty cards (= page background) |
| `#4c4c4c` | 1 px border on all six cards — used nowhere else (rules use `#363636`) |
| `#ffffff` | heading, company names, `[ n ]`, `(Insert LOGO)` |
| `#8d8d8d` | subtitle |
| `#868686` | roles |
| `#c75057` | date ranges — used nowhere else on the page |

All raw hex. Two of these (`#1a0303`, `#c75057`) are **single-use colours** and one (`#4c4c4c`) is
section-specific; `token-architect` should decide whether they earn top-level names or become
component-scoped values.

`#4c4c4c` (border) vs `#363636` (rules) are two distinct greys for what is arguably the same role
(hairline dividers). Possibly unintentional; flag.

## Assets

**None.** This section is entirely CSS-drawable: six bordered rectangles and text. No image, icon, or
SVG is referenced anywhere in the y-range.

The `(Insert LOGO)` slots are where three logo assets *should* be but are not (overview defect 2).

## Components to extract

| Proposed component | Instances | Figma component name |
|---|---|---|
| `ExperienceCard` (381×290, `filled` variant, 1 px `#4c4c4c` border) | 6 (3 filled, 3 empty) | none — no Figma components exist in this file |
| `ExperienceContent` (logo slot + index + name + role + date) | 3 | none |
| `SectionStatement` (28 px muted uppercase subtitle) | shared with `04-featured-work.md` | none |

`ExperienceCard` needs a `filled` boolean and must support an empty state that renders border only.

## Uncertainties

- **U8** — the three company logos do not exist; cards contain the literal string `(Insert LOGO)`.
- **U7** — no hover/focus state on the cards. Whether cards are interactive at all is `UNKNOWN`.
- **U6** — no links (company sites, project pages) defined.
- Whether the empty `#11141c` cells are intentional negative space or placeholders for three more
  experiences is `UNKNOWN` — the checkerboard reads as deliberate, but three future roles is equally
  plausible.
- Whether `#4c4c4c` (card border) and `#363636` (rules) are meant to be the same token: `UNKNOWN`.
- Whether the missing introductory rule above this section is an omission: `UNKNOWN`.
- Grid right edge (1397) vs the page rule right edge (1402): 5 px misalignment, intent `UNKNOWN`.
- **U3** — a fixed 762 px two-column grid beside a left header has no designed sub-1440 behaviour.
