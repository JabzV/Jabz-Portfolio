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
    <li className="list-none">
      <h3 className="text-item-title font-display text-fg flex items-baseline gap-3 uppercase md:gap-4">
        <span aria-hidden="true" className="text-meta font-display text-fg-subtle shrink-0">
          //{service.index}
        </span>
        <span>{service.title}</span>
      </h3>
      <div className="border-t border-rule" />
      <p className="text-lead font-accent text-fg-muted mt-4 uppercase md:pl-services-indent">
        {service.description}
      </p>
    </li>
  );
}
