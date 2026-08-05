/**
 * One contact method: a 38px display label, a hairline rule under it, and the
 * value sitting just below the line, indented further (Figma `40:87`, `41:94`,
 * `41:112` — identical internals in all three).
 *
 * The whole row is the link. The design specifies no targets (U6) but
 * `src/data/site.ts` carries real `mailto:`/`tel:` hrefs, and a contact section
 * whose contacts are not clickable has failed at its only job.
 *
 * The rule is a `border-t`, never the shipped one-line SVG.
 */
type Props = {
  label: string;
  value: string;
  href: string;
};

export function ContactRow({ label, value, href }: Props) {
  return (
    // Phase 4: `data-reveal` target only. The trigger is the panel wrapper in
    // Contact.tsx, so all three rows stagger together as one gesture.
    <li data-reveal>
      <a
        href={href}
        className="group flex min-h-[44px] flex-col justify-center py-2 md:py-0"
      >
        <span className="text-contact-label font-display text-fg group-hover:text-shadow-glow-link block uppercase transition-[text-shadow] duration-(--duration-hover)">
          {label}
        </span>
        {/* The hairline. A wrapper rather than a border on the value so the line
            spans the full column while the value stays indented under it.
            `relative` so the accent overlay below can sit exactly on the border. */}
        <span className="border-rule relative mt-2 block border-t pt-2">
          {/* Accent wipe along the hairline, matching the services rule and the
              project underline — one gesture reused across the site rather than
              three different hover languages. */}
          <span
            aria-hidden="true"
            className="bg-accent-soft absolute inset-x-0 -top-px block h-px origin-left scale-x-0 transition-transform duration-300 ease-(--ease-hero-out) group-hover:scale-x-100"
          />
          {/* Design indents the value 90px past the label; 96px (pl-24) is the
              nearest scale step. Full width below md so it never overflows. */}
          <span className="text-lead font-accent text-fg-muted group-hover:text-fg block break-words uppercase transition-colors duration-200 md:pl-24">
            {value}
          </span>
        </span>
      </a>
    </li>
  );
}
