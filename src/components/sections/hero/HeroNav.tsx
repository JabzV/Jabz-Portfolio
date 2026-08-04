import Link from "next/link";

import { nav } from "@/data/site";

import { ThemeToggle } from "./ThemeToggle";

/**
 * Hero top bar (Figma nav `16:4299`, items at top 19–29, right aligned).
 *
 * Figma exported the items as `<li class="list-disc ms-[30px]">` and the
 * reference render therefore shows bullet discs. That is a Figma list artifact
 * (overview defect 11), not design intent, so the list is `list-none` here —
 * reported as a deliberate visual deviation.
 *
 * The design's item gaps are 132 / 116 / 159 px left-to-left (non-uniform, and
 * measured including the 30px bullet indent). Normalized to one gap token.
 */
export function HeroNav() {
  return (
    <header className="z-30 flex w-full flex-wrap items-center justify-end gap-x-6 gap-y-3 px-5 py-4 sm:px-8 lg:absolute lg:top-[19px] lg:right-[28px] lg:w-auto lg:px-0 lg:py-0">
      <nav aria-label="Primary">
        <ul className="flex list-none flex-wrap items-center gap-x-6 gap-y-2 sm:gap-x-8 lg:gap-x-10">
          {nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="font-accent text-nav text-fg inline-flex min-h-[44px] items-center transition-opacity hover:opacity-70 lg:min-h-0"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <ThemeToggle />
    </header>
  );
}
