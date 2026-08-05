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
 * Both crop windows are scaled to 0.78 of their Figma size, and that is a
 * SHARPNESS decision rather than a layout one.
 *
 * The inner percentages blow the source up beyond its own resolution, so the
 * windows were showing upscaled pixels. Measured at a 2545px viewport:
 *   strip  1920 source -> 1920 CSS  = 1.00x, then x1.59 page zoom = 1.59x
 *   badge  1920 source -> 2459 CSS  = 1.28x, then x1.59 page zoom = 2.03x
 *
 * Shrinking the window shrinks the inner image with it (the percentages are
 * relative to the box), so the SAME source region is shown at higher pixel
 * density. At 0.78 the badge lands at exactly 1:1 in CSS px — 221 x 8.6878 =
 * 1920 — and the strip goes below 1:1, where the browser downsamples and it
 * reads sharper still.
 *
 * Do not restore the Figma sizes without also supplying a higher-resolution
 * source; the geometry was never the problem, the pixel budget was.
 */

/** Figma 27:4421 — hatched progress strip, caption baked into the source. */
const PROGRESS_STRIP = {
  box: { width: "442px", height: "66px" },
  inner: { width: "338.62%", height: "1285.71%", left: "-17.46%", top: "-1007.14%" },
} as const;

/** Figma 30:4986 — small crop beside the statement's first line. */
const STATEMENT_CROP = {
  box: { width: "221px", height: "93px" },
  inner: { width: "868.78%", height: "1161.29%", left: "-675.57%", top: "-726.88%" },
} as const;

export function Intro() {
  return (
    <section
      id="about"
      aria-label="Introduction"
      className="relative overflow-hidden pt-20 md:pt-40 xl:pt-68"
    >
      {/* Decorative. `fill` + sizes: rendered at opacity-10, never worth a 4K variant. */}
      <Image
        src="/assets/intro/cityscape-bg.webp"
        alt=""
        aria-hidden="true"
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
        className="pointer-events-none object-cover opacity-[0.06]"
      />

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
          {/* Neon on/off. A tube light that has not quite settled: steady for
              most of the 8.6s cycle, with a shallow tick, a medium dip and a
              double-blink, none evenly spaced. Only ~9% of the loop is in motion,
              so the paragraph is still while it is being read.

              The floor is 0.82, not lower, and that is a contrast bound rather
              than taste: opacity compositing is NOT linear in contrast — the text
              blends toward the backdrop, so the ratio has to be recomputed on the
              composited colour. Over this section's own texture, 0.72 measures
              2.91:1, which fails even the 3:1 large-text threshold. 0.82 holds
              4.12:1 on `bg` and 3.35:1 worst-case over the texture, and only for
              ~130ms at the deepest point. Reduced motion pins it fully on. */}
          <p className="text-statement font-accent text-fg-muted animate-hero-neon max-w-5xl uppercase xl:ml-7">
            {intro.statement}
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
