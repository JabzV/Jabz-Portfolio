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
    // `group` for the hover treatment. NOTE: a service is not a link and never
    // becomes one — so the response is deliberately ambient (a rule scanning in,
    // a glow) and carries no `data-cursor`, which means the custom cursor stays
    // in its `default` state here. The cursor is what tells the reader whether
    // something is clickable; this only tells them the interface is alive.
    <li data-reveal-group className="group md:h-34">
      <h3
        data-reveal
        className="text-item-title font-display text-fg flex items-baseline gap-3 uppercase md:gap-4"
      >
        {/* The `//` is braced rather than bare JSX text: bare `//` trips
            react/jsx-no-comment-textnodes, which reads it as a stray comment. */}
        <span
          aria-hidden="true"
          className="text-meta font-display text-fg-subtle group-hover:text-accent-soft shrink-0 transition-colors duration-200"
        >
          {`//${service.index}`}
        </span>
        <span className="group-hover:text-shadow-glow-link transition-[text-shadow] duration-(--duration-hover)">
          {service.title}
        </span>
      </h3>
      {/* The rule stays put (the reveal deliberately lets text rise past it); an
          accent overlay wipes across it from the left instead of the line itself
          moving or recolouring. */}
      <div className="border-rule relative border-t">
        <span
          aria-hidden="true"
          className="bg-accent-soft absolute inset-x-0 -top-px block h-px origin-left scale-x-0 transition-transform duration-500 ease-(--ease-hero-out) group-hover:scale-x-100"
        />
      </div>
      <p
        data-reveal
        className="text-lead font-accent text-fg-muted mt-4 uppercase md:pl-services-indent"
      >
        {service.description}
      </p>
    </li>
  );
}
