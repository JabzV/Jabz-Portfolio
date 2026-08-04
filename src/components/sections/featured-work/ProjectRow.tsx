import Image from "next/image";
import type { Project } from "@/data/projects";

/**
 * One Featured Work row. Figma ships these as four copy-pasted absolute blocks
 * (04-featured-work.md); this is the single normalized version of them.
 *
 * Layout at md+: number + title left, greybox right, bottoms aligned — the
 * design has the 35px title box bottom-flush with the 248px image bottom.
 * Below md the two stack.
 *
 * `href` is null for every project (U6), so the title is plain text: an <a>
 * without an href is unreachable by keyboard.
 */

type Props = { project: Project };

export function ProjectRow({ project }: Props) {
  return (
    <div className="grid gap-6 py-3 md:grid-cols-5 md:items-end">
      <div className="flex items-baseline gap-3 md:col-span-2">
        <span className="text-meta font-display text-fg-subtle" aria-hidden="true">
          {`//${project.index}`}
        </span>
        <h3 className="text-item-title font-display text-fg uppercase">
          {project.accent ? (
            <>
              {project.title[0]}
              {/* The "9" is a smaller accent face in the design (stylised
                  logotype). Sibling spans inside one heading still read as a
                  single continuous string to a screen reader. */}
              <span className="text-contact-label font-accent">{project.accent.char}</span>
              {project.accent.after}
            </>
          ) : (
            project.title
          )}
        </h3>
      </div>

      <div className="md:col-span-3">
        <Image
          src={project.image}
          alt={project.alt}
          width={766}
          height={248}
          // The notch/skew geometry is baked into the SVG, so it scales with the
          // element. `unoptimized` because the optimizer refuses SVG without
          // next.config's dangerouslyAllowSVG (not a file this builder owns).
          unoptimized
          className="aspect-[766/248] h-auto w-full"
        />
      </div>
    </div>
  );
}
