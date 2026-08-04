# Responsive strategy — orchestrator decision

The Figma has **one 1440px frame and no breakpoints** (U3). Everything below is an authored
decision, not extracted design. Every builder follows it so the eight sections agree; a builder
that deviates must say so in its report.

`visual-qa` can only verify the **1440px** column against the reference render. Narrower widths
have no reference and are reviewed for sanity, not fidelity.

## Breakpoints

Tailwind v4 defaults, unchanged. Design fidelity is exact at `xl` (1280) and above; below that,
layout adapts.

| Range | Name | Treatment |
|---|---|---|
| < 640 | base | single column, stacked, decorative layers dropped |
| 640–767 | `sm` | single column, larger type |
| 768–1023 | `md` | two columns return where the design has two |
| 1024–1279 | `lg` | near-desktop, tighter gutters |
| ≥ 1280 | `xl` | **the designed layout** |

## Page shell

```
mx-auto w-full max-w-[1440px]
px-5  sm:px-8  lg:px-12  xl:px-[68px]
```

`68px` is the design's dominant left gutter. The design uses **four** different gutters
(41/53/68/71 — defect 8); we normalize on 68 everywhere and every builder inherits it from the
shell rather than hardcoding a per-section value.

Rules (`<hr>`-equivalents) span the content column: `border-t border-rule w-full`. **Never** the
1334px literal, and never the shipped line SVG.

## Type

Display sizes are fluid so a 116px headline doesn't overflow a phone. Body sizes stay fixed —
scaling 14px text down hurts legibility and buys nothing.

`token-architect` owns the exact `clamp()` values; builders use the token names only. The intent:

| Design px | Behavior |
|---|---|
| 116, 112, 92, 72 | fluid, floor ≈ 28–40px, ceiling = design value |
| 54, 48, 38 | fluid, gentler range |
| 28, 24, 22 | fluid only at the top end, floor near 16–18px |
| 20, 18, 14, 12, 8 | **fixed** |

The 8px BIO microlabel is below accessible minimum; raise it to 10px and flag as a deviation.

## Per-section rules

**Hero** — the hardest section; it is a 1440×801 collage of absolutely positioned layers.
- ≥xl: reproduce the designed composition.
- `lg`: keep the red panel and cover image side by side; drop the third (6% opacity) wordmark layer.
- `md` and below: stack vertically — cover image on top (aspect-locked), red panel beneath as a
  full-width block, then BIO card, then social. Reduce the three layered wordmarks to **one**;
  overlapping 116px type is illegible at narrow widths.
- The vertical rotated wordmark is decorative. Below `md`, hide it (`aria-hidden`, not removed
  from the design intent) rather than trying to rotate it into a phone viewport.
- Katakana columns are decorative — keep at `md`+, hide below.

**Marquee** — full-bleed, escapes the shell padding. Height scales with font size. The container
clips; content duplicates for a seamless loop (see `02-marquee.md`). Static translate at build
time; `motion-engineer` owns the animation.

**Intro** — single column at all widths. Background texture stays at `opacity-10`, `object-cover`.
Statement text is the fluid 54px token. Button is full-width below `sm`, intrinsic above.

**Featured Work** — the design is a row per project: title left, skewed image right.
- ≥`md`: keep that two-column row.
- below `md`: stack — number + title, then image beneath at `aspect-[766/248]`.
- The image's skew/notch is part of the art (an SVG), so it scales with the element. Do not
  reimplement the notch in CSS here.

**Experiences** — an offset checkerboard: 2 columns × 3 rows, where each row has one filled card
and one empty card, alternating sides.
- ≥`md`: 2-column grid, alternating placement, empty cards present.
- below `md`: **1 column, empty cards removed entirely.** They are pure visual rhythm; rendering
  empty bordered boxes on a phone reads as broken. This is a deliberate deviation — builders must
  report it.

**Services** — a list. Number and title on one line, rule beneath, description indented.
- ≥`md`: description indented to match the design's 129px offset (as a token, not a literal).
- below `md`: description drops to full width under the title, no indent.

**Contact** — the `Subtract` panel and the label/value rows sit side by side.
- ≥`md`: two columns, panel left, rows right.
- below `md`: stack; panel becomes a full-width band above the rows, or is hidden if it crowds
  the content. Rows become label-over-value instead of side by side.
- Values must be real `mailto:`/`tel:` links. The design has no link targets, but a contact
  section whose contacts aren't clickable has failed at its one job.

**Footer** — rule plus copyright, single line, centered below `sm`.

## Non-negotiables at every width

- No horizontal scrollbar at any viewport from 320px up.
- No absolute positioning for layout. Absolute is allowed only for genuinely layered decoration
  inside a `relative` parent that has its own intrinsic height.
- Every interactive element has a visible focus ring. The design defines **no** interactive states
  (U7), so hover/focus are authored: hover shifts opacity or the accent color; focus uses a
  2px `--color-accent` outline with offset. Never `outline: none`.
- Touch targets ≥ 44×44 CSS px below `md`.
- Text never sits on a busy area of a background image without a scrim; both background textures
  run at 10% opacity, which is safe, but verify contrast where the hero cover shows through.
