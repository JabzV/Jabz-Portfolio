"use client";

import { useRef } from "react";

import { gsap, useGSAP } from "@/components/motion/gsap";

/**
 * A rounded-square reticle with a filled square inside it, drawn as the NEGATIVE
 * of whatever it sits over, expanding into a HUD lock over interactive targets.
 *
 * ── Why it mounts outside `.app-scale` ───────────────────────────────────────
 * `.app-scale` carries `zoom` above 1440px. `zoom` scales a `position: fixed`
 * descendant AND its coordinate space, while `clientX/clientY` are reported in
 * unzoomed client coordinates — so a cursor inside that subtree would sit at
 * `clientX * scale`, i.e. ~60% too far right at 2560px, with the error growing
 * with distance from the origin. As a sibling of `.app-scale` (the pattern
 * BootSequence already established) client coordinates map 1:1 and the cursor
 * renders at true size regardless of the canvas scale. It deliberately does NOT
 * scale with the page: it is UI chrome, and native cursors don't either.
 *
 * ── Why `isolation: isolate` sits on the blended element ─────────────────────
 * `mix-blend-mode: difference` with white gives an exact negative. The isolation
 * on the SAME element is required, and is not the hazard noted in globals.css:
 * it stops the ring stroke and the inner square double-differencing where they
 * overlap (each white pixel differenced twice returns the ORIGINAL backdrop — a
 * visible hole), while the root's flattened result still blends against the page.
 * The fatal case is `isolation`/`opacity<1`/`filter`/`transform`/`backdrop-filter`
 * on an ANCESTOR — `<html>`, `<body>`, or any new wrapper around `.app-scale`.
 *
 * ── Why children are centred with negative margins ───────────────────────────
 * GSAP owns the entire `transform` channel of every element here (root x/y,
 * children scale). A Tailwind `-translate-x-1/2` would be silently clobbered the
 * first time GSAP writes a transform. Negative margins are a layout-time offset,
 * so `transform` stays free.
 *
 * ── Safety, which matters more than the visuals ──────────────────────────────
 * `cursor: none` is applied ONLY by JS, and only after: mounted, a fine hovering
 * pointer exists, forced-colors is off, and a real non-touch pointer position has
 * arrived. A JS failure, a touch device, or Windows high contrast therefore always
 * leaves the native cursor intact. The `cursor: none` rule itself is gated on
 * `html[data-custom-cursor]` in globals.css and is never unconditional.
 */

const RING = 52;
const BRACKETS = 76;
const MARK = 10;

