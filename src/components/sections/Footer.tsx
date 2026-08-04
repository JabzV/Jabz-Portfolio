import { site } from "@/data/site";

/** Footer — a rule and the copyright line. Figma y 7349–7580. */
export function Footer() {
  return (
    <footer className="shell pt-10 pb-16">
      <div className="border-t border-rule" />
      <p className="text-lead text-fg mt-6 text-center sm:text-left">{site.copyright}</p>
    </footer>
  );
}
