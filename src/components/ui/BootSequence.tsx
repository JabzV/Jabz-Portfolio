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
/** Length of the signal-lock reveal. Must cover boot-signal-lock. */
const COMPLETE_MS = 1100;
/** Cap on waiting for fonts. */
const FONT_GUARD_MS = 2600;

const STATIC_TILE = "/assets/tv-static.png";

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
        // Opaque while loading; transparent during the reveal so the page shows
        // through as the static thins out. Keeping bg-bg here would mean fading
        // noise against a solid panel and then cutting to the site.
        className={`boot-panel absolute inset-0 grid place-items-center ${complete ? "" : "bg-bg"}`}
      >
        {/* Scanlines. A 3px repeat reads as a CRT and survives page zoom. */}
        {!complete && (
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.14]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(to bottom, rgb(255 255 255 / 0.5) 0px, rgb(255 255 255 / 0.5) 1px, transparent 1px, transparent 3px)",
            }}
          />
        )}

        {/* Warms the noise tile into cache during loading, so the reveal never
            waits on a network request at the moment it needs it. A preload link
            rather than a hidden <img>: React 19 hoists it to <head>, and it
            keeps the exact URL the CSS `url()` references — next/image would
            rewrite it to an optimizer URL that would not match, so the fetch
            would be wasted and the tile requested again at reveal time. */}
        {!complete && <link rel="preload" as="image" href={STATIC_TILE} />}

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

        {/* --- Signal lock: broadcast static thinning out to reveal the page --- */}
        {complete && (
          <div
            className="boot-static pointer-events-none absolute inset-0 overflow-hidden"
            style={{
              animation: [
                `boot-signal-lock ${COMPLETE_MS}ms ease-in forwards`,
                `boot-vsync ${COMPLETE_MS}ms ease-out forwards`,
              ].join(", "),
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${STATIC_TILE})`,
                backgroundRepeat: "repeat",
                animation: "boot-static-jitter 700ms steps(1, end) infinite",
              }}
            />
            {/* Rolling sync band. */}
            <div
              className="boot-roll from-display/0 via-display/25 to-display/0 absolute top-0 left-0 h-[14%] w-full bg-gradient-to-b"
              style={{ animation: `boot-roll ${COMPLETE_MS}ms linear forwards` }}
            />
          </div>
        )}

        {/* Loading UI. Removed the moment the reveal starts: the signal drops to
            static, so leaving text underneath the noise would read as a caption
            on top of the effect rather than a receiver losing and regaining
            picture.

            Width is inline rather than `w-full max-w-[560px]`: that utility pair
            resolved to `max-width: none` here (the class was emitted into the
            markup but no rule generated for it), which stretched the column to
            the full viewport and left-aligned the text. An explicit width is
            deterministic, and the parent's `place-items-center` centres it. */}
        {!complete && (
          <div className="relative px-6" style={{ width: "min(560px, 100%)" }}>
            {/* Uppercased in CSS: the display face is caps-only, so lowercase
                input would fall back per-glyph to a different family. */}
            <div className="relative">
              <span
                aria-hidden="true"
                className="text-accent font-display text-section-title-sm absolute inset-0 select-none uppercase"
                style={{ animation: "boot-glitch 1.6s steps(2, end) infinite" }}
              >
                Loading...
              </span>
              <span
                className="text-display font-display text-section-title-sm text-shadow-display relative block uppercase"
                style={{ animation: "boot-flicker 2.6s ease-in-out infinite" }}
              >
                Loading...
              </span>
            </div>

            <div className="border-rule mt-6 h-[3px] w-full border-t">
              <div
                className="bg-accent-soft h-[3px] origin-left"
                style={{ animation: "boot-progress 3.1s ease-out forwards" }}
              />
            </div>

            <div className="mt-4 flex items-center justify-between gap-4">
              <p className="text-fg-muted font-accent text-body uppercase">{STATUS_LINES[step]}</p>
              <span
                className="bg-accent-soft inline-block h-[14px] w-[9px]"
                style={{ animation: "boot-flicker 0.9s steps(1, end) infinite" }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
