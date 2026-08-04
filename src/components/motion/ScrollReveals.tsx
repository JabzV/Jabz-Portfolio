"use client";

import { gsap, ScrollTrigger, useGSAP } from "./gsap";

/**
 * Authored scroll reveals. The Figma specifies none (the marquee is the only
 * animated node in the file), so this is deliberately restrained: a short fade
 * and a small rise, once, no pinning, no scrub, no parallax.
 */
const DURATION = 0.5;
const Y_DISTANCE = 24;
const STAGGER = 0.08;
const EASE = "power2.out";

/** Fires as the group's top crosses 88 % of the viewport height — just as it appears. */
const START = "top 88%";

/**
 * Elements whose top already sits above this fraction of the viewport at setup
 * time are never hidden and never animated. Two reasons: anything visible at
 * first paint (the hero, the marquee, the top of the intro on a short viewport)
 * must not be faded in — that costs LCP and the reader — and hiding it after
 * hydration would flash.
 */
const ABOVE_FOLD_LIMIT = 0.9;

const GROUP_ATTR = "[data-reveal-group]";
const ITEM_ATTR = "[data-reveal]";

/**
 * ScrollReveals — behaviour-only client leaf, mounted once for the whole page.
 * Renders nothing, so every section stays a Server Component.
 *
 * Contract with the markup: a `data-reveal-group` element is one ScrollTrigger.
 * Its `data-reveal` descendants are the staggered targets; a group with no
 * `data-reveal` descendants reveals itself as a single target (used for list
 * rows, so each row triggers on its own rather than the whole list at once).
 * `data-reveal="fade"` opts a target out of the y rise — used where an element
 * shares collapsed borders with a neighbour and must not move.
 *
 * Nothing is hidden in the server-rendered class list. The hidden state is
 * applied from JS at setup, and only to elements that are off-screen at that
 * moment — so with JS disabled, with GSAP failing to load, or under
 * `prefers-reduced-motion: reduce`, every element renders in its final visible
 * state.
 */
export function ScrollReveals() {
  useGSAP(() => {
    const mm = gsap.matchMedia();
    let disposed = false;

    const setup = () => {
      if (disposed) return;

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const viewportLimit = window.innerHeight * ABOVE_FOLD_LIMIT;

        // Document order, which is also page order top-to-bottom, so
        // ScrollTriggers are created in refresh order and need no
        // refreshPriority.
        gsap.utils.toArray<HTMLElement>(GROUP_ATTR).forEach((group) => {
          const declared = gsap.utils.toArray<HTMLElement>(ITEM_ATTR, group);
          const candidates = declared.length > 0 ? declared : [group];

          const targets = candidates.filter(
            (el) => el.getBoundingClientRect().top > viewportLimit,
          );
          if (targets.length === 0) return;

          const rise = targets.filter((el) => el.dataset.reveal !== "fade");
          const fade = targets.filter((el) => el.dataset.reveal === "fade");

          // One ScrollTrigger per group, on the timeline — never on a child
          // tween. Both variants start at position 0 so the group reads as one
          // gesture.
          const tl = gsap.timeline({
            defaults: {
              duration: DURATION,
              ease: EASE,
              stagger: STAGGER,
              // Drops the inline opacity/transform/will-change once the reveal
              // is done, so nothing is left holding a composited layer or an
              // inline style that fights the stylesheet.
              clearProps: "opacity,transform,willChange",
            },
            scrollTrigger: { trigger: group, start: START, once: true },
          });

          if (rise.length > 0) {
            gsap.set(rise, { opacity: 0, y: Y_DISTANCE, willChange: "transform, opacity" });
            tl.to(rise, { opacity: 1, y: 0 }, 0);
          }

          if (fade.length > 0) {
            gsap.set(fade, { opacity: 0, willChange: "opacity" });
            tl.to(fade, { opacity: 1 }, 0);
          }
        });
      });
    };

    /**
     * Fonts and next/image both change layout after first paint, which moves
     * every trigger position. Set up once fonts have settled, then refresh again
     * on window load for late images.
     */
    const boot = async () => {
      try {
        await document.fonts?.ready;
      } catch {
        /* fonts API unavailable — proceed */
      }
      setup();
      ScrollTrigger.refresh();
    };

    void boot();

    const onLoad = () => ScrollTrigger.refresh();
    if (document.readyState !== "complete") {
      window.addEventListener("load", onLoad, { once: true });
    }

    return () => {
      disposed = true;
      window.removeEventListener("load", onLoad);
      mm.revert();
    };
  }, []);

  return null;
}
