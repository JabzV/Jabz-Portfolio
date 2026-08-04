import type { Metadata } from "next";
import Link from "next/link";

import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Light Mode — Coming Soon | Jabez Vestidas",
  description: "The professional light-mode design is in progress.",
};

/**
 * Light mode placeholder.
 *
 * Light mode is a genuinely different design — corporate, not cyberpunk — so it
 * is a separate route rather than a theme toggle on the dark page. That keeps
 * the whole dark site as Server Components with no theme state to thread, and
 * means the two designs can diverge freely instead of fighting over one token set.
 *
 * Styled from the existing palette rather than new tokens: `bg-fg` is the
 * design's white and `text-fg-inverse` its black, so this page needs no light
 * theme layer to exist yet.
 *
 * No boot sequence here — that belongs to the dark design.
 */
export default function LightModePage() {
  return (
    <main className="bg-fg text-fg-inverse flex min-h-screen flex-col items-center justify-center gap-8 px-6 text-center">
      {/* Decorative. Hazard-stripe chevrons, echoing the dark design's motif. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 64 64"
        className="text-accent h-16 w-16"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="square"
      >
        <path d="M8 44 L24 20 L32 32 L40 20 L56 44" />
        <path d="M8 54 h48" strokeDasharray="6 6" />
      </svg>

      <div className="flex flex-col gap-3">
        <h1 className="font-display text-section-title-sm uppercase">Work in Progress</h1>
        <p className="font-accent text-lead text-accent uppercase">
          {"// Professional mode is being built"}
        </p>
      </div>

      <p className="font-body text-body max-w-[42ch] opacity-70">
        Light mode is a separate design, not a recolour of the dark one. It is not
        ready yet — the cyberpunk build is complete and live.
      </p>

      <Link
        href="/"
        className="font-accent text-lead border-fg-inverse hover:bg-fg-inverse hover:text-fg mt-2 inline-flex min-h-[44px] items-center border px-8 py-3 uppercase transition-colors"
      >
        Back to dark mode
      </Link>

      <p className="font-body text-caption absolute bottom-8 opacity-50">{site.copyright}</p>
    </main>
  );
}
