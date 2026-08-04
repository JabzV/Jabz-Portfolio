import { services } from "@/data/services";
import { servicesCopy } from "@/data/site";
import { ServiceItem } from "@/components/sections/services/ServiceItem";

/**
 * Services — centred section title over four numbered service rows.
 * Figma y 4568–5737 (docs/design/06-services.md).
 *
 * The design's absolute blocks (240px pitch, 1334px rules, four gutters) are
 * rendered here as a plain vertical stack inside the page shell.
 */
export function Services() {
  return (
    <section className="shell pt-20 pb-20 md:pt-36 md:pb-32">
      {/* Section top rule (Figma 35:5671), normalized to the shell gutter. */}
      <div className="border-t border-rule" />

      <h2 className="text-section-title font-display text-fg mt-16 text-center uppercase md:mt-28">
        {servicesCopy.title}
      </h2>

      <ul className="mt-16 flex list-none flex-col gap-20 md:gap-26">
        {services.map((service) => (
          <ServiceItem key={service.title} service={service} />
        ))}
      </ul>
    </section>
  );
}
