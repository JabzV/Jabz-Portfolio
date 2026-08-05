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
    /**
     * The entrance owns the wordmark layers' `x` until it finishes. Pointer
     * parallax writes the same property, so it must stay quiet until then or the
     * two fight and the layers jitter mid-entrance.
     */
    let entranceDone = false;

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
        // The headline's four lines animate individually rather than the <h1>
        // moving as one block — it is the largest type in the hero, and a cascade
        // reads as words arriving where a single slide reads as the panel moving.
        const lines = q("[data-hero-line]");

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
        // Slightly further and from the left, so the headline sweeps in along the
        // panel's reading direction rather than dropping.
        gsap.set(lines, { opacity: 0, x: -28, willChange: "transform, opacity" });

        const tl = gsap.timeline({
          defaults: { ease: "power2.out", clearProps: "opacity,transform,willChange" },
          onComplete: () => {
            entranceDone = true;
          },
        });

        tl.to(cover, { scale: 1, duration: 1.4 }, 0)
          .to(layers, { opacity: 1, x: 0, duration: 0.7, stagger: 0.08 }, 0.05)
          // The panel itself never animates — its `lg` children are absolutely
          // positioned, so a transform on it would drag them all. Only contents.
          .to(items, { opacity: 1, y: 0, duration: 0.55, stagger: 0.06 }, 0.15)
          // Line cascade, a touch slower and more spaced than the surrounding
          // items so the headline is the beat the eye lands on.
          .to(
            lines,
            { opacity: 1, x: 0, duration: 0.65, stagger: 0.09, ease: "power3.out" },
            0.22,
          )
          .to(floats, { opacity: 1, y: 0, duration: 0.5, stagger: 0.05 }, 0.4)
          // Lights last, alone, after the static has cleared. That is the payoff.
          .to(glows, { opacity: 1, duration: 1.1, ease: "power1.inOut" }, 0.55);

        /**
         * Hard safety net. The timeline hides content first and reveals it over
         * ~1.7s, so anything that stalls GSAP's ticker between those two moments
         * leaves the hero invisible. The ticker is rAF-driven, and rAF stops in a
         * backgrounded tab — so a reader who switches tabs during the boot reveal
         * and never returns to that tab would have left it mid-hide.
         *
         * `progress(1)` jumps to the end synchronously, WITHOUT rAF, and applies
         * the timeline's `clearProps` — so this both guarantees visibility and
         * leaves no inline styles behind. Generous margin: it only ever fires if
         * the animation genuinely did not play.
         */
        const failsafe = window.setTimeout(() => {
          // `progress()` suppresses callbacks, so onComplete will not fire —
          // release the parallax by hand or it would stay disabled forever.
          if (tl.progress() < 1) tl.progress(1);
          entranceDone = true;
        }, 4000);
        return () => window.clearTimeout(failsafe);
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
      // Reveal already happened before this leaf hydrated: no entrance runs, so
      // nothing owns the layers' x and parallax is free immediately.
      started = true;
      entranceDone = true;
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

        /**
         * Wordmark parallax. Each layer tracks at a different rate, so the stack's
         * 1.0 / 0.49 / 0.06 alpha relationship finally reads as DEPTH rather than
         * as three overlapping copies — the fainter layers travel further, which
         * is how parallax signals distance.
         */
        const wordmark = section.querySelector<HTMLElement>("[data-hero-wordmark]");
        const layers = gsap.utils.toArray<HTMLElement>(
          "[data-hero-wordmark-layer]",
          section,
        );
        const layerTo = layers.map((l, i) =>
          gsap.quickTo(l, "x", {
            // Deeper layers lag slightly more as well as travelling further.
            duration: 0.55 + i * 0.12,
            ease: "power3",
          }),
        );
        const LAYER_TRAVEL = [7, 15, 24];

        /**
         * Cover parallax. The photograph drifts a little against the pointer,
         * which is enough to make the hero feel like a scene being looked into
         * rather than a flat plate.
         *
         * The image carries `lg:scale-[1.04]` for exactly this: `object-cover`
         * fills the plane precisely, so without that overscan any translation
         * would drag an empty edge into view. 4% of a ~2545px plane is ~50px of
         * slack, comfortably more than twice the travel below.
         *
         * Slower than the wordmark (0.8s vs 0.55s) so the backdrop reads as the
         * furthest thing away — parallax depth is as much about lag as distance.
         */
        const cover = section.querySelector<HTMLElement>("[data-hero-cover]");
        const coverTo = cover
          ? {
              x: gsap.quickTo(cover, "x", { duration: 0.8, ease: "power3" }),
              y: gsap.quickTo(cover, "y", { duration: 0.8, ease: "power3" }),
            }
          : null;
        /** Small on purpose. Past ~15px the crop visibly shifts and the careful
            57%-helmet framing stops holding. */
        const COVER_X = 14;
        const COVER_Y = 8;

        /**
         * Red panel: a light that tracks the pointer across it, plus a slow drift
         * on the wireframe globe so the panel has a foreground and a background
         * rather than being one flat plane.
         *
         * The light is driven off the PANEL's own rect, not the plane's, so it
         * sits under the pointer rather than at a scaled-down proportion of it.
         */
        const panel = section.querySelector<HTMLElement>("[data-hero-panel]");
        const panelLight = panel?.querySelector<HTMLElement>("[data-hero-panel-light]");
        const globe = section.querySelector<HTMLElement>("[data-hero-globe]");

        const panelTo = panelLight
          ? {
              x: gsap.quickTo(panelLight, "x", { duration: 0.45, ease: "power3" }),
              y: gsap.quickTo(panelLight, "y", { duration: 0.45, ease: "power3" }),
            }
          : null;
        const globeTo = globe
          ? {
              x: gsap.quickTo(globe, "x", { duration: 0.9, ease: "power3" }),
              y: gsap.quickTo(globe, "y", { duration: 0.9, ease: "power3" }),
            }
          : null;
        const GLOBE_TRAVEL = 10;

        let panelRect = panel?.getBoundingClientRect() ?? null;
        let panelW = panel?.offsetWidth ?? 0;
        let panelH = panel?.offsetHeight ?? 0;

        // Cached OUTSIDE the pointer handler. Reading these per-move is textbook
        // layout thrash.
        let rect = plane.getBoundingClientRect();
        let planeW = plane.offsetWidth;
        let planeH = plane.offsetHeight;
        let wmCentre = 0;
        const measure = () => {
          rect = plane.getBoundingClientRect();
          planeW = plane.offsetWidth;
          planeH = plane.offsetHeight;
          const wr = wordmark?.getBoundingClientRect();
          // Centre of the wordmark itself, so the parallax responds to the
          // pointer's position relative to THAT TEXT rather than to the band.
          wmCentre = wr ? wr.left + wr.width / 2 : rect.left + rect.width / 2;
          if (panel) {
            panelRect = panel.getBoundingClientRect();
            panelW = panel.offsetWidth;
            panelH = panel.offsetHeight;
          }
        };
        measure();

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

          // Signed −1..1 offset from the wordmark's own centre. Uses the same
          // visual-px rect as above, so the `.app-scale` zoom cancels out here
          // too — this is a ratio, not a length.
          if (entranceDone && layerTo.length) {
            const wd = gsap.utils.clamp(
              -1,
              1,
              (e.clientX - wmCentre) / (rect.width / 2),
            );
            // Negative: the layers drift AWAY from the pointer, which reads as
            // the type sitting behind the glass rather than following the mouse.
            layerTo.forEach((set, i) => set(-wd * (LAYER_TRAVEL[i] ?? 7)));
          }

          // Counter-motion: the photograph moves opposite the pointer, the way a
          // distant background does when you shift your head. Moving WITH the
          // pointer would read as the image being dragged.
          // Also gated on the entrance, which owns this element's transform until
          // its `clearProps` runs.
          if (entranceDone && coverTo) {
            const cx = (fx - 0.5) * 2;
            const cy = (fy - 0.5) * 2;
            coverTo.x(-cx * COVER_X);
            coverTo.y(-cy * COVER_Y);
          }

          // Panel light + globe drift. Same ratio trick as everything else, so
          // the `.app-scale` zoom cancels out; and same `entranceDone` gate,
          // since the entrance owns the globe's transform via [data-hero-item].
          if (panelRect) {
            const px = (e.clientX - panelRect.left) / panelRect.width;
            const py = (e.clientY - panelRect.top) / panelRect.height;
            panelTo?.x(px * panelW);
            panelTo?.y(py * panelH);
            if (entranceDone && globeTo) {
              globeTo.x(-(px - 0.5) * 2 * GLOBE_TRAVEL);
              globeTo.y(-(py - 0.5) * 2 * GLOBE_TRAVEL);
            }
          }
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
        const hide = () => {
          gsap.to(scan, { opacity: 0, duration: 0.5 });
          // Settle back to rest rather than freezing wherever the pointer exited.
          if (layers.length) {
            gsap.to(layers, { x: 0, duration: 0.7, ease: "power3.out" });
          }
          if (cover) gsap.to(cover, { x: 0, y: 0, duration: 0.9, ease: "power3.out" });
          if (globe) gsap.to(globe, { x: 0, y: 0, duration: 0.9, ease: "power3.out" });
        };

        // The panel light gets its own enter/leave: the section covers the whole
        // band, and a highlight that stays lit while the pointer is off over the
        // photograph would read as a stuck artifact rather than a tracked light.
        const showPanel = () => {
          if (panelLight) gsap.to(panelLight, { opacity: 0.45, duration: 0.35 });
        };
        const hidePanel = () => {
          if (panelLight) gsap.to(panelLight, { opacity: 0, duration: 0.45 });
        };

        section.addEventListener("pointerenter", measure);
        section.addEventListener("pointerenter", show);
        section.addEventListener("pointerleave", hide);
        panel?.addEventListener("pointerenter", showPanel);
        panel?.addEventListener("pointerleave", hidePanel);
        section.addEventListener("pointermove", onMove, { passive: true });
        window.addEventListener("scroll", onScrollOrResize, { passive: true });
        window.addEventListener("resize", onScrollOrResize, { passive: true });

        return () => {
          if (raf) cancelAnimationFrame(raf);
          section.removeEventListener("pointerenter", measure);
          section.removeEventListener("pointerenter", show);
          section.removeEventListener("pointerleave", hide);
          panel?.removeEventListener("pointerenter", showPanel);
          panel?.removeEventListener("pointerleave", hidePanel);
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
