import { NotchedButton } from "@/components/ui/NotchedButton";
import { projects } from "@/data/projects";
import { featuredWork } from "@/data/site";
import { ProjectRow } from "./featured-work/ProjectRow";

/**
 * Featured Work — Figma y 1842–3291.
 *
 * A top rule, centred 112px title, subtitle, "View Portfolio" button, then four
 * project rows separated by rules. See docs/design/04-featured-work.md.
 *
 * Rules are `border-t border-rule`, never the shipped 1334×1 SVG, and they span
 * the content column rather than a fixed width (RESPONSIVE.md).
 */
export function FeaturedWork() {
  return (
    <section id="work" className="shell mt-20">
      <header>
        <div className="border-t border-rule" />
        <h2 className="text-section-title font-display text-fg mt-16 text-center uppercase">
          {featuredWork.title}
        </h2>
        <p className="text-card-title font-accent text-fg-muted mt-8 uppercase">
          {featuredWork.subtitle}
        </p>
        <div className="mt-4">
          <NotchedButton href={featuredWork.cta.href} variant="light">
            {featuredWork.cta.label}
          </NotchedButton>
        </div>
      </header>

      <ul className="mt-20 list-none">
        {projects.map((project) => (
          <li key={project.index} className="border-rule border-t last:border-b">
            <ProjectRow project={project} />
          </li>
        ))}
      </ul>
    </section>
  );
}
