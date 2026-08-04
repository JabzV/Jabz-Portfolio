# 08 · Footer

- **y-range:** 7349–7580 (height 231)
- **Reference:** `docs/design/screens/dark-mode-full.png`, crop **y 7349–7580**
- **Boundary:** the rule at y 7349 is shared with the bottom of `07-contact.md`

## Token situation

No variables, no components, no auto-layout. Two elements total.

## Layout

The entire footer is a rule and one line of text.

| Element | Node | Geometry |
|---|---|---|
| rule | `41:118` | `left: 71; top: 7349; 1334×1` |
| "© Jabez Joshua Vestidas" | `35:5664` | `left: 85; top: 7366; width: 639` |

Everything below y ≈ 7395 (text bottom) to the frame end at 7580 is **empty background** — roughly
185 px of trailing whitespace. That is the designed bottom padding of the page.

Note `left: 71` for the rule and `left: 85` for the text: the text is indented **14 px** past the rule's
left edge. Every other section aligns text to the rule. Almost certainly drift.

Also: the rule's left offset of **71** is a fourth distinct gutter value on the page (41, 53, 68, 71 —
overview defect 8). This one is used exactly once.

The text node is `width: 639` for a string that occupies far less — a leftover text-box drag, not a
constraint. Use natural width.

### Build guidance

```
<footer class="border-t border-[#363636] mx-auto max-w-[1334px] pt-[17px] pb-[185px]">
  <p class="text-[24px]">© Jabez Joshua Vestidas</p>
</footer>
```

Load-bearing values: the **17 px** gap from rule to text (7366 − 7349), the 24 px type size, and the
1334 px rule width. The `left` values become one gutter — recommend 68, matching the majority.

The 185 px trailing space should be real bottom padding on the footer (or the page wrapper), not an
empty spacer div.

## Type

| Element | Node | Family | Size | Line-height | Colour | Transform |
|---|---|---|---|---|---|---|
| "© Jabez Joshua Vestidas" | `35:5664` | **General Sans** Regular | **24** | normal | `#ffffff` | none |

No letter-spacing. No `text-transform` — this is one of the few text nodes on the page rendered in its
authored case.

This is the **only** text in the footer. There are no footer links, no social row, no nav, no
back-to-top, no secondary legal line.

### Duplicate content — confirmed

This string appears **twice on the page** (overview defect 5):

| Location | Node | y | Size | Family |
|---|---|---|---|---|
| Hero, top-left | `22:4371` | 12 | **12 px** | General Sans Regular |
| Footer | `35:5664` | 7366 | **24 px** | General Sans Regular |

Same content, same colour, same family, **different size**. The hero instance reads as a fixed
overlay/watermark; the footer instance as a conventional copyright. Both should not be marked up as the
page's canonical copyright — pick one to be semantic (the footer) and treat the hero one as decorative,
or better, raise the duplication at Phase 6. Do not silently delete either during Phase 3.

Note also the copyright has **no year**. Whether that is intentional is `UNKNOWN`.

## Colour

| Value | Role |
|---|---|
| `#ffffff` | the copyright text |
| `#363636` | the rule (`rule-line-1.svg` stroke) |

Both raw hex. Background is inherited page `#11141c`; the footer paints no background of its own.

The contact section's background texture (`35:5669`) ends at y 7323, i.e. **26 px above** the footer
rule — so the footer sits on flat `#11141c` with no texture behind it. Confirm against the screenshot.

## Assets

| Path | Alt text |
|---|---|
| `public/figma/rule-line-1.svg` | **do not ship** — replace with `border-top: 1px solid #363636` |

No images, icons, or logos in this section.

## Components to extract

| Proposed component | Instances | Figma component name |
|---|---|---|
| `Rule` (1334×1, `#363636`) | 1 here, 14 page-wide | none — no Figma components exist in this file |

The footer itself is too thin to warrant a component beyond a `<footer>` element, but it should be
owned by the layout/shell rather than by a section builder, since it is the page's terminal element.

## Uncertainties

- Whether the copyright should include a year — none is present. `UNKNOWN`.
- **U6** — no footer links of any kind. Whether the footer is intentionally minimal or unfinished is
  `UNKNOWN`; given the design has a full social rail in the hero, a bare footer may be deliberate.
- Rule at `left: 71`, text at `left: 85` — 14 px misalignment; canonical gutter `UNKNOWN`.
- The 185 px of trailing whitespace: whether that is designed bottom padding or just where the frame
  happened to end is `UNKNOWN`. Reproduce it; it reads fine either way.
- **U3** — no sub-1440 behaviour designed.
- Whether the duplicated copyright (hero + footer) is intentional. `UNKNOWN` — see above.
