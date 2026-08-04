import type { ReactNode } from "react";

/**
 * "CONTACT ME DIRECTLY" — Figma `41:125`, shape `41:126`.
 *
 * This is NOT the shared `NotchedButton`. Same silhouette family, different
 * geometry: 314.418×60 with ~24px bites (the shared button is 240×60 with
 * 21.21px bites), shipped as `public/assets/contact/button-shape.svg` with the
 * fill baked in. Expressed as a `clip-path` so the fill can be the
 * `button-light` token and the notches stay genuinely transparent — this
 * section has a 10%-opacity texture behind it, so a notch painted in the page
 * colour would show as a visible wedge.
 *
 * The clip lives on an inner layer, not on the <a>: a clipped element also
 * clips its own focus outline, which would make the focus ring invisible.
 */
const CHAMFER = "24px";

const clipPath = `polygon(0 0, calc(100% - ${CHAMFER}) 0, 100% ${CHAMFER}, 100% 100%, ${CHAMFER} 100%, 0 calc(100% - ${CHAMFER}))`;

type Props = {
  href: string;
  children: ReactNode;
};

export function ContactCtaButton({ href, children }: Props) {
  return (
    <a
      href={href}
      className="group relative inline-flex min-h-[44px] items-center justify-center px-8 py-3 md:h-[60px] md:min-w-[314px]"
    >
      <span
        aria-hidden="true"
        className="bg-button-light group-hover:bg-fg absolute inset-0 transition-colors duration-200"
        style={{ clipPath }}
      />
      <span className="text-lead font-accent text-fg-inverse relative uppercase">
        {children}
      </span>
    </a>
  );
}
