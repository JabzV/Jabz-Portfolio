import Image from "next/image";

/**
 * The sun toggle in the hero nav (Figma `16:3327`, 45×45 group).
 *
 * The Figma "Light Mode" frame is a different design system that does not exist
 * yet, so this is a REAL button (focusable, labelled) but deliberately
 * non-functional: no state, no handler, therefore no `"use client"`.
 *
 * The 41px white circle shipped from Figma as `nav-toggle-ellipse.svg`; it was a
 * single `<circle fill=white>` and is CSS here.
 */
export function ThemeToggle() {
  return (
    <button
      type="button"
      aria-label="Switch to light mode"
      className="grid size-[45px] shrink-0 place-items-center"
    >
      <span className="grid size-[41px] place-items-center rounded-full bg-fg">
        <Image
          src="/assets/hero/icon-sun.png"
          alt=""
          width={24}
          height={24}
          className="size-6 object-contain"
        />
      </span>
    </button>
  );
}
