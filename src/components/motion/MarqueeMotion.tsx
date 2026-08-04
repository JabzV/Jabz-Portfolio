"use client";

import { gsap, ScrollTrigger, useGSAP } from "./gsap";

/**
 * The one durable number from the Figma timeline: 5340 px / 30.841 s.
 * Figma's exported keyframes cram the final 1013 px into the last 0.36 % of the
 * timeline, which would jolt every cycle, and −5340 px does not divide the track
 * content — so the distance is ignored and only the velocity is preserved
 * (docs/design/02-marquee.md).
 */
const PIXELS_PER_SECOND = 173.1;

/** Resize debounce. Long enough to sit out a drag-resize, short enough to feel instant. */
const RESIZE_DEBOUNCE_MS = 200;

type Props = {
  /**
   * The track to translate. Must contain exactly two identical copies of the
   * content, because the loop is `xPercent: -50` — half the track width lands
   * copy B precisely where copy A began, with no measured pixel distance and
   * therefore no seam.
   */
  trackSelector?: string;
};

/**
 * Marquee motion. Renders nothing — it is a behaviour-only client leaf mounted
 * inside the server-rendered <Marquee> section so the section itself stays a
 * Server Component.
 *
 * The band is fully readable before (and without) this component: the track is
 * server-rendered at `xPercent: 0` and no transform is applied unless the tween
 * is actually built.
 */
export function MarqueeMotion({ trackSelector = "[data-marquee-track]" }: Props) {
  useGSAP(() => {
    const track = document.querySelector<HTMLElement>(trackSelector);
    if (!track) return;

    const mm = gsap.matchMedia();
    let disposed = false;

    /**
     * `scrollWidth` depends on the loaded display face and on the fluid
     * `clamp()` font size, so it cannot be measured until fonts have settled.
     * Measuring against the fallback stack would set a wrong duration and the
     * marquee would run at the wrong speed for the rest of the session.
     */
    const start = async () => {
      try {
        await document.fonts?.ready;
      } catch {
        /* fonts API unavailable or rejected — fall through and measure anyway */
      }
      if (disposed) return;

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        let tween: gsap.core.Tween | undefined;

        const build = () => {
          tween?.kill();
          // Measure from an untransformed track: scrollWidth is unaffected by
          // transforms, but resetting keeps the restart visually clean.
          gsap.set(track, { xPercent: 0, willChange: "transform" });

          const loopDistance = track.scrollWidth / 2;
          if (loopDistance <= 0) return;

          tween = gsap.to(track, {
            xPercent: -50,
            ease: "none",
            repeat: -1,
            duration: loopDistance / PIXELS_PER_SECOND,
          });
        };

        build();

        let resizeTimer: ReturnType<typeof setTimeout>;
        const onResize = () => {
          clearTimeout(resizeTimer);
          resizeTimer = setTimeout(() => {
            build();
            ScrollTrigger.refresh();
          }, RESIZE_DEBOUNCE_MS);
        };
        window.addEventListener("resize", onResize);

        // Reduced-motion path and unmount both land here: the tween is killed
        // and matchMedia reverts the inline transform, leaving the text static.
        return () => {
          window.removeEventListener("resize", onResize);
          clearTimeout(resizeTimer);
          tween?.kill();
        };
      });
    };

    void start();

    return () => {
      disposed = true;
      mm.revert();
    };
  }, []);

  return null;
}
