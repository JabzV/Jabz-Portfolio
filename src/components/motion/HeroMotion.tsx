"use client";

import { bootRevealed, onBootReveal } from "@/lib/boot-signal";

import { gsap, ScrollTrigger, useGSAP } from "./gsap";

/**
 * HeroMotion — behaviour-only client leaf mounted inside <Hero>. Renders nothing,
 * so the Hero and every other section stay Server Components.
 *
 * Owns three things:
 *  1. The entrance, timed against the boot reveal rather than against scroll. The
 *     hero is deliberately excluded from ScrollReveals (fading in first-paint
 *     content costs LCP), so this is the only motion it gets on arrival.
 *  2. The pointer-tracked scan light.
 *  3. An offscreen pause flag, so the ambient CSS glows are not burning battery
 *     while the reader is four sections down.
 *
 * Contract with the markup, all set in Hero.tsx / LayeredWordmark.tsx:
 *   [data-hero]                  the section (pause flag + pointer bounds)
 *   [data-hero-cover]            wrapper around the LCP image — TRANSFORM ONLY
 *   [data-hero-wordmark-layer]   the three alpha'd wordmark layers
 *   [data-hero-item]             the seven red-panel children
 *   [data-hero-float]            the six floating planes over the cover
 *   [data-hero-glow]             glow wrappers (GSAP owns their opacity; the
 *                                inner child owns the CSS breathe — see C4)
 *   [data-hero-scan]             the pointer light sprite
 */

/* Fires 300ms into the 1100ms boot reveal. At that point the static is ~0.7 and
   falling, so the first third of the entrance happens half-veiled by noise —
   a receiver locking onto a scene already in motion, rather than a page that
   starts moving once you can see it. */
const REVEAL_DELAY_MS = 300;

/** Runs the entrance even if the boot event never arrives. */
const WATCHDOG_MS = 2500;

/** Lag on the scan light. The lag is what reads as light rather than as cursor decoration. */
const SCAN_LAG = 0.5;

