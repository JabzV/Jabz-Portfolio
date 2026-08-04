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

const SCANLINE_SRC = "/assets/texture-scanline.png";
/** Intrinsic size of texture-scanline.png — needed for the aspect ratio only. */
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
        className="absolute max-w-none"
        style={inner}
      />
    </div>
  );
}

/** Figma 27:4421 — hatched progress strip, caption baked into the source. */
const PROGRESS_STRIP = {
  box: { width: "567px", height: "84px" },
  inner: { width: "338.62%", height: "1285.71%", left: "-17.46%", top: "-1007.14%" },
} as const;

/** Figma 30:4986 — small crop beside the statement's first line. */
const STATEMENT_CROP = {
  box: { width: "283px", height: "119px" },
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
        src="/assets/intro/cityscape-bg.jpg"
        alt=""
        aria-hidden="true"
        fill
        sizes="100vw"
        quality={40}
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
          <p className="text-statement font-accent text-fg-muted max-w-5xl uppercase xl:ml-7">
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
