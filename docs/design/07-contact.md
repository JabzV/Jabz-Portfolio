# 07 · Contact

- **y-range:** 6002–7349 (height 1347)
- **Reference:** `docs/design/screens/dark-mode-full.png`, crop **y 6002–7349**
- **Gaps:** 265 px above (services end 5737); the footer rule at 7349 is the shared boundary

## Token situation

No variables, no components, no auto-layout.

## Layout

Five layers, back to front:

1. **Background texture** — `35:5669`, `left: 0; top: 6049px; 1440×1274`, `opacity: 0.10`,
   `overflow: hidden`, `pointer-events: none`. Inner `<img>` scaled `h: 200.87%; w: 100%; top: -0.01%`
   — a 2× vertical stretch of `contact-bg-texture.jpg`. Runs y 6049–7323, i.e. it starts **47 px below
   the section's top rule** and ends 26 px above the footer rule. Section-level background layer.
2. **Top rule** — `35:5673`, `left: 53; top: 6002; 1334×1`. (Note x 53, not 68 — overview defect 8.)
3. **"LET'S WORK TOGETHER"** — `40:85`, `left: calc(50% + 18px); top: 6178`,
   `transform: translateX(-50%)`, `width: 694`, `text-align: center`, 92 px, two lines.
   The `+18px` offset means it is **18 px right of true centre** — see Uncertainties.
4. **The contact panel** — `41:120`, `left: 244; top: 6428; 988×640.354`. Contains the `Subtract`
   shape and the three contact rows.
5. **Tagline** and **"CONTACT ME DIRECTLY" button** below the panel.

| Element | Node | Geometry |
|---|---|---|
| tagline | `41:123` | `left: 747.5; top: 7132`, `translateX(-50%)`, `width: 585`, `height: 70`, centred |
| button group | `41:125` | `left: 581; top: 7208` |

Tagline centre x = 747.5, heading centre x = 738, button-shape centre x = 581 + 157.2 = 738.2. So the
tagline is **9.5 px right** of the other two centred elements, and none of the three is at the frame's
true centre (720). Three different "centres" — flag.

### The contact panel — `41:120` (988×640.354 at 244, 6428)

Coordinates below are **local to the panel**.

| Part | Node | Local box | Notes |
|---|---|---|---|
| `Subtract` shape | `41:122` | `left: 20.43; top: -4.18; 381.999×640.354` | `contact-subtract-shape.svg`, fill `#d9d9d9` |
| Email row | `40:87` | `left: 398; top: 117; 590×102` | |
| Contact row | `41:94` | `left: 398; top: 270; 590×105` | |
| Alt Contact row | `41:112` | `left: 398; top: 426; 590×105` | |
| zero-size artifact | `40:75` | `left: 0; top: 0; size: 0` | **`rotate-90`, empty SVG — omit** (defect 4) |

So the panel is a **two-column layout**: a 382 px decorative shape on the left, and a 590 px stack of
three contact rows on the right, separated by a 16 px gutter (20.43+382 = 402.4 → 398 actually
*overlaps* by 4.4 px; effectively flush).

The `Subtract` shape's `top: -4.18` makes it protrude 4.18 px above the panel box, and its height equals
the panel height exactly (640.354) so it also protrudes 4.18 px below. Fractional overhang — a hand-drag
artifact; treat as "shape fills the panel height".

Row vertical pitch: 117 → 270 → 426, i.e. **153 and 156 px** (rows are 102, 105, 105 tall). Not uniform;
normalize to one pitch.

### Contact row internal layout (local to the 590 px row)

Identical in all three:

| Part | left | top | Size | Colour |
|---|---|---|---|---|
| label wrapper (375×35) | 28 | 0 | — | |
| ↳ label text | +78.43 | +13.82 | 38 | `#ffffff` |
| underline (528×1) | 103.43 | 45.82 | — | `#363636` |
| value | 193.43 | 53.82 | 24 | `#8d8d8d` |

The `.43` and `.82` fractions recur on every child — they come from a nested transform in Figma, not
from design intent. **Round them**: label at 78/14, underline at 103/46, value at 193/54.