export function HeroMotion() {
  useGSAP(() => {
    const section = document.querySelector<HTMLElement>("[data-hero]");
    if (!section) return;

    const mm = gsap.matchMedia();
    let disposed = false;
    let started = false;

    /* ---------------------------------------------------------------- entrance */

    const buildEntrance = () => {
      if (disposed || started) return;
      started = true;

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const q = gsap.utils.selector(section);
        const cover = q("[data-hero-cover]");
        const layers = q("[data-hero-wordmark-layer]");
        const items = q("[data-hero-item]");
        const floats = q("[data-hero-float]");
        const glows = q("[data-hero-glow]");

        // Hidden state is applied HERE, from JS, never in the server-rendered
        // class list — so with JS off, GSAP missing, or reduced motion, the hero
        // renders in its final visible state.
        //
        // The cover gets scale only. Its opacity is never touched: it is the LCP
        // element, and scaling DOWN from larger means `overflow-hidden` never
        // reveals an edge.
        gsap.set(cover, { scale: 1.035, willChange: "transform" });
        // Deeper layers start further out, so they arrive last and the stack
        // reads as having depth.
        gsap.set(layers, {
          opacity: 0,
          x: (i: number) => -40 - i * 30,
          willChange: "transform, opacity",
        });
        gsap.set(items, { opacity: 0, y: 18, willChange: "transform, opacity" });
        gsap.set(floats, { opacity: 0, y: 14, willChange: "transform, opacity" });
        gsap.set(glows, { opacity: 0, willChange: "opacity" });

        const tl = gsap.timeline({
          defaults: { ease: "power2.out", clearProps: "opacity,transform,willChange" },
        });

        tl.to(cover, { scale: 1, duration: 1.4 }, 0)
          .to(layers, { opacity: 1, x: 0, duration: 0.7, stagger: 0.08 }, 0.05)
          // The panel itself never animates — its `lg` children are absolutely
          // positioned, so a transform on it would drag them all. Only contents.
          .to(items, { opacity: 1, y: 0, duration: 0.55, stagger: 0.06 }, 0.15)
          .to(floats, { opacity: 1, y: 0, duration: 0.5, stagger: 0.05 }, 0.4)
          // Lights last, alone, after the static has cleared. That is the payoff.
          .to(glows, { opacity: 1, duration: 1.1, ease: "power1.inOut" }, 0.55);
      });
    };

    /**
     * If the reveal already happened before this leaf hydrated (slow JS, cold
     * CPU), skip the entrance entirely rather than hiding content the reader can
     * already see and flashing it back — the same rule ScrollReveals applies with
     * its above-the-fold filter.
     */
    let disposeReveal = () => {};
    let watchdog = 0;

    if (bootRevealed()) {
      started = true;
    } else {
      disposeReveal = onBootReveal(() => {
        watchdog = window.setTimeout(buildEntrance, REVEAL_DELAY_MS);
      });
      // Failsafe: never leave the hero hidden because an event went missing.
      watchdog = window.setTimeout(buildEntrance, WATCHDOG_MS);
    }

    /* ------------------------------------------------------------ scan light */

    mm.add(
      "(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine) and (min-width: 64rem)",
      () => {
        const scan = section.querySelector<HTMLElement>("[data-hero-scan]");
        const plane = scan?.parentElement;
        if (!scan || !plane) return;

        const xTo = gsap.quickTo(scan, "x", { duration: SCAN_LAG, ease: "power3" });
        const yTo = gsap.quickTo(scan, "y", { duration: SCAN_LAG, ease: "power3" });

        // Cached OUTSIDE the pointer handler. Reading these per-move is textbook
        // layout thrash.
        let rect = plane.getBoundingClientRect();
        let planeW = plane.offsetWidth;
        let planeH = plane.offsetHeight;
        const measure = () => {
          rect = plane.getBoundingClientRect();
          planeW = plane.offsetWidth;
          planeH = plane.offsetHeight;
        };

        const onMove = (e: PointerEvent) => {
          if (e.pointerType === "touch") return;
          // THE ZOOM TRAP: above 1440px `.app-scale` carries `zoom`, so transform
          // units are unzoomed LAYOUT px while clientX/getBoundingClientRect are
          // visual px. Going through a 0..1 fraction cancels the factor out, and
          // deriving it from the element rather than reading `--app-scale` stays
          // correct in engines that ignore `zoom` (where the factor is just 1).
          const fx = (e.clientX - rect.left) / rect.width;
          const fy = (e.clientY - rect.top) / rect.height;
          xTo(fx * planeW);
          yTo(fy * planeH);
        };

        let raf = 0;
        const onScrollOrResize = () => {
          if (raf) return;
          raf = requestAnimationFrame(() => {
            raf = 0;
            measure();
          });
        };

        gsap.set(scan, { opacity: 0 });
        const show = () => gsap.to(scan, { opacity: 1, duration: 0.4 });
        const hide = () => gsap.to(scan, { opacity: 0, duration: 0.5 });

        section.addEventListener("pointerenter", measure);
        section.addEventListener("pointerenter", show);
        section.addEventListener("pointerleave", hide);
        section.addEventListener("pointermove", onMove, { passive: true });
        window.addEventListener("scroll", onScrollOrResize, { passive: true });
        window.addEventListener("resize", onScrollOrResize, { passive: true });

        return () => {
          if (raf) cancelAnimationFrame(raf);
          section.removeEventListener("pointerenter", measure);
          section.removeEventListener("pointerenter", show);
          section.removeEventListener("pointerleave", hide);
          section.removeEventListener("pointermove", onMove);
          window.removeEventListener("scroll", onScrollOrResize);
          window.removeEventListener("resize", onScrollOrResize);
        };
      },
    );

    /* -------------------------------------------------- offscreen pause flag */

    // CSS pauses the ambient glow keyframes when this attribute is absent, so
    // "always running" does not mean "always burning battery".
    section.dataset.heroVisible = "true";
    const visTrigger = ScrollTrigger.create({
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      onToggle: ({ isActive }) => {
        if (isActive) section.dataset.heroVisible = "true";
        else delete section.dataset.heroVisible;
      },
    });

    return () => {
      disposed = true;
      window.clearTimeout(watchdog);
      disposeReveal();
      visTrigger.kill();
      mm.revert();
    };
  }, []);

  return null;
}
