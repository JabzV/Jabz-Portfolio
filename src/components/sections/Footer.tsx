import { site } from "@/data/site";

/**
 * Footer — a rule and the copyright line. Figma y 7349–7580.
 *
 * Owns its top gap (contact CTA bottom → rule ≈ 81px in the design) and, as the
 * last element on the page, is the one place that legitimately carries bottom
 * padding: the design leaves ~231px of trailing space below the rule.
 */
export function Footer() {
  return (
    <footer className="shell pt-12 pb-24 md:pt-16 md:pb-36 xl:pt-20 xl:pb-44">
      <div className="border-t border-rule" />
      <p className="text-lead text-fg mt-4 text-center sm:text-left">{site.copyright}</p>
    </footer>
  );
}
