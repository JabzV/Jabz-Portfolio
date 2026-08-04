import { MarqueeMotion } from "@/components/motion/MarqueeMotion";
import { marqueeItems } from "@/data/site";

/**
 * Separator between phrases. The Figma string is
 * "…DEVELOPER. - …DESIGNER. - …ENGINEER. - I AM A FUTURE DEVELOPER" — the fourth
 * phrase is the author's hand-made seam and has no trailing separator, so a naive
 * duplicate butts "…DEVELOPERI AM A…" together (02-marquee.md). Here the list is
 * the three canonical phrases and EVERY phrase gets a trailing separator, so the
 * A→B seam between the two copies reads as just another " - ".
 */
const SEPARATOR = " - ";

/** One full pass of the phrase list. Duplicated below to make the loop seamless. */
const TRACK_COPY = marqueeItems
  .map((phrase) => `${phrase}${SEPARATOR}`)
  .join("");

/**
 * Marquee — full-bleed scrolling statement band. Figma y 842–927.
 *
 * LAYOUT
 * Top margin only — the page rule is that a section owns its leading space and
 * never its trailing space, so the 17px below the band belongs to Intro's top
 * padding. The design's 41px gap (hero ends 801, band top 842) is not on the 4px
 * spacing scale, so `xl:mt-10` (40px) is used rather than an arbitrary [41px];
 * the ramp below xl shrinks with the fluid font size.
 *
 * No explicit height. SDDystopian's normal line box is (557 + 174) / 1000 =
 * 0.731em, which at the 116px `text-wordmark` ceiling is 84.8px — the design's
 * 85px container height is exactly this natural line box, so leaving it
 * unconstrained reproduces the design at xl AND scales with the fluid font size
 * at every narrower width. Cap height is 555/1000 (64px at 116px), so nothing is
 * actually vertically clipped; the spec's "glyphs are clipped" note describes an
 * effect the metrics show does not occur.
 *
 * MOTION — Phase 4, implemented in `<MarqueeMotion>` below.
 * That component is a behaviour-only client leaf: it targets
 * `[data-marquee-track]` and runs
 *   gsap.to(track, { xPercent: -50, ease: "none", repeat: -1, duration })
 * with `duration = track.scrollWidth / 2 / 173.1`, measured at runtime after
 * `document.fonts.ready`. 173.1 px/s is the one durable number from the Figma
 * timeline (5340px / 30.841s); the exported −5340px translate does not divide
 * the content and would visibly jump, so it is deliberately not encoded.
 * This section itself stays a Server Component and renders the band static —
 * no transform, no @keyframes — so it is readable without JS and under
 * `prefers-reduced-motion: reduce`, where the tween is never built (02-marquee.md).
 */
export function Marquee() {
  return (
    <section className="my-4 w-full overflow-clip sm:mt-8 lg:my-5 xl:my-6">
      <div
        data-marquee-track
        className="text-wordmark font-display text-display text-shadow-display flex w-max flex-nowrap"
      >
        <span className="shrink-0 whitespace-nowrap">{TRACK_COPY}</span>
        {/* Copy B: visual continuity only — the phrases are already in the
            accessibility tree once, above. */}
        <span
          aria-hidden="true"
          className="shrink-0 select-none whitespace-nowrap"
        >
          {TRACK_COPY}
        </span>
      </div>
      <MarqueeMotion />
    </section>
  );
}
