import { services } from "@/data/services";
import { servicesCopy } from "@/data/site";
import { ServiceItem } from "@/components/sections/services/ServiceItem";

/**
 * Services — centred section title over four numbered service rows.
 * Figma y 4568–5737 (docs/design/06-services.md).
 *
 * The design's absolute blocks (240px pitch, 1334px rules, four gutters) are
 * rendered here as a plain vertical stack inside the page shell.
 *
 * Spacing: this section owns its TOP padding only. The 150px gap above it
 * (Experiences grid bottom -> this section's rule) is contributed entirely here;
 * the gap beneath belongs to Contact's top padding.
 */
export function Services() {
  return (
    <section aria-labelledby="services-title" className="shell pt-24 md:pt-38">
      {/* Section top rule (Figma 35:5671), normalized to the shell gutter. */}
      <div className="border-t border-rule" />

      {/* Phase 4 reveal hook: attribute only. Group and target are the same
          element, so the heading is one trigger with one target. */}
      <h2
        id="services-title"
        data-reveal-group
        className="text-section-title font-display text-fg mt-16 text-center uppercase md:mt-28"
      >
        {servicesCopy.title}
      </h2>

      {/*
        `role="list"` is explicit because `list-none` makes WebKit drop the
        implicit AXList role, so VoiceOver would announce neither a list nor an
        item count (WCAG 1.3.1).

        Pitch: the design's 240px row pitch is uniform and load-bearing, but the
        descriptions run 2-3 lines, so content height must not drive it. At `md`+
        each item is a fixed 136px block (`md:h-34`) with the design's 104px gap
        (`md:gap-26`) — a constant 240px pitch. Overflow stays visible, so a
        3-line description spills into the gap exactly as it does in the Figma
        frame rather than being clipped. Below `md` the items fall back to
        content height, since the fluid type invalidates a fixed 136px.
      */}
      <ul role="list" className="mt-16 flex list-none flex-col gap-20 md:mt-33 md:gap-26">
        {services.map((service) => (
          <ServiceItem key={service.title} service={service} />
        ))}
      </ul>
    </section>
  );
}
