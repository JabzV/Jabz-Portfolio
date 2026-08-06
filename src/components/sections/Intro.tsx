import Image from "next/image";
import type { CSSProperties } from "react";

import { NotchedButton } from "@/components/ui/NotchedButton";
import { intro } from "@/data/site";

/**
 * Intro / statement — Figma y 944–1663 (docs/design/03-intro.md).
 *
 * Layers, expressed in flow wherever possible:
 *   1. cityscape background at 10% — `fill`, so the parent <section> supplies
 *      the box and no oversized DPR variant is fetched for a 10% texture;
 *   2. two decorative crops of `texture-scanline.png` — the hatched progress
 *      strip at the top, and the small block beside the statement's first line;
 *   3. the statement paragraph (mixed-case in the DOM, uppercased in CSS);
 *   4. the right-aligned "MORE ABOUT ME" button (the shared NotchedButton).
 *
 * The statement is body copy, not a heading — the hero owns the document <h1>
 * and this section has no title in the design, so no <h*> is introduced.
 *
 * Per the page-wide rule this section owns its TOP padding only; Featured Work
 * contributes the 180px gap below as its own top padding.
 */

const SCANLINE_SRC = "/assets/texture-scanline.webp";
/** Intrinsic size of the scanline source — needed for the aspect ratio only. */
const SCANLINE_W = 1920;
const SCANLINE_H = 1080;

/**
 * A fixed-size window onto `texture-scanline.png`, reproducing Figma's
 * "outer frame with overflow:hidden + oversized offset inner image" crop
 * verbatim. The percentages are the Figma values; keeping them as percentages
 * rather than resolving them to px means the crop survives a change to `box`.
 *
 * `max-w-none` is required: Tailwind preflight's `img { max-width: 100% }`
 * would otherwise clamp the inner image to the window width and destroy the
 * crop. Geometry lives in `style` because these are one-off Figma coordinates,
 * not design-system values — same convention as NotchedButton's clip-path.
 */
