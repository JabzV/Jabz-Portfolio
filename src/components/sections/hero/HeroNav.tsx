import Link from "next/link";

import { nav } from "@/data/site";

import { ThemeToggle } from "./ThemeToggle";

/**
 * Primary navigation (Figma nav `16:4299`, items at top 19–29, right aligned).
 *
 * Deliberately NOT wrapped in `<header>` here. `<header>` only maps to the
 * `banner` landmark when it is not a descendant of `section`/`article`/`main`,
 * and this previously rendered as `main > section > header`, which exposed no
 * role and left the nav trapped inside the main content region. `page.tsx` owns
 * the `<header>` wrapper and mounts this as a sibling of `<main>`.
 *
 * Consequently this component is SELF-POSITIONING: `absolute inset-x-0 top-0`
 * against whichever `relative` wrapper mounts it, so it overlays the hero
 * without relying on the hero's stacking context. It reserves no vertical space
 * at any width.
 *
 * Figma exported the items as `<li class="list-disc ms-[30px]">` and the
 * reference render therefore shows bullet discs. That is a Figma list artifact
 * (overview defect 11), not design intent, so the list is `list-none` — with an
 * explicit `role="list"`, because `list-style: none` makes WebKit drop the
 * implicit list role (WCAG 1.3.1).
 *
 * The design's item gaps are 132 / 116 / 159 px left-to-left (non-uniform, and
 * measured including the 30px bullet indent). Normalized to one gap token.
 */
export function HeroNav() {
  return (
    <nav
      aria-label="Primary"
      className="absolute inset-x-0 top-0 z-30 flex flex-wrap items-center justify-end gap-x-6 gap-y-3 px-5 py-4 sm:px-8 lg:px-0 lg:pt-[19px] lg:pr-[28px] lg:pb-0"
    >
      <ul
        role="list"
        className="flex list-none flex-wrap items-center gap-x-6 gap-y-2 sm:gap-x-8 lg:gap-x-10"
      >
        {nav.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              // The glow is additive to the existing opacity fade, not a
              // replacement: opacity remains the accessible signal, and the glow
              // is what makes the TOTAL absence of any response on the two
              // aria-disabled CTAs unmistakable rather than merely subtle.
              className="font-accent text-nav text-fg duration-(--duration-hover) hover:text-shadow-glow-link inline-flex min-h-[44px] items-center transition-[opacity,text-shadow] hover:opacity-70 lg:min-h-0"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
      <ThemeToggle />
    </nav>
  );
}
