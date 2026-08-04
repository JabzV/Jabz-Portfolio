# 02 · Marquee

- **y-range:** 842–927 (height 85)
- **Reference:** `docs/design/screens/dark-mode-full.png`, crop **y 842–927**
- **Gaps:** 41 px above (hero ends 801), 17 px below (intro starts 944)
- **This is the only animated node on the page.**

## Token situation

No variables, no components, no auto-layout. Colour and size are raw literals.

## Layout

| Part | Node | Geometry |
|---|---|---|
| clip container | `28:4423` | `left: 17px; top: 842px; 1440×85`, `overflow: clip` |
| scrolling text | `27:4388` | `left: 0; top: 0; width: 6444px` inside the container |

**The container is at `left: 17px` with `width: 1440px`**, so it extends to x 1457 and is clipped by
the 1440-wide frame (overview defect 9). Intended value is almost certainly `left: 0` — but the
design says 17, so this is `UNKNOWN`. Recommend `left: 0` / full-bleed in code and log the deviation.

Container height is 85 px while the text is 116 px SDDystopianDemo, so **the glyphs are vertically
clipped top and bottom by design** — this is the visual effect. Do not "fix" it by growing the
container.

### Build guidance

Replace with a full-bleed strip:

```
<div class="relative w-full overflow-clip h-[85px]">   /* not left-[17px] */
  <div class="flex w-max whitespace-nowrap"> … repeated text … </div>
</div>
```

The single 6444 px text node should become **duplicated content** in code (see the loop note below),
not one giant string translated by a fixed pixel amount.

## Type

One text node only.

| Property | Value |
|---|---|
| Family | `SDDystopianDemo` Regular |
| Size | **116 px** |
| Line-height | `normal` |
| Letter-spacing | none set |
| Colour | `#f8eeee` |
| Effect | `text-shadow: 0px 4px 4px rgba(0,0,0,0.25)` |
| Width | 6444 px (fixed) |
| Content | `I AM A FUTURE DEVELOPER. - I AM A FUTURE DESIGNER. - I AM A FUTURE ENGINEER. - I AM A FUTURE DEVELOPER` |

The string is **not** a clean set of repeats: it is DEVELOPER, DESIGNER, ENGINEER, DEVELOPER — the
first phrase recurs at the end (an author's attempt at a manual seam). Note "DEVELOPER" appears
twice and there is no trailing " - " separator, so a naive duplicate-and-loop will butt
"…DEVELOPERI AM A…" together. Add the separator explicitly in code.

## Colour

| Value | Role |
|---|---|
| `#f8eeee` | marquee text — same value as the hero wordmark; propose one shared `--color-display` token |
| `rgba(0,0,0,0.25)` | text-shadow |

Section background is inherited page `#11141c`.

## Motion spec

From `get_motion_context` (`recursive: true`) on `4:3`. **`27:4388` is the only animated node in the
entire frame.**

| Property | Value |
|---|---|
| Animated property | `x` (translateX) |
| Initial | `x: 0` |
| Duration | **30.841 s** |
| Easing | **`linear`** |
| Repeat | **`Infinity`** |
| Direction | leftward (negative x) |
| Nominal x-range | **0 → −5340 px** |
| Keyframe count | 100 samples |

### The keyframe data is not uniform — read this before implementing

Figma exported 100 samples. From `t=0` to `t≈0.9889` the values are a smooth ease-like ramp reaching
only **−4326.858 px**; the remaining **−1013 px** is crammed into the final **0.36 %** of the
timeline (`t` 0.9964 → 1.0), one sample per 0.0001. That tail is a sampling artifact of Figma's
exporter, not a designed snap — reproducing it literally would produce a violent jolt at the end of
every 30.841 s cycle.

Representative samples:

| t | x |
|---|---|
| 0 | 0 |
| 0.0162 | −92.872 |
| 0.25 (interp) | ≈ −1360 |
| 0.5026 | −2509.004 |
| 0.75 (interp) | ≈ −3560 |
| 0.9889 | −4326.858 |
| 0.9964 | −4359.998 |
| 0.9990 | −5284.390 |
| 1.0 | **−5340** |

The samples also decelerate across the main ramp (first interval −92.87, later intervals shrink to
about −20), so the exported curve is closer to an ease-out than the declared `linear`. Combined with
`ease: "linear"` on the transition, Figma's intent is a **constant-velocity scroll**; the sample
values are what the timeline happened to bake.

### Recommended implementation for `motion-engineer`

Treat the design intent as a constant-velocity infinite marquee:

- **Velocity:** 5340 px ÷ 30.841 s = **173.1 px/s**. Preserve this — it is the one number that
  determines perceived speed and must survive whatever loop distance you choose.
- **Do not** animate to a hardcoded −5340. That distance does not divide the 6444 px text width
  (6444 − 5340 = 1104 ≠ 0 and ≠ 1440), so the literal animation ends mid-phrase and snaps — **U10**.
- Instead: duplicate the text (with an explicit ` - ` separator), then `xPercent: -50` on the wrapper,
  `ease: "none"`, `repeat: -1`, and set `duration = totalWrapperWidth / 2 / 173.1`. For a duplicated
  6444 px + separator, that is roughly **37 s** — recompute from the measured width at runtime rather
  than hardcoding, since the width depends on the final font (and the font is a BLOCKER, so it will
  change).
- GSAP form: `gsap.to(track, { xPercent: -50, ease: "none", repeat: -1, duration })`.

### Reduced motion — required, not in the design

The design has no reduced-motion variant. `prefers-reduced-motion: reduce` **must** be honoured
regardless: a 30 s continuous 116 px scroll is exactly the pattern WCAG 2.2.2 targets. Wrap in
`gsap.matchMedia()` and, under reduce, render the text static (showing the first phrase, no
transform). Do not merely slow it down.

## Assets

None. The marquee is pure text.

## Components to extract

| Proposed component | Figma component name |
|---|---|
| `Marquee` (clip container + duplicated track + GSAP loop) | none — no Figma components exist in this file |

Only one instance on the page, but it should still be its own component so the reduced-motion and
width-measurement logic lives in one place.

## Uncertainties

- **U10** — the animated x-range (−5340) does not correspond to a seamless loop of the 6444 px text.
  Whether the designer intended a seam, or the Figma timeline was simply eyeballed, is `UNKNOWN`.
  Resolution: build a true seamless loop at 173.1 px/s and confirm with the user at Phase 5.
- Container `left: 17px` — intended value `UNKNOWN`; recommend 0.
- Whether the 85 px clip of 116 px glyphs is the intended crop amount, or just the height the frame
  happened to be dragged to, is `UNKNOWN`. It reads as intentional in the screenshot.
- Whether the marquee should pause on hover / on scroll-out-of-view: not designed, `UNKNOWN`.
  (Pausing off-screen is a free perf win and should be proposed at Phase 6, not assumed now.)
