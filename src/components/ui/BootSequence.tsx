"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Cyberpunk boot overlay for the dark design. Shown on every load/reload.
 *
 * Deliberate details:
 *
 * - It is server-rendered **visible**, so there is no frame of the page before
 *   the loader appears. That means it must be able to dismiss itself without
 *   JS — hence `animation: boot-dismiss` in globals.css, which hides it around
 *   3.4s regardless. Without that fallback a JS error would leave the site
 *   permanently behind a loading screen.
 * - JS dismisses it sooner: once `document.fonts.ready` resolves, plus a floor
 *   so it does not flash out instantly on a warm cache. The display face is the
 *   whole visual identity here, so waiting on fonts is the honest signal —
 *   without it the page appears in fallback Impact and reflows.
 * - `aria-hidden`: the real page is fully server-rendered underneath, so a
 *   screen reader should read that rather than announce a decorative overlay.
 * - Scroll is locked while visible and always released on unmount, so a stuck
 *   lock is not possible.
 * - Reduced motion is handled in CSS: the flicker and glitch stop, the progress
 *   bar renders filled instead of at scaleX(0), and the dismissal shortens.
 */

const MIN_VISIBLE_MS = 950;

const STATUS_LINES = [
  "// ESTABLISHING UPLINK",
  "// DECRYPTING ASSETS",
  "// RENDERING INTERFACE",
];

export function BootSequence() {
  const [done, setDone] = useState(false);
  const [step, setStep] = useState(0);
  const mountedAt = useRef(0);

  useEffect(() => {
    mountedAt.current = performance.now();

    const body = document.body;
    const prevOverflow = body.style.overflow;
    body.style.overflow = "hidden";

    // Releasing the lock must NOT live only in the effect cleanup. Returning
    // null from a component does not unmount it, so cleanup never runs on
    // dismissal — that left the page permanently unscrollable.
    const release = () => {
      body.style.overflow = prevOverflow;
    };

    const cycle = window.setInterval(
      () => setStep((s) => (s + 1) % STATUS_LINES.length),
      320,
    );

    let timer = 0;
    const finish = () => {
      const elapsed = performance.now() - mountedAt.current;
      timer = window.setTimeout(
        () => {
          release();
          window.clearInterval(cycle);
          setDone(true);
        },
        Math.max(0, MIN_VISIBLE_MS - elapsed),
      );
    };

    // If font loading stalls, do not hold the page hostage.
    const fonts = document.fonts?.ready ?? Promise.resolve();
    const guard = new Promise<void>((r) => window.setTimeout(r, 2600));
    Promise.race([fonts, guard]).then(finish);

    return () => {
      release();
      window.clearInterval(cycle);
      window.clearTimeout(timer);
    };
  }, []);

  if (done) return null;

  return (
    <div
      aria-hidden="true"
      className="boot-overlay bg-bg fixed inset-0 z-[100] grid place-items-center overflow-hidden"
      style={{ animation: "boot-dismiss 3.4s ease-in forwards" }}
    >
      {/* Scanlines. A 3px repeat is fine enough to read as a CRT and coarse
          enough to survive being scaled by the page zoom. */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, rgb(255 255 255 / 0.5) 0px, rgb(255 255 255 / 0.5) 1px, transparent 1px, transparent 3px)",
        }}
      />

      {/* Sweep — a band of accent light travelling down the screen.
          `w-full` and an explicit `top` are load-bearing: this overlay is a grid
          with `place-items-center`, and for an absolutely positioned grid child
          those alignment properties collapse `inset-x-0` to fit-content and
          centre it, which rendered the sweep as a small box mid-screen. */}
      <div
        className="from-accent/0 via-accent/25 to-accent/0 pointer-events-none absolute top-0 left-0 h-1/3 w-full bg-gradient-to-b"
        style={{ animation: "boot-sweep 2.2s ease-in-out infinite" }}
      />

      <div className="relative w-full max-w-[520px] px-6">
        {/* Wordmark with a chromatic split behind it. */}
        <div className="relative">
          <span
            aria-hidden="true"
            className="boot-glitch text-accent font-display text-section-title-sm absolute inset-0 select-none"
            style={{ animation: "boot-glitch 1.6s steps(2, end) infinite" }}
          >
            JABZ
          </span>
          <span className="boot-flicker text-display font-display text-section-title-sm text-shadow-display relative block">
            JABZ
          </span>
        </div>

        {/* Progress rail */}
        <div className="border-rule mt-6 h-[3px] w-full border-t">
          <div
            className="boot-progress bg-accent-soft h-[3px] origin-left"
            style={{ animation: "boot-progress 3.1s ease-out forwards" }}
          />
        </div>

        {/* Status line + blinking caret */}
        <div className="mt-4 flex items-center justify-between gap-4">
          <p className="text-fg-muted font-accent text-body uppercase">
            {STATUS_LINES[step]}
          </p>
          <span
            className="bg-accent-soft inline-block h-[14px] w-[9px]"
            style={{ animation: "boot-flicker 0.9s steps(1, end) infinite" }}
          />
        </div>
      </div>
    </div>
  );
}
