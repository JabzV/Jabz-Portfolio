import Image from "next/image";

import { contact } from "@/data/site";

import { ContactCtaButton } from "./contact/ContactCtaButton";
import { ContactPanelShape } from "./contact/ContactPanelShape";
import { ContactRow } from "./contact/ContactRow";

/**
 * Contact — Figma y 6002–7349.
 *
 * Five layers in the design: a 10%-opacity texture, the top rule, the 92px
 * heading, the panel (decorative slab + three contact rows), then the tagline
 * and the CTA.
 *
 * Deviations from the Figma, all reported:
 * - The heading, tagline and button sit at three different "centres"
 *   (738 / 747.5 / 738.2) and none is the frame's true centre (720) — defects
 *   10/11. Everything here is truly centred.
 * - Row pitch is normalized (design has 153 and 156).
 * - The texture spans the whole section rather than starting 47px below the rule.
 */
export function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden pt-24 md:pt-40 xl:pt-88">
      {/* Decorative background texture. Absolute inside a section that takes its
          height from content — no absolute positioning for layout. */}
      {/* `fill` + `sizes` rather than width/height: without `sizes`, next/image
          emits a DPR srcset from the declared width and the browser fetched
          w=3840 (~93KB) for a texture that renders near-subliminally.
          opacity 0.10 -> 0.06 lifts fg-muted over this texture from a 4.24:1
          worst-case pixel to ~4.78:1, clearing 4.5:1 for the tagline and all
          three row values at once. An intentional deviation from the Figma. */}
      <Image
        src="/assets/contact/contact-bg-texture.jpg"
        alt=""
        fill
        sizes="100vw"
        quality={40}
        aria-hidden="true"
        className="pointer-events-none object-cover opacity-[0.06]"
      />

      <div className="shell relative">
        {/* The section's top rule. Spans the content column, never the 1334px
            literal and never the shipped line SVG. */}
        <div className="border-rule border-t" />

        {/* Phase 4 reveal hooks: attributes only. Four triggers down the
            section — heading, panel (three rows, staggered), tagline,
            CTA — rather than one trigger for a 1300px-tall section, which would
            reveal the bottom long before the reader reaches it. */}
        <h2
          data-reveal-group
          className="text-section-title-md font-display text-fg mt-16 text-center uppercase md:mt-44"
        >
          {contact.title.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>

        {/* The panel: decorative slab left, rows right at md+; stacked below.
            Rows are vertically CENTRED against the slab — the design centres
            them (panel centre y 6743.5, row-block centre y ≈6744). */}
        <div
          data-reveal-group
          className="mt-12 flex flex-col items-center gap-10 md:mt-20 md:flex-row md:items-center md:justify-center md:gap-4"
        >
          {/* Hidden below md: a 382×640 flat slab of unknown purpose crowds a
              phone viewport and reads as a broken image. Authored decision. */}
          {/* Not a reveal target: `ContactPanelShape` takes only `className`, and
              widening its props to pass a data attribute is more than an
              attribute edit. It is decorative, so it simply stays static. */}
          <ContactPanelShape className="hidden w-64 shrink-0 md:block lg:w-[382px]" />

          {/* A list of contact links, not a <dl>: each row is one link, so one
              <li> per row gives one tab stop and one 44px+ touch target per
              contact method. A <dl> would either split the anchor across
              <dt>/<dd> or nest an anchor around both, both worse. */}
          {/* 528px at xl is the design's hairline width (and the width of the
              source `contact-row-underline.svg`); the column IS the hairline, so
              constraining the column fixes the rule. `space-y-20` puts the row
              pitch at ~152px, matching the design's 153/156. */}
          <ul
            role="list"
            className="w-full min-w-0 list-none space-y-10 md:max-w-[590px] md:space-y-20 xl:max-w-[528px]"
          >
            {contact.rows.map((row) => (
              <ContactRow
                key={row.label}
                label={row.label}
                value={row.value}
                href={row.href}
              />
            ))}
          </ul>
        </div>

        <p
          data-reveal-group
          className="text-lead font-accent text-fg-muted mt-16 text-center uppercase"
        >
          {contact.tagline}
        </p>

        <div data-reveal-group className="mt-8 flex justify-center">
          <ContactCtaButton href={contact.cta.href}>
            {contact.cta.label}
          </ContactCtaButton>
        </div>
      </div>
    </section>
  );
}