function ScanlineCrop({
  box,
  inner,
  className = "",
}: {
  box: CSSProperties;
  inner: CSSProperties;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none relative overflow-hidden ${className}`}
      style={box}
    >
      <Image
        src={SCANLINE_SRC}
        alt=""
        width={SCANLINE_W}
        height={SCANLINE_H}
        // `unoptimized`: the page zoom makes the browser resolve `sizes` against
        // the UNZOOMED layout, so the optimizer served variants well below the
        // rendered size and upscaled them. Serving the source verbatim is the
        // only reliable way to keep these crisp — same fix as the hero cover.
        unoptimized
        className="absolute max-w-none"
        style={inner}
      />
    </div>
  );
}

/**
 * Both crop windows are drawn at a fraction of their Figma size, and that is a
 * SHARPNESS decision rather than a layout one.
 *
 * The inner percentages blow `texture-scanline` up well beyond its own
 * resolution, so these windows were showing upscaled pixels. Shrinking the
 * window shrinks the inner image with it — the percentages are relative to the
 * box — so the SAME source region is shown at higher pixel density. The crop is
 * unaffected, because every offset is a percentage too.
 *
 * Effective density at a 2545px viewport, where the page `zoom` is x1.59
 * (the zoom multiplies through, so it is the figure that actually matters):
 *
 *            1.00 (Figma)     0.78          0.62  <- now
 *   strip      x2.04          x1.59         x0.99
 *   badge      x2.60          x2.03         x1.26
 *
 * At 0.62 the strip lands essentially 1:1 against its 1920px source and the
 * badge is close behind — both a long way from the 2.6x smear the Figma sizes
 * produced. Below ~0.55 the strip starts to read as a thin line rather than a
 * hatched panel, so this is near the useful floor.
 *
 * Do not restore the Figma sizes without also supplying a higher-resolution
 * source; the geometry was never the problem, the pixel budget was.
 */
const CROP_SCALE = 0.62;

/**
 * Sizes are DERIVED from the Figma dimensions rather than written out, so the
 * two axes can never drift apart. Rounding them independently once put a 0.4%
 * error into the aspect ratio, which skews the hatching — the inner image is
 * positioned in percentages, so a non-uniform box scale shears the crop.
 */
const scaleBox = (w: number, h: number) => ({
  width: `${(w * CROP_SCALE).toFixed(2)}px`,
  height: `${(h * CROP_SCALE).toFixed(2)}px`,
});

/** Figma 27:4421 — hatched progress strip, caption baked into the source. */
const PROGRESS_STRIP = {
  box: scaleBox(567, 85),
  inner: { width: "338.62%", height: "1285.71%", left: "-17.46%", top: "-1007.14%" },
} as const;

/** Figma 30:4986 — small crop beside the statement's first line. */
const STATEMENT_CROP = {
  box: scaleBox(283, 119),
  inner: { width: "868.78%", height: "1161.29%", left: "-675.57%", top: "-726.88%" },
} as const;

export function Intro() {
  return (
    <section
      id="about"
      aria-label="Introduction"
      // `overflow-x-clip`, not `overflow-hidden`: the cityscape below is
      // deliberately taller than this section and must be free to spill past the
      // bottom edge. `overflow-x: clip` still contains the progress strip's
      // horizontal overhang (so no h-scrollbar) while leaving the Y axis
      // visible — `overflow-x: hidden` could not, since hidden on one axis
      // forces the other to `auto`. Same utility FeaturedWork already uses.
      className="relative overflow-x-clip pt-20 md:pt-40 xl:pt-68"
    >
      {/*
        The cityscape runs PAST the section's bottom edge, continuing behind the
        gap under "MORE ABOUT ME" and fading out just short of FeaturedWork's
        top rule. Ending it flush with the button cut the skyline off on a hard
        horizontal line exactly where the eye was already travelling.

        Done with an oversized wrapper rather than padding on the <section>,
        because the inter-section gap is FeaturedWork's `pt` by project
        convention and this must not disturb it: the extension is pure paint,
        and no content moves.

        The negative bottoms stay just inside each of FeaturedWork's top-padding
        steps (80/112/144/180px), leaving ~24-40px of clean space so the texture
        never crowds or touches the rule:
            base -56 of 80 · sm -80 of 112 · lg -108 of 144 · xl -140 of 180

        The mask fades the last 64px to nothing. Moving the cut lower was not
        enough on its own — a hard horizontal edge across the full width is what
        made the old version read as clipped, and simply relocating it 140px down
        would have reproduced the same artefact in a new place. Fading means
        there is no edge to notice, so the skyline recedes into the dark instead
        of being sliced.

        64px is deliberately much SHORTER than the 140px overhang, and that ratio
        matters. A first attempt used 180px, which is longer than the overhang,
        so the fade started inside the section and — against a texture already at
        6% opacity — erased everything below the button. It looked like the image
        had been shortened rather than extended, i.e. the exact opposite of the
        intent. Keep the fade under half the overhang: the extension has to be
        visible for most of its length to be worth having.

        `-z-10` is load-bearing. Absolutely-positioned elements otherwise paint
        above later STATIC content, so the overhang would cover FeaturedWork's
        border-t. Negative z drops it beneath all in-flow content while staying
        above the canvas background — verified: no wrapper in page.tsx or
        layout.tsx paints a background that would occlude it.
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 -bottom-14 [mask-image:linear-gradient(to_bottom,#000_calc(100%-64px),transparent)] sm:-bottom-20 lg:-bottom-27 xl:-bottom-35"
      >
        {/* Decorative. Rendered at opacity-6, never worth a 4K variant. */}
        <Image
          src="/assets/intro/cityscape-bg.webp"
          alt=""
          fill
          // `unoptimized` rather than sizes+quality. Measured: the optimizer was
          // serving a 490px-wide variant of a 736px source and stretching it to
          // 2542px — a 5.19x upscale, the blurriest thing in the section. The page
          // `zoom` is why: the browser resolves `sizes` against the UNZOOMED layout
          // and picks far too small. Serving the source verbatim caps the upscale
          // at 3.45x. Re-encoded jpg -> webp so this costs 88KB, not 163KB.
          unoptimized
          // 0.10 -> 0.06: lifts fg-muted over this texture from a 4.24:1
          // worst-case pixel to ~4.78:1, clearing 4.5:1 at every width. Matches
          // the contact texture. An intentional deviation from the Figma.
          className="object-cover opacity-[0.06]"
        />
      </div>

      {/*
        Progress strip: design x 855–1422, y 956–1040 — 12px below the section's
        top edge, overflowing the right gutter so its right edge sits 18px inside
        the 1440 frame. Anchored to a centred max-w-shell track so it holds
        position above 1440px; the section's overflow-hidden clips it below.
      */}
      <div className="pointer-events-none absolute inset-x-0 top-3 hidden lg:block">
        <div className="relative mx-auto max-w-shell">
          <ScanlineCrop
            box={{ ...PROGRESS_STRIP.box, right: "18px" }}
            inner={PROGRESS_STRIP.inner}
            className="absolute"
          />
        </div>
      </div>

      {/* Phase 4 reveal hooks. Attributes only — no structure or token change.
          The statement block and the button are the two staggered targets. */}
      <div data-reveal-group className="shell relative">
        <div data-reveal className="relative">
          {/* A flickering light source, not a flickering element.
              ═══════════════════════════════════════════════════════════════
              THE PARAGRAPH ITSELF NEVER ANIMATES. An earlier version flickered
              the <p>'s own opacity, and it read as the site glitching rather
              than as a lamp: dimming the whole element takes the OBJECT away,
              whereas a failing light only takes the LIGHT away. The object has
              to stay put for the eye to attribute the change to a fixture.

              So the glyphs are painted normally and permanently, and a twin span
              stacked over them carries nothing but the glow — `text-transparent`
              means its own glyphs never render, only their text-shadow. That
              span's opacity is what flickers.

              Three things fall out of the split, all of them wins:
                · The glow can swing its FULL range, 0.85 -> 0 -> 1. A glow only
                  ever ADDS luminance, so there is no contrast floor to respect.
                  The old version was pinned at 0.82 by a measured 3:1 bound and
                  could never be dramatic; this has no such ceiling.
                · It is compositor-only. Animating `text-shadow` directly would
                  re-rasterise a large blurred paragraph every frame; animating
                  one layer's opacity is free (project rule C8).
                · Reduced motion holds it lit instead of having to pick between a
                  dimmed paragraph and no effect.

              Rhythm: steady for ~95% of a 5.3s cycle, then a double-blink, a
              deeper dip and a quick tick, unevenly spaced so it never reads as a
              sine wave. Edges snap (`linear` + paired stops, ~3ms), dark runs
              are held 42-98ms, and each one ends on a re-ignition spike to full
              — arcs overshoot when struck, which is the detail that sells it.
              0.75 flashes/sec, well under WCAG 2.3.1's 3/sec threshold.

              The twin must wrap identically to the original or the glow
              desynchronises from the glyphs: `inset-0` on a padding-free <p>
              gives it the exact same width, and font, tracking and `uppercase`
              are all inherited. Do not add padding to the <p> without moving
              the span's box to match. */}
          <p className="text-statement font-accent text-fg-muted relative max-w-5xl uppercase xl:ml-7">
            {intro.statement}
            <span
              aria-hidden="true"
              className="animate-hero-neon text-shadow-glow-statement pointer-events-none absolute inset-0 text-transparent"
            >
              {intro.statement}
            </span>
          </p>

          {/* Design x 1058–1341: right-8 lands the box at 1340 in the 1440 frame. */}
          <ScanlineCrop
            box={STATEMENT_CROP.box}
            inner={STATEMENT_CROP.inner}
            className="absolute top-9 right-8 hidden lg:block"
          />
        </div>

        <div data-reveal className="mt-16 flex sm:justify-end md:mt-24">
          <NotchedButton href={intro.cta.href} variant="accent" className="w-full sm:w-auto">
            {intro.cta.label}
          </NotchedButton>
        </div>
      </div>
    </section>
  );
}