/** Interactive by semantics. `[data-cursor]` is an explicit override, checked first. */
const INTERACTIVE = [
  "[data-cursor]",
  "a[href]",
  "button",
  '[role="button"]',
  '[role="link"]',
  "summary",
  "label[for]",
  'input:not([type="hidden"])',
  "select",
  "textarea",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

/**
 * Inert. Every no-destination CTA on this site already carries `aria-disabled`
 * for accessibility reasons, so the visual affordance is derived from the same
 * attribute that drives the accessible one and the two can never disagree — which
 * is exactly the failure mode a hand-applied `data-cursor="clickable"` would have.
 */
const DEAD = ':is([aria-disabled="true"],[disabled],[data-cursor="locked"])';

type State = "default" | "hover" | "locked" | "scan";

export function CustomCursor() {
  const root = useRef<HTMLDivElement>(null);
  const ring = useRef<SVGSVGElement>(null);
  const mark = useRef<HTMLSpanElement>(null);
  const brackets = useRef<SVGSVGElement>(null);

  useGSAP(() => {
    const el = root.current;
    const ringEl = ring.current;
    const markEl = mark.current;
    const bracketsEl = brackets.current;
    if (!el || !ringEl || !markEl || !bracketsEl) return;

    const html = document.documentElement;
    const mm = gsap.matchMedia();

    /** Built twice — once animated, once instant for reduced motion. */
    const build = (animated: boolean) => {
      let active = false;
      let state: State = "default";
      let lastX = -1;
      let lastY = -1;

      const setX = animated
        ? gsap.quickTo(el, "x", { duration: 0.16, ease: "power3", force3D: true })
        : gsap.quickSetter(el, "x", "px");
      const setY = animated
        ? gsap.quickTo(el, "y", { duration: 0.16, ease: "power3", force3D: true })
        : gsap.quickSetter(el, "y", "px");

      const bracketPaths = gsap.utils.toArray<SVGPathElement>("path", bracketsEl);

      /**
       * Geometry lives on the two <svg> wrappers, never on the individual
       * <path>s: SVG children default to `transform-box: view-box` with
       * `transform-origin: 0 0`, so scaling a path slides it toward the corner
       * instead of growing in place. The stagger is carried by opacity alone,
       * which is origin-independent.
       */
      const to = (target: gsap.TweenTarget, vars: gsap.TweenVars, dur: number) => {
        if (animated) gsap.to(target, { ...vars, duration: dur, overwrite: "auto" });
        else gsap.set(target, vars);
      };

      const showBrackets = (visible: boolean) => {
        if (animated) {
          gsap.to(bracketPaths, {
            opacity: visible ? 1 : 0,
            duration: visible ? 0.22 : 0.15,
            // Staggered so the reticle reads as ACQUIRING a lock, not fading in.
            stagger: visible ? 0.03 : 0,
            ease: "power3.out",
            overwrite: "auto",
          });
        } else {
          gsap.set(bracketPaths, { opacity: visible ? 1 : 0 });
        }
      };

      const apply = (next: State) => {
        if (next === state) return;
        state = next;
        el.dataset.state = next;

        if (next === "hover") {
          to(ringEl, { scale: 1, ease: "back.out(1.7)" }, 0.28);
          to(markEl, { scaleX: 1, scaleY: 1 }, 0.2);
          to(bracketsEl, { scale: 1 }, 0.24);
          showBrackets(true);
        } else if (next === "scan") {
          to(ringEl, { scale: 1.9 }, 0.3);
          to(markEl, { scaleX: 0, scaleY: 0 }, 0.2);
          to(bracketsEl, { scale: 1.9 }, 0.3);
          showBrackets(true);
        } else if (next === "locked") {
          // Emphatically NOT expanded — no size change at all, so "inert" reads
          // as a different category from "clickable". The mark becomes a minus bar.
          to(ringEl, { scale: 0.42 }, 0.18);
          to(markEl, { scaleX: 1.4, scaleY: 0.2 }, 0.18);
          showBrackets(false);
        } else {
          to(ringEl, { scale: 0.42 }, 0.22);
          to(markEl, { scaleX: 0.6, scaleY: 0.6 }, 0.2);
          to(bracketsEl, { scale: 0.6 }, 0.18);
          showBrackets(false);
        }
      };

      const activate = () => {
        if (active) return;
        active = true;
        // Snap to position first, so the cursor never flies in from 0,0.
        gsap.set(el, { x: lastX, y: lastY });
        gsap.to(el, { autoAlpha: 1, duration: animated ? 0.15 : 0 });
        html.dataset.customCursor = "true";
      };

      const deactivate = () => {
        if (!active) return;
        active = false;
        gsap.to(el, { autoAlpha: 0, duration: animated ? 0.15 : 0 });
        // Native cursor back the instant ours is not on screen.
        delete html.dataset.customCursor;
      };

      const onMove = (e: PointerEvent) => {
        if (e.pointerType === "touch") {
          deactivate();
          return;
        }
        lastX = e.clientX;
        lastY = e.clientY;
        if (!active) activate();
        setX(lastX);
        setY(lastY);
      };

      const resolve = (target: Element | null): State => {
        const hit = target?.closest<HTMLElement>(INTERACTIVE);
        if (!hit) return "default";
        if (hit.matches(DEAD) || hit.closest(DEAD)) return "locked";
        if (hit.dataset.cursor === "scan") return "scan";
        return "hover";
      };

      // Delegated, not a per-move elementFromPoint: that is a forced hit-test and
      // would flush layout on every pointer event.
      const onOver = (e: Event) => apply(resolve(e.target as Element));

      // Scrolling under a stationary pointer changes what is beneath it, and
      // synthesised boundary events are inconsistent across engines. One
      // hit-test per scroll settle is fine; one per move would not be.
      let raf = 0;
      const onScroll = () => {
        if (raf || lastX < 0) return;
        raf = requestAnimationFrame(() => {
          raf = 0;
          apply(resolve(document.elementFromPoint(lastX, lastY)));
        });
      };

      const onDown = () => gsap.to(el, { scale: 0.88, duration: animated ? 0.09 : 0 });
      const onUp = () => gsap.to(el, { scale: 1, duration: animated ? 0.12 : 0 });

      window.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerover", onOver, { passive: true });
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("pointerdown", onDown, { passive: true });
      window.addEventListener("pointerup", onUp, { passive: true });
      window.addEventListener("pointercancel", onUp, { passive: true });
      document.addEventListener("pointerleave", deactivate);
      window.addEventListener("blur", deactivate);
      document.addEventListener("visibilitychange", deactivate);

      return () => {
        if (raf) cancelAnimationFrame(raf);
        window.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerover", onOver);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("pointerdown", onDown);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointercancel", onUp);
        document.removeEventListener("pointerleave", deactivate);
        window.removeEventListener("blur", deactivate);
        document.removeEventListener("visibilitychange", deactivate);
        // Never leave the native cursor hidden with nothing replacing it.
        delete html.dataset.customCursor;
      };
    };

    // Only ever active for a fine hovering pointer. forced-colors is excluded:
    // it overrides author colours, which makes a difference blend meaningless,
    // and those users have configured the cursor they want.
    const FINE = "(hover: hover) and (pointer: fine) and (not (forced-colors: active))";
    mm.add(`${FINE} and (prefers-reduced-motion: no-preference)`, () => build(true));
    mm.add(`${FINE} and (prefers-reduced-motion: reduce)`, () => build(false));

    return () => {
      mm.revert();
      delete html.dataset.customCursor;
    };
  }, []);

  return (
    <div
      ref={root}
      aria-hidden="true"
      data-state="default"
      className="pointer-events-none invisible fixed top-0 left-0 z-[110] text-fg opacity-0 [isolation:isolate] [mix-blend-mode:difference]"
    >
      {/* Ring. Drawn once at full size and only ever SCALED —
          `vector-effect="non-scaling-stroke"` keeps the stroke exactly 1.5px at
          every state. A scaled bordered div would give a 0.63px stroke that
          shimmers; tweening width/borderRadius would repaint every frame. */}
      <svg
        ref={ring}
        width={RING}
        height={RING}
        viewBox={`0 0 ${RING} ${RING}`}
        className="absolute -m-[26px] overflow-visible"
        style={{ transform: "scale(0.42)" }}
      >
        <rect
          x={1}
          y={1}
          width={RING - 2}
          height={RING - 2}
          rx={10}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* The filled square. Sharp square inside a soft-cornered ring is the glyph. */}
      <span
        ref={mark}
        className="absolute -m-[5px] block bg-current"
        style={{ width: MARK, height: MARK, transform: "scale(0.6)" }}
      />

      {/* Corner ticks — the HUD lock, hidden until a real target. */}
      <svg
        ref={brackets}
        width={BRACKETS}
        height={BRACKETS}
        viewBox={`0 0 ${BRACKETS} ${BRACKETS}`}
        className="absolute -m-[38px] overflow-visible"
        style={{ transform: "scale(0.6)" }}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        vectorEffect="non-scaling-stroke"
      >
        {["M1,11 V1 H11", "M65,1 H75 V11", "M75,65 V75 H65", "M11,75 H1 V65"].map((d) => (
          <path key={d} d={d} opacity={0} />
        ))}
      </svg>
    </div>
  );
}
