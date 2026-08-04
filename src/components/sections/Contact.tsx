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
    <section id="contact" className="relative overflow-hidden pt-24 pb-20 md:pt-64">
      {/* Decorative background texture. Absolute inside a section that takes its
          height from content — no absolute positioning for layout. */}
      <Image
        src="/assets/contact/contact-bg-texture.jpg"
        alt=""
        width={736}
        height={1308}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-10"
      />

      <div className="shell relative">
        {/* The section's top rule. Spans the content column, never the 1334px
            literal and never the shipped line SVG. */}
        <div className="border-rule border-t" />

        <h2 className="text-section-title-md font-display text-fg mt-16 text-center uppercase md:mt-44">
          {contact.title.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>

        {/* The panel: decorative slab left, rows right at md+; stacked below. */}
        <div className="mt-12 flex flex-col items-center gap-10 md:mt-20 md:flex-row md:items-start md:justify-center md:gap-4">
          {/* Hidden below md: a 382×640 flat slab of unknown purpose crowds a
              phone viewport and reads as a broken image. Authored decision. */}
          <ContactPanelShape className="hidden w-64 shrink-0 md:block lg:w-[382px]" />

          {/* A list of contact links, not a <dl>: each row is one link, so one
              <li> per row gives one tab stop and one 44px+ touch target per
              contact method. A <dl> would either split the anchor across
              <dt>/<dd> or nest an anchor around both, both worse. */}
          <ul className="w-full min-w-0 list-none space-y-10 md:max-w-[590px] md:space-y-12">
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

        <p className="text-lead font-accent text-fg-muted mt-16 text-center uppercase">
          {contact.tagline}
        </p>

        <div className="mt-8 flex justify-center">
          <ContactCtaButton href={contact.cta.href}>
            {contact.cta.label}
          </ContactCtaButton>
        </div>
      </div>
    </section>
  );
}
