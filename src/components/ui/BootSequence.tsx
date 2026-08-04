"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Cyberpunk boot overlay for the dark design. Shown on every load/reload.
 *
 * Three phases: `loading` → `complete` → unmounted.
 *
 * The `loading` phase ends as soon as the page is actually ready, with only a
 * short floor to avoid a single-frame flicker on a warm cache. The payoff is the
 * `complete` phase — a flash, the status line snapping to LOAD COMPLETE, then
 * the panel collapsing to a horizontal line like a CRT powering down. Earlier
 * this component idled for ~1s after readiness, which read as an artificial wait.
 *
 * Structure note: `boot-dismiss` lives on the OUTER element and the visuals on an
 * inner `.boot-panel`, so the no-JS fallback and the collapse animation never
 * compete for the same `animation` property.
 *
 * Other deliberate details:
 *
 * - Server-rendered visible, so there is no frame of page before the loader.
 *   That makes the CSS-only `boot-dismiss` fallback mandatory: without it a JS
 *   error would leave the site permanently behind a loading screen.
 * - Readiness waits on `document.fonts.ready` because the display face IS the
 *   visual identity — reveal earlier and the page shows in fallback Impact and
 *   then reflows. A guard timer caps that wait so a stalled font cannot hold the
 *   page hostage.
 * - `aria-hidden`: the real page is fully server-rendered underneath, so a screen
 *   reader should read that rather than announce a decorative overlay.
 * - Scroll is released when the reveal starts, not at unmount — returning null
 *   does not unmount a component, so cleanup alone would never run.
 * - Reduced motion is handled in CSS: no flash, no collapse, just a short fade.
 */

/** Floor on the loading phase — only long enough to avoid a 1-frame flicker. */
const MIN_LOADING_MS = 260;
/** Must cover the flash + collapse keyframes below. */
const COMPLETE_MS = 760;
/** Cap on waiting for fonts. */
const FONT_GUARD_MS = 2600;

const STATUS_LINES = [
  "// ESTABLISHING UPLINK",
  "// DECRYPTING ASSETS",
  "// RENDERING INTERFACE",
];

type Phase = "loading" | "complete";

export function BootSequence() {
  const [phase, setPhase] = useState<Phase>("loading");
  const [done, setDone] = useState(false);
  const [step, setStep] = useState(0);
  const mountedAt = useRef(0);

  useEffect(() => {
    mountedAt.current = performance.now();

    const body = document.body;
    const prevOverflow = body.style.overflow;
    body.style.overflow = "hidden";
    const release = () => {
      body.style.overflow = prevOverflow;
    };

    const cycle = window.setInterval(
      () => setStep((s) => (s + 1) % STATUS_LINES.length),
      300,
    );

    const timers: number[] = [];

    const reveal = () => {
      const elapsed = performance.now() - mountedAt.current;
      timers.push(
        window.setTimeout(() => {
          window.clearInterval(cycle);
          // Released here so the page is interactive during the reveal.
          release();
          setPhase("complete");
          timers.push(window.setTimeout(() => setDone(true), COMPLETE_MS));
        }, Math.max(0, MIN_LOADING_MS - elapsed)),
      );
    };

    const fonts = document.fonts?.ready ?? Promise.resolve();
    const guard = new Promise<void>((r) => {
      timers.push(window.setTimeout(r, FONT_GUARD_MS));
    });
    Promise.race([fonts, guard]).then(reveal);

    return () => {
      release();
      window.clearInterval(cycle);
      timers.forEach(window.clearTimeout);
    };
  }, []);

  if (done) return null;

  const complete = phase === "complete";

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[100] overflow-hidden"
      style={{ animation: "boot-dismiss 3.4s ease-in forwards" }}
    >
      <div
        data-phase={phase}
        className="boot-panel bg-bg absolute inset-0 grid place-items-center"
        style={
          complete
            ? { animation: `boot-collapse ${COMPLETE_MS}ms cubic-bezier(.7,0,.3,1) forwards` }
            : undefined
        }
      >
        {/* Scanlines. A 3px repeat reads as a CRT and survives page zoom. */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, rgb(255 255 255 / 0.5) 0px, rgb(255 255 255 / 0.5) 1px, transparent 1px, transparent 3px)",
          }}
        />

        {/* Travelling accent band. `w-full` and an explicit `top` are
            load-bearing: for an absolutely positioned child of a grid with
            `place-items-center`, those alignment properties collapse `inset-x-0`
            to fit-content and centre it. Stops once loading ends. */}
        {!complete && (
          <div
            className="from-accent/0 via-accent/25 to-accent/0 pointer-events-none absolute top-0 left-0 h-1/3 w-full bg-gradient-to-b"
            style={{ animation: "boot-sweep 2.2s ease-in-out infinite" }}
          />
        )}

        {/* Completion flash. */}
        {complete && (
          <div
            className="boot-flash bg-display pointer-events-none absolute inset-0"
            style={{ animation: "boot-flash 420ms ease-out forwards" }}
          />
        )}

        {/* Width is inline rather than `w-full max-w-[560px]`: that utility pair
            resolved to `max-width: none` here (the class was emitted into the
            markup but no rule generated for it), which stretched the column to
            the full viewport and left-aligned the text. An explicit width is
            deterministic, and the parent's `place-items-center` centres it. */}
        <div className="relative px-6" style={{ width: "min(560px, 100%)" }}>
          {/* Uppercased in CSS: the display face is caps-only, so lowercase
              input would fall back per-glyph to a different family. */}
          <div className="relative">
            <span
              aria-hidden="true"
              className="text-accent font-display text-section-title-sm absolute inset-0 select-none uppercase"
              style={
                complete ? undefined : { animation: "boot-glitch 1.6s steps(2, end) infinite" }
              }
            >
              {complete ? "Complete" : "Loading..."}
            </span>
            <span
              className="text-display font-display text-section-title-sm text-shadow-display relative block uppercase"
              style={
                complete ? undefined : { animation: "boot-flicker 2.6s ease-in-out infinite" }
              }
            >
              {complete ? "Complete" : "Loading..."}
            </span>
          </div>

          {/* Progress rail. Snaps to full on completion. */}
          <div className="border-rule mt-6 h-[3px] w-full border-t">
            <div
              className="bg-accent-soft h-[3px] origin-left"
              style={
                complete
                  ? { transform: "scaleX(1)" }
                  : { animation: "boot-progress 3.1s ease-out forwards" }
              }
            />
          </div>

          <div className="mt-4 flex items-center justify-between gap-4">
            {complete ? (
              <p
                className="boot-complete-text text-accent-soft font-accent text-body uppercase"
                style={{ animation: "boot-complete-text 220ms ease-out forwards" }}
              >
                {"// LOAD COMPLETE"}
              </p>
            ) : (
              <p className="text-fg-muted font-accent text-body uppercase">{STATUS_LINES[step]}</p>
            )}
            <span
              className="bg-accent-soft inline-block h-[14px] w-[9px]"
              style={
                complete ? { opacity: 1 } : { animation: "boot-flicker 0.9s steps(1, end) infinite" }
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
