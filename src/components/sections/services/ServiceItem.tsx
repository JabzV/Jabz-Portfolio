import type { Service } from "@/data/services";

/**
 * One service row: `//n` + title on a single line, a hairline rule beneath, then
 * the description. Figma item geometry (local, 1334×136): title block at top,
 * rule 49px down, description indented 129px at 66px down.
 *
 * The `//n` is decorative labelling, so it is `aria-hidden` — a screen reader
 * announces the heading as the service name alone.
 */
export function ServiceItem({ service }: { service: Service }) {
  return (
    // Phase 4 reveal hooks: attributes only. The <li> is the trigger; the title
    // and description are the staggered targets. The rule between them is left
    // out on purpose so it stays put while the text rises past it.
    // `md:h-34` is the design's 136px item height, holding the row pitch at a
    // uniform 240px with the list's 104px gap. Overflow is visible, so 3-line
    // descriptions spill into the gap instead of being clipped.
    <li data-reveal-group className="md:h-34">
      <h3
        data-reveal
        className="text-item-title font-display text-fg flex items-baseline gap-3 uppercase md:gap-4"
      >
        <span aria-hidden="true" className="text-meta font-display text-fg-subtle shrink-0">
          //{service.index}
        </span>
        <span>{service.title}</span>
      </h3>
      <div className="border-t border-rule" />
      <p
        data-reveal
        className="text-lead font-accent text-fg-muted mt-4 uppercase md:pl-services-indent"
      >
        {service.description}
      </p>
    </li>
  );
}
