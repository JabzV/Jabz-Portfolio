import Image from "next/image";
import Link from "next/link";

/**
 * The sun toggle in the hero nav (Figma `16:3327`, 45×45 group).
 *
 * Now a real link to `/light` rather than the inert button it was. Light mode is
 * a separate design, not a recolour, so it is a route — which means this needs no
 * client state and stays a Server Component. `/light` currently holds a
 * work-in-progress placeholder.
 *
 * Still `aria-disabled`-free on purpose: it genuinely navigates now, so
 * announcing it as unavailable would be wrong.
 *
 * The 41px white circle shipped from Figma as `nav-toggle-ellipse.svg`; it was a
 * single `<circle fill=white>` and is CSS here.
 */
export function ThemeToggle() {
  return (
    <Link
      href="/light"
      aria-label="Switch to light mode (work in progress)"
      className="grid size-[45px] shrink-0 place-items-center transition-opacity hover:opacity-80"
    >
      <span className="bg-fg grid size-[41px] place-items-center rounded-full">
        <Image
          src="/assets/hero/icon-sun.png"
          alt=""
          width={24}
          height={24}
          className="size-6 object-contain"
        />
      </span>
    </Link>
  );
}
