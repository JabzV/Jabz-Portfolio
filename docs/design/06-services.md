# 06 · Services

- **y-range:** 4568–5737 (height 1169)
- **Reference:** `docs/design/screens/dark-mode-full.png`, crop **y 4568–5737**
- **Gaps:** 150 px above (experiences end 4418), 265 px below (contact rule at 6002)

## Token situation

No variables, no components, no auto-layout. The four service items are copy-pasted absolute blocks —
which is how all four ended up numbered `//1`.

## Layout

### Header

| Element | Node | Geometry |
|---|---|---|
| top rule | `35:5671` | `left: 68; top: 4568; 1334×1` |
| "SERVICES" | `35:5662` | `left: 50%; top: 4685`, `transform: translateX(-50%)`, `width: 694`, `text-align: center` |

This heading is centred **properly** (50 % + transform), unlike "FEATURED WORK" (hard `left: 605`).
Use this one as the pattern for `SectionHeading`.

There is no subtitle in this section — unlike Featured Work and Experiences, which both have a 28 px
Glitch Goblin subtitle. Flag as an intentional difference or omission; `UNKNOWN`.

### The four service items

Each item is a **1334×136** block at `left: 41`, with a fixed internal structure. Row pitch is a clean
**240 px**.

| # | Service | Node | top |
|---|---|---|---|
| 1 | UI/UX DESIGN | `40:48` | 4881 |
| 2 | FRONTEND DEVELOPment | `40:49` | 5121 |
| 3 | BACKEND ENGINEERing | `40:56` | 5361 |
| 4 | SYSTEM ARCHITECTURE | `40:63` | 5601 |

`left: 41` for the items vs `left: 68` for the section's top rule — a **27 px mismatch** (overview
defect 8). The four in-item rules inherit x 41 from their parent, so the top rule at 68 is 27 px
narrower on the left than the four below it. Pick one gutter; recommend 68 (matching every other
section) and flag the change.

### Item internal layout (local coordinates, 1334×136)

Identical in all four:

| Part | left | top | Size | Notes |
|---|---|---|---|---|
| title block (375×35) | 28 | 0 | — | wrapper |
| ↳ `//n` number | +0 | +15 | 22 | inside the 375×35 block |
| ↳ title | +39 | +0 | 48 | |
| rule (1334×1) | 0 | **49** | — | `rule-line-1.svg` |
| description | 129 | 66 | 24 | `width: 1135`, `height: 70` |

So: title at the top-left, a full-width hairline **49 px** down, then the description indented 129 px
below it. The 375×35 title wrapper with the `+39` / `+15` offsets is the **same `NumberedTitle`
structure as Featured Work** — extract once.

Description `height: 70` at 24 px is roughly two lines; item 2's text is much longer than the others
and will overflow 70 px. Figma reports a fixed height, so it is **clipped or overflowing in the
design** — check the screenshot crop. Recommend `height: auto` in code and flag the deviation.

### Build guidance

```
<section>
  <h2 class="text-center …">SERVICES</h2>
  <ol>
    <li class="…">                       /* 4 items, 240px pitch */
      <ServiceItem number="//1" title="UI/UX Design" body="…" />
    </li>
  </ol>
</section>
```

Everything here is a plain vertical stack — this is the section where absolute positioning is *least*
justified. Load-bearing values: the **39 px** number-to-title indent, the **15 px** number drop, the
**49 px** title-to-rule distance, the **129 px** description indent, and the **1334 px** rule width.
The `top` values (4881/5121/5361/5601) are pure stacking and become a uniform row height/margin.

Item pitch 240 with item height 136 leaves **104 px** of vertical gap between items.

## Type

| Element | Family | Size | Colour | Transform |
|---|---|---|---|---|
| "SERVICES" (`35:5662`) | SDDystopianDemo Regular | **112** | `#ffffff` | uppercase, centred |
| service titles (`40:28`, `40:52`, `40:59`, `40:66`) | SDDystopianDemo Regular | **48** | `#ffffff` | uppercase |
| `//n` numbers (`40:29`, `40:53`, `40:60`, `40:67`) | SDDystopianDemo Regular | **22** | `#868686` | uppercase |
| descriptions (`40:46`, `40:50`, `40:57`, `40:64`) | Glitch Goblin Regular | **24** | `#8d8d8d` | uppercase |

All `line-height: normal`, no letter-spacing.

### Content

Source strings have inconsistent casing (rendered uppercase by CSS, so invisible — keep as authored):

