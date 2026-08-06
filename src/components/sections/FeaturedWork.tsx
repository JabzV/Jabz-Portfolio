import { NotchedButton } from "@/components/ui/NotchedButton";
import { projects } from "@/data/projects";
import { featuredWork } from "@/data/site";
import { ProjectRow } from "./featured-work/ProjectRow";

/**
 * Featured Work — Figma y 1842–3291.
 *
 * A top rule, right-aligned 112px title, start-aligned tab-indented subtitle,
 * "More Work" button, then four project rows separated by rules. See
 * docs/design/04-featured-work.md.
 *
 * Rules are `border-t border-rule`, never the shipped 1334×1 SVG, and they span
 * the content column rather than a fixed width (RESPONSIVE.md).
 */
export function FeaturedWork() {
  return (
    // Top padding only — the section owns the full inter-section gap (180px at
    // xl, per the design's 1663→1842 gap) and adds nothing at the bottom.
    // `overflow-x-clip` bounds the project images' deliberate gutter overhang to
    // the shell box so it can never produce a horizontal scrollbar.
    <section
      id="work"
      aria-labelledby="work-title"
      className="shell overflow-x-clip pt-20 sm:pt-28 lg:pt-36 xl:pt-45"
    >
      {/* Phase 4 reveal hooks: attributes only. The header is one trigger with
          three staggered targets; each row below is its own trigger so a long
          list does not fire all at once. */}
      <header data-reveal-group>
        <div className="border-t border-rule" />
        <h2
          id="work-title"
          data-reveal
          className="text-section-title font-display text-fg mt-16 text-right uppercase"
        >
          {featuredWork.title}
        </h2>
        <p
          data-reveal
          className="text-card-title font-accent text-fg-muted indent-8 mt-8 text-left uppercase"
        >
          {featuredWork.subtitle}
        </p>
        <div data-reveal className="mt-4">
          <NotchedButton href={featuredWork.cta.href} variant="light">
            {featuredWork.cta.label}
          </NotchedButton>
        </div>
      </header>

      {/* `role="list"` is explicit: `list-none` makes WebKit drop the AXList
          role, so VoiceOver would announce neither the list nor its count. */}
      <ul role="list" className="mt-20 list-none">
        {projects.map((project) => (
          <li
            key={project.index}
            data-reveal-group
            className="border-rule border-t last:border-b"
          >
            <ProjectRow project={project} />
          </li>
        ))}
      </ul>
    </section>
  );
}
