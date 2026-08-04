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
    // `data-reveal` is on the row content, not on the <li>: the <li> carries the
    // hairline rules, and translating those would make the rules bob while their
    // neighbours stayed put. The <li> is the trigger; this is the target.
    <div data-reveal className="grid gap-6 py-3 md:grid-cols-5 md:items-end">
      {/* 28px inset from the row's own rule — the design insets the numbered
          title block, matching the intro statement. Two-column widths only. */}
      <div className="flex items-baseline gap-3 md:col-span-2 md:pl-7">
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
          // The visible #d9d9d9 rect ends at x 703.177 of the 766 box, so 62.823px
          // (8.2%) of the outer box is pure triangle overhang. Shifting the image
          // right by that fraction of its own width lands the rect flush with the
          // rule's right end and lets the overhang bleed into the gutter, as
          // designed. Two-column widths only: in the stacked layout the image is
          // the full content column and the shift would overflow the viewport.
          className="aspect-[766/248] h-auto w-full md:translate-x-[8.2%]"
        />
      </div>
    </div>
  );
}