Structure reads as: a 38 px label, a hairline under it spanning 528 px, and the value sitting just
below the line indented a further 90 px. Note the label (x 106.43 absolute-in-row) and the value
(x 193.43) are **not** left-aligned with each other — the value is indented 90 px further. That is
consistent across all three rows, so it is intent.

This is the same 375×35 wrapper as `NumberedTitle` (Featured Work / Services) but **without a number**
— the wrapper is a leftover from copy-pasting that pattern. In code, drop the empty wrapper.

### Build guidance

```
<section class="relative">                     /* texture layer absolute, opacity-10 */
  <h2 class="text-center …">LET'S WORK<br/>Together</h2>
  <div class="flex …">                         /* the panel */
    <div class="… clip-path-notched bg-…" />    /* Subtract shape, 382 wide */
    <dl class="w-[590px] …">                   /* 3 rows */
      <ContactRow label="Email" value="…" />
    </dl>
  </div>
  <p class="text-center …">Let's create a unique experience together!</p>
  <NotchedButton>CONTACT ME DIRECTLY</NotchedButton>
</section>
```

The three rows are semantically a **definition list** (`<dl>`/`<dt>`/`<dd>`) or a list of links. The
values are an email and two phone numbers — these should be real `mailto:` / `tel:` links, which the
design does not specify (**U6**) but which is the only sane implementation.

## Type

| Element | Node | Family | Size | Line-height | Colour | Transform |
|---|---|---|---|---|---|---|
| "LEt'S work / Together" | `40:85` | SDDystopianDemo Regular | **92** | normal | `#ffffff` | uppercase, centred |
| row labels | `40:90`, `41:97`, `41:115` | SDDystopianDemo Regular | **38** | normal | `#ffffff` | uppercase |
| row values | `40:88`, `41:95`, `41:113` | Glitch Goblin Regular | **24** | normal | `#8d8d8d` | uppercase |
| tagline | `41:123` | Glitch Goblin Regular | **24** | normal | `#8d8d8d` | uppercase, centred |
| button label | `41:130` | Glitch Goblin Regular | **24** | normal | `#000000` | uppercase |

No letter-spacing anywhere. The heading's parent carries `leading-[0]` with two `leading-[normal]`
children — a Figma multi-line artifact; do not copy `line-height: 0` to the parent.

### Content

| Row | Label (authored) | Value |
|---|---|---|
| 1 | `Email` | `vestidas.jabezjoshua@gmail.com` |
| 2 | `CONTACT` | `+639552591223` |
| 3 | `ALT CONTACT` | `+639917123144` |

Heading is authored `LEt’S work` / `Together` (mixed case, **curly apostrophe U+2019**) and rendered
uppercase by CSS. Tagline: `Let’s create a unique experience together!` — also curly apostrophe. Use
the correct Unicode character, not `'`.

The email `vestidas.jabezjoshua@gmail.com` also appears in the hero BIO card at 14 px General Sans —
same data, two places. Consider a shared constant.

Rendering an email address in `text-transform: uppercase` is a **legibility/correctness smell** — the
displayed text will read `VESTIDAS.JABEZJOSHUA@GMAIL.COM`. Email local-parts are technically
case-sensitive, and phone numbers are unaffected, so this is cosmetic rather than broken, but flag it:
the `uppercase` almost certainly came from copying the shared muted-paragraph style. Raise at Phase 6.

## Colour

| Value | Role |
|---|---|
| `#ffffff` | heading, row labels |
| `#8d8d8d` | row values, tagline |
| `#363636` | top rule + the three row underlines (`rule-line-1.svg`, `contact-row-underline.svg`) |
| `#d9d9d9` | `Subtract` panel shape fill — same value as the project-image greybox |
| `#e4e4e4` | `CONTACT ME DIRECTLY` button shape fill (baked into `button-shape.svg`) |
| `#000000` | button label |

All raw hex.

Note `#d9d9d9` here is used as a **real decorative surface**, whereas in Featured Work the same
`#d9d9d9` is a placeholder greybox. Same hex, two different roles — `token-architect` must not merge
them into one semantic token, or replacing the project placeholders later will also change this panel.

## The `Subtract` shape — `contact-subtract-shape.svg`

