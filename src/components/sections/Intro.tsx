import Image from "next/image";

import { NotchedButton } from "@/components/ui/NotchedButton";
import { intro } from "@/data/site";

/**
 * Intro / statement — Figma y 944–1663 (docs/design/03-intro.md).
 *
 * Three layers in the design, expressed here in flow rather than absolutely:
 *   1. cityscape background at 10% — the only absolutely positioned layer,
 *      inside this <section> which takes its height from the content;
 *   2. the statement paragraph (mixed-case in the DOM, uppercased in CSS);
 *   3. the right-aligned "MORE ABOUT ME" button (the shared NotchedButton).
 *
 * The statement is body copy, not a heading — the hero owns the document <h1>
 * and this section has no title in the design, so no <h*> is introduced.
 */
export function Intro() {
  return (
    <section
      id="about"
      aria-label="Introduction"
      className="relative overflow-hidden pt-20 pb-24 md:pt-40 md:pb-40 xl:pt-68 xl:pb-44"
    >
      {/* Decorative: 1440×881 in the design, cropped to the section box. */}
      <Image
        src="/assets/intro/cityscape-bg.jpg"
        alt=""
        aria-hidden="true"
        width={1440}
        height={881}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-10"
      />

      <div className="shell relative">
        <div className="relative">
          <p className="text-statement font-accent text-fg-muted max-w-5xl uppercase">
            {intro.statement}
          </p>

          {/* Decorative scanline crop (Figma 30:4986). Dropped below lg. */}
          <Image
            src="/assets/texture-scanline.png"
            alt=""
            aria-hidden="true"
            width={283}
            height={119}
            className="pointer-events-none absolute top-9 right-8 hidden lg:block"
          />
        </div>

        <div className="mt-16 flex sm:justify-end md:mt-24">
          <NotchedButton href={intro.cta.href} variant="accent" className="w-full sm:w-auto">
            {intro.cta.label}
          </NotchedButton>
        </div>
      </div>
    </section>
  );
}