| # | Title (as authored) | Number (as authored) |
|---|---|---|
| 1 | `UI/UX DESIGN` | `//1` |
| 2 | `FRONTEND DEVELOPment` | **`//1`** |
| 3 | `BACKEND ENGINEERing` | **`//1`** |
| 4 | `SYSTEM ARCHITECTURE` | **`//1`** |

Descriptions (verbatim, mixed case in source):

1. `Provides end-to-end web design services using Figma, Framer, and Webflow, from wireframes and mockups to responsive, high-performance websites.`
2. `Builds modern, responsive web applications using React, Next.js, Vue.js, and Tailwind CSS. FULLY INTEGRATES WEB ANIMATION WITH GSAP. Delivers fast, USER FRIENDLY, and accessible user interfaces with seamless API integration and optimized performance.`
3. `Builds secure, scalable backend systems using Laravel, Node.js, RESTful APIs, MySQL, PostgreSQL, and MariaDB. Experienced with Postman for API testing, AWS cloud services, server deployment, and database design, optimization, and management.`
4. `Designs scalable, secure, and maintainable system architectures that support long-term growth. Experienced in software architecture, database design, API ecosystems, cloud infrastructure, and distributed systems.`

Description 2 is 253 characters vs 148/236/210 — it is the one that will break the fixed 70 px height.

## Numbering defect — CONFIRMED

**All four items are numbered `//1`.** Verified in the design context: nodes `40:29`, `40:53`, `40:60`,
`40:67` each contain the literal string `//1`.

This is overview defect 1. It is unambiguously a copy-paste error — Featured Work's equivalent numbers
run `//1`–`//4` correctly, so the intended sequence is clear. **Do not fix it in Phase 3.** Parity
means shipping four `//1`s so `visual-qa` can diff cleanly against the Figma. Raise it at Phase 6 for
the user to approve `//1`–`//4`.

Practical note for `component-builder`: pass the number in as a prop (`number="//1"` four times) rather
than hardcoding, so the Phase 6 fix is a one-line data change.

## Colour

| Value | Role |
|---|---|
| `#ffffff` | "SERVICES", service titles |
| `#868686` | `//n` numbers |
| `#8d8d8d` | descriptions |
| `#363636` | all five rules (`rule-line-1.svg` stroke) |

All raw hex. Section background is inherited page `#11141c`; this section paints no background of its
own and contains no images.

`#868686` and `#8d8d8d` sit 7 values apart and are visually near-identical. They are consistently
applied across the page (numbers vs body), so they are probably intentional — but `token-architect`
should confirm they earn two separate tokens rather than collapsing to one.

## Assets

| Path | Alt text |
|---|---|
| `public/figma/rule-line-1.svg` | **do not ship** — five instances here; replace with `border-top: 1px solid #363636` |

No other assets. Five rules total: one section rule (`35:5671`) plus one per item (`40:30`, `40:54`,
`40:61`, `40:68`).

Every rule in Figma is wrapped in a `flex items-center justify-center` box with a **`rotate(-0.13deg)`**
child at width **1334.003**. That sub-tenth-degree rotation and the fractional width are Figma
artifacts of a hand-drawn line, not design intent — **ignore both** and render a straight 1334 px
border. (If `visual-qa` reports sub-pixel differences along the rules, this is why.)

## Components to extract

| Proposed component | Instances | Figma component name |
|---|---|---|
| `ServiceItem` (numbered title + rule + indented description) | 4 | none — no Figma components exist in this file |
| `NumberedTitle` (375×35, `//n` at +0/+15, title at +39/+0) | 4 here + 4 in Featured Work | none |
| `SectionHeading` (112 px, centred via 50 % + transform) | shared with `04-featured-work.md` | none |
| `Rule` | 5 here, 14 page-wide | none |

`NumberedTitle` is shared verbatim with Featured Work — same 375×35 box, same 39 px indent, same 15 px
drop, same 48 px/22 px sizes, same `#ffffff`/`#868686` colours. Build it once.

## Uncertainties

- **Confirmed defect, not unknown:** all four numbers are `//1`.
- **U7** — no hover/focus state on service items; whether they are interactive is `UNKNOWN`.
- **U6** — no links out of any service item.
- Gutter: items at `left: 41`, section rule at `left: 68`. Canonical value `UNKNOWN`; recommend 68.
- Description fixed `height: 70` vs item 2's overflowing text — whether the design clips it or the
  height is vestigial is `UNKNOWN`. Verify against the screenshot crop before choosing `auto`.
- Absence of a section subtitle (present in the two comparable sections) — `UNKNOWN` whether omitted.
- **U3** — 1334 px fixed-width items with a 129 px text indent have no designed sub-1440 behaviour.
