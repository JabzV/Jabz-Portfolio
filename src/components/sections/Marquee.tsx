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
const TRACK_COPY = marqueeItems.map((phrase) => `${phrase}${SEPARATOR}`).join("");

/**
 * Marquee — full-bleed scrolling statement band. Figma y 842–927.
 *
 * LAYOUT
 * No explicit height. SDDystopian's normal line box is (557 + 174) / 1000 =
 * 0.731em, which at the 116px `text-wordmark` ceiling is 84.8px — the design's
 * 85px container height is exactly this natural line box, so leaving it
 * unconstrained reproduces the design at xl AND scales with the fluid font size
 * at every narrower width. Cap height is 555/1000 (64px at 116px), so nothing is
 * actually vertically clipped; the spec's "glyphs are clipped" note describes an
 * effect the metrics show does not occur.
 *
 * MOTION — Phase 4, not here.
 * `motion-engineer`: target `[data-marquee-track]`. The track holds exactly two
 * identical copies of the phrase list, so a seamless loop is
 *   gsap.to(track, { xPercent: -50, ease: "none", repeat: -1, duration })
 * with `duration = track.scrollWidth / 2 / 173.1`, MEASURED at runtime after the
 * font loads. 173.1 px/s is the one durable number from the Figma timeline
 * (5340px / 30.841s); the exported −5340px translate does not divide the content
 * and would visibly jump, so it is deliberately not encoded here. Nothing is
 * animated at build time and no @keyframes exist — the band renders static.
 * Reduced motion must keep it static (02-marquee.md).
 */
export function Marquee() {
  return (
    <section
      aria-label="Personal statement marquee"
      className="w-full overflow-clip"
    >
      <div
        data-marquee-track
        className="text-wordmark font-display text-display text-shadow-display flex w-max flex-nowrap"
      >
        <span className="shrink-0 whitespace-nowrap">{TRACK_COPY}</span>
        {/* Copy B: visual continuity only — the phrases are already in the
            accessibility tree once, above. */}
        <span aria-hidden="true" className="shrink-0 select-none whitespace-nowrap">
          {TRACK_COPY}
        </span>
      </div>
    </section>
  );
}
