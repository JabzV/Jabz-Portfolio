# 03 · Intro / statement

- **y-range:** 944–1663 (height 719)
- **Reference:** `docs/design/screens/dark-mode-full.png`, crop **y 944–1663**
- **Gaps:** 17 px above (marquee ends 927), 179 px below (featured-work rule at 1842)

## Token situation

No variables, no components, no auto-layout.

## Layout

Three layers:

1. **Cityscape background** — `35:5660`, `left: 0; top: 944px; 1440×881`, `opacity: 0.10`,
   `overflow: hidden`, `pointer-events: none`. The inner `<img>` is scaled to `h: 290.46%; w: 100%;
   top: -88.93%` — i.e. the source is cropped hard vertically. Reproduce with
   `background-size: cover; background-position` or keep the inner-img crop; the crop offset is real
   and must be preserved or the visible portion of the skyline changes.
   Note the background box is **881 px tall and starts at 944, so it runs to y 1825** — it extends
   ~162 px past the section's nominal 1663 bottom, underneath the gap. Keep it as a section-level
   background layer, not a child of the text block.
2. **Statement paragraph** — `27:4387`, `left: 91px; top: 1216px; width: 1046px`.
3. **"MORE ABOUT ME" button** — `30:5004` group, `left: 1101px; top: 1582px`.

Plus one decorative texture crop:

4. `30:4986` — `texture-scanline.png`, `left: 1058px; top: 1252px; 283×119`, `opacity` 1,
   `overflow: hidden`, inner img scaled `h: 1161.29%; w: 868.78%; left: -675.57%; top: -726.88%`.
   An extreme crop of the same source used in the hero/marquee area (`27:4421`). Decorative.

### Build guidance

The section is essentially **one centred text block plus a right-aligned button**, which is trivially
expressible in flow:

```
<section class="relative">                      /* bg layer absolute inset-0, opacity-10 */
  <p class="mx-auto max-w-[1046px] ...">…</p>   /* was left-[91px] */
  <div class="ml-auto ...">MORE ABOUT ME</div>  /* was left-[1101px] */
</section>
```

Load-bearing values: paragraph width **1046**, paragraph size **54 px**, button **240×60**, and the
diamond geometry below. The `top` values (1216, 1582) are incidental and become margins — vertical
distance from paragraph top to button top is 366 px, and the paragraph is ~4 lines at 54 px, so the
gap after the paragraph is roughly 150 px but depends on the final font metrics (**font is a
BLOCKER**, so do not hardcode a gap derived from the current rendering).

Paragraph x 91 vs button-group x 1101…1383 — the paragraph's right edge (91+1046 = 1137) overlaps the
button group's left edge (1101) horizontally, but they are 366 px apart vertically so there is no
visual collision.

## Type

| Element | Node | Family | Size | Line-height | Colour | Transform |
|---|---|---|---|---|---|---|
| statement | `27:4387` | Glitch Goblin Regular | **54** | normal | `#8d8d8d` | `text-transform: uppercase` |
| "More About me" | `30:5003` | Glitch Goblin Regular | **24** | normal | `#ffffff` | `uppercase` |

Full statement text:

> I help brands rise above the noise in the digital age. Together, we'll push creative boundaries and
> build experiences that leave a lasting impression.

Note the source string is **mixed case** and rendered uppercase purely by `text-transform`. Keep the
mixed-case string in the DOM (better for screen readers and for future copy edits) and apply
`uppercase` in CSS — do not retype it in caps.

No letter-spacing set. The button label is positioned via `left: calc(50% + 427px)` with `width: 189px`
inside the group — in code, centre it in the 240×60 rect instead.

## Colour

| Value | Role |
|---|---|
| `#8d8d8d` | statement text — same muted grey used for every Glitch Goblin paragraph on the page |
| `#9c2222` | button fill `30:4997` — same accent as the hero red panel |
| `#11141c` | the two 45°-rotated squares — **page background colour**, so they read as notches cut out of the button |
| `#ffffff` | button label |

All raw hex, no variables.

## The "MORE ABOUT ME" button — geometry

This shape recurs (see `04-featured-work.md`) and must be one component.

| Part | Node | Geometry |
|---|---|---|
| rect | `30:4997` | `left: 1122; top: 1603; 240×60`, fill `#9c2222` |
| notch A | `30:4998` | 42.426×42.426 box at `left: 1101; top: 1642`, containing a **30×30 `#11141c` square rotated 45°** |
| notch B | `30:5000` | 42.426×42.426 box at `left: 1341; top: 1582`, same rotated square |
| label | `30:5003` | 24 px Glitch Goblin, white, uppercase |

42.426 = 30 × √2, i.e. the bounding box of the rotated square — that is Figma reporting the rotated
bounds, not a designed number. Encode as `size-[30px] rotate-45`.

Notch placement relative to the 240×60 rect (`1122, 1603`):
- A: centre at (1122.2, 1663.2) → the **bottom-left** corner of the rect.
- B: centre at (1362.2, 1603.2) → the **top-right** corner of the rect.

So the effect is a diagonal bite out of two opposite corners, each 30×30 rotated 45° and painted in
the page background colour. **This is the same silhouette as `button-shape.svg`** used for "CONTACT
ME DIRECTLY" in `07-contact.md` — that one bakes the geometry into a path. Prefer expressing it once
as `clip-path: polygon(...)` on a token-coloured box so all three buttons share one implementation
and the fill stays a token.

Caveat: painting the notches in `#11141c` only works over the page background. Here the cityscape
layer sits behind at 10 % opacity, so the notch squares will **not** perfectly match the surrounding
pixels — they will read as slightly darker wedges. That is what the design does; reproduce it, but
`clip-path` would avoid the artifact entirely and is the better implementation. Flag the visual
difference for `visual-qa`.

## Assets

| Path | Alt text |
|---|---|
| `public/figma/cityscape-bg.jpg` | `""` — decorative background at 10 % opacity |
| `public/figma/texture-scanline.png` | `""` — decorative crop |

Neither carries information; both `aria-hidden`.

## Components to extract

| Proposed component | Instances (page-wide) | Figma component name |
|---|---|---|
| `NotchedButton` (rect + two 45° corner notches + centred Glitch Goblin label) | 3 — here, `VIEW PORTFOLIO`, `CONTACT ME DIRECTLY` | none — no Figma components exist in this file |
| `SectionStatement` (uppercase muted Glitch Goblin paragraph) | 5 — 54 px here, 28 px ×2, 24 px ×4 in services | none |

`NotchedButton` needs props for fill (`#9c2222` / `#e4e4e4`), label colour (white / black), and width
(240 here and for VIEW PORTFOLIO; 314.418 for CONTACT ME DIRECTLY).

## Uncertainties

- **U6** — "MORE ABOUT ME" destination is `UNKNOWN`; no prototype link.
- **U7** — no hover/focus/active state for the button.
- **U3** — the 1046 px paragraph at 54 px has no designed reflow below 1440.
- The cityscape background extends 162 px past the section's nominal end (to y 1825). Whether the
  section boundary or the background box is the intended edge is `UNKNOWN`; I treated the background
  as belonging to this section.
- The exact intended crop of `texture-scanline.png` at these extreme inner-image percentages is
  effectively unverifiable from the numbers alone — match visually against the screenshot crop.