```
382 × 640.354, single path, fill #D9D9D9
Bottom-right corner cut:  381.999,543.602 → 282.993,640.178
Top-left corner cut:      0,96.75 → 99.005,0.176
```

A rectangle with two opposite corners sliced off at ~45° by ~99 px — the same notched-corner language
as the buttons and the project frame, at panel scale. Legitimately an SVG (one filled path), but
**better expressed as `clip-path: polygon(...)`** so the fill becomes a token instead of being baked
into the file. Its content is `UNKNOWN` — it is a flat grey slab with nothing in or on it, so it is
either a decorative block or an unfilled image placeholder (see Uncertainties).

## The "CONTACT ME DIRECTLY" button — `41:125`

| Part | Node | Geometry |
|---|---|---|
| shape | `41:126` | `left: 581; top: 7208; 314.418×60` — `button-shape.svg` |
| label | `41:130` | `left: calc(50% - 109px); top: 7224`, `width: 267`, 24 px, `#000000`, uppercase |

`button-shape.svg` content:

```
314.418 × 60, single path, fill #E4E4E4
Top-right notch:    290.488,0.28 → 314.418,24.21
Bottom-left notch:  24.769,60 → 0.769,36 → 0,36.769
```

This is the **same silhouette** as the CSS-composed `MORE ABOUT ME` / `VIEW PORTFOLIO` buttons (rect
with two opposite corners bitten at 45°), except it is 314.418 wide instead of 240 and the geometry is
baked into a path rather than composed from two rotated `#11141c` squares.

**Prefer one `NotchedButton` implementation** using `clip-path` for all three. That fixes a real
problem: the other two buttons paint their notches in `#11141c`, which is wrong wherever a background
layer sits behind — and here a 10 %-opacity texture *does* sit behind, so the composed approach would
show visible wedges. This SVG version is genuinely transparent in the notches. `clip-path` gives both
correct transparency and a tokenised fill.

## Assets

| Path | Alt text |
|---|---|
| `public/figma/contact-bg-texture.jpg` | `""` — decorative background at 10 % opacity |
| `public/figma/contact-subtract-shape.svg` | `""` — decorative; prefer `clip-path` |
| `public/figma/button-shape.svg` | `""` — button chrome; prefer `clip-path`; label carries the name |
| `public/figma/rule-line-1.svg` | **do not ship** — replace with `border-top: 1px solid #363636` |
| `public/figma/contact-row-underline.svg` | **do not ship** — a single `#363636` line; use `border-top` on a 528 px element |
| `public/figma/artifact-group-9.svg` | **do not ship** — empty SVG on zero-size node `40:75` |

## Components to extract

| Proposed component | Instances | Figma component name |
|---|---|---|
| `ContactRow` (38 px label + 528 px underline + 24 px indented value) | 3 | none — no Figma components exist in this file |
| `NotchedButton` (wide variant, 314.418×60, `#e4e4e4`) | shared with `03-intro.md`, `04-featured-work.md` | none |
| `SectionHeading` (92 px centred) | shared | none |
| `Rule` | 1 + 3 underlines | none |

## Uncertainties

- **U6** — no `mailto:` / `tel:` hrefs and no destination for "CONTACT ME DIRECTLY" (form? mail
  client?). All link behaviour here is `UNKNOWN` and it is the section where it matters most.
- **U7** — no hover/focus/active states for the rows or the button.
- The `Subtract` shape's purpose is `UNKNOWN` — a flat `#d9d9d9` slab 382×640 with no content. It may
  be a decorative block or an unplaced image/photo frame. Needs the designer.
- Three different horizontal centres (heading 738, tagline 747.5, button 738.2; frame centre 720) —
  intended value `UNKNOWN`; recommend true centring for all three.
- Top rule at `left: 53` vs 68 elsewhere — canonical gutter `UNKNOWN`.
- Row pitch 153 vs 156 px — canonical value `UNKNOWN`.
- Whether the email should really render `uppercase` — likely a copied style; `UNKNOWN`.
- The fractional `.43`/`.82`/`4.18` offsets are transform artifacts, not design values.
- **U3** — the fixed 988 px panel has no designed sub-1440 behaviour; at narrow widths the 382 px
  decorative slab has no obvious fallback.
