import Link from "next/link";
import type { ReactNode } from "react";

/**
 * The design's primary button: a 240×60 rectangle with the bottom-left and
 * top-right corners chamfered.
 *
 * In Figma the chamfer is faked by overlaying two 30px squares rotated 45° and
 * filled with the page background. That only works over a flat background, so
 * here it is a real `clip-path` instead — background-independent and it scales.
 * A 30px square rotated 45° centred on a corner cuts 21.21px (30/√2) off each edge.
 *
 * The clip lives on an inner layer rather than on the interactive element,
 * because a clipped element also clips its own focus outline — putting it on the
 * anchor/button would make the focus ring invisible.
 *
 * Used by the intro ("More About me", accent) and featured work ("View Portfolio",
 * light). Shared deliberately: two builders owning one button guarantees drift.
 */

const CHAMFER = "21.21px";

const clipPath = `polygon(0 0, calc(100% - ${CHAMFER}) 0, 100% ${CHAMFER}, 100% 100%, ${CHAMFER} 100%, 0 calc(100% - ${CHAMFER}))`;

const variants = {
  accent: { fill: "bg-accent group-hover:bg-accent-soft", label: "text-fg" },
  light: { fill: "bg-button-light group-hover:bg-fg", label: "text-fg-inverse" },
} as const;

type Props = {
  children: ReactNode;
  href?: string | null;
  variant?: keyof typeof variants;
  className?: string;
};

export function NotchedButton({ children, href, variant = "accent", className = "" }: Props) {
  const v = variants[variant];

  const classes = [
    "group relative inline-flex items-center justify-center",
    // 44px minimum touch target below md; 60px is the designed height
    "min-h-[44px] px-8 py-3 md:h-[60px] md:min-w-[240px]",
    "font-accent text-lead uppercase",
    v.label,
    className,
  ].join(" ");

  const inner = (
    <>
      <span
        aria-hidden="true"
        className={`absolute inset-0 transition-colors duration-200 ${v.fill}`}
        style={{ clipPath }}
      />
      <span className="relative">{children}</span>
    </>
  );

  // The design defines no link targets (U6). Until one exists, render a button
  // rather than an <a> with no href, which is unreachable by keyboard.
  if (!href) {
    return (
      <button type="button" className={classes}>
        {inner}
      </button>
    );
  }

  const external = href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("http");

  if (external) {
    return (
      <a href={href} className={classes}>
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {inner}
    </Link>
  );
}
