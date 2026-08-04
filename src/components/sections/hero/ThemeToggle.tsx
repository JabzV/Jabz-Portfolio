import Image from "next/image";

/**
 * The sun toggle in the hero nav (Figma `16:3327`, 45×45 group).
 *
 * The Figma "Light Mode" frame is an entirely different design that has not been
 * made, so this cannot work for the foreseeable future. It stays rendered because
 * it is a visible design element, but it is announced as unavailable:
 * `aria-disabled` (not `disabled`, which would drop it from the tab order) and no
 * hover affordance. No state, no handler, therefore no `"use client"`.
 *
 * The 41px white circle shipped from Figma as `nav-toggle-ellipse.svg`; it was a
 * single `<circle fill=white>` and is CSS here.
 */
export function ThemeToggle() {
  return (
    <button
      type="button"
      aria-disabled="true"
      aria-label="Light mode is not available"
      className="grid size-[45px] shrink-0 cursor-default place-items-center"
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
