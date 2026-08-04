import { experiences, type Experience } from "@/data/experiences";
import { experiencesCopy } from "@/data/site";

/**
 * Experiences — Figma y 3548–4418.
 *
 * A left header column beside an offset checkerboard: 2 columns x 3 rows where
 * each row pairs one filled card with one empty card, alternating sides
 * (filled at c1, c2, c1 going down).
 *
 * Two spec defects are normalized here rather than reproduced:
 *  - defect 7, the 1px drift on card `30:5108` (left 1016 vs 1015) and the
 *    +28 vs +35 content offset on `40:15` — a CSS grid with one padding value
 *    removes both by construction.
 *  - defect 2, the literal "(Insert LOGO)" placeholder string — replaced by a
 *    neutral reserved slot (see `LogoSlot`).
 *
 * Borders collapse: cards are 381 wide on a 380 pitch, so adjacent borders
 * share a pixel line. Reproduced with `-ml-px` / `-mt-px` instead of six
 * independently bordered boxes, which would double every interior line.
 */
export function Experiences() {
  return (
    <section
      id="experiences"
      aria-labelledby="experiences-title"
      className="shell pt-24 pb-16 md:pt-64 md:pb-36"
    >
      <div className="md:grid md:grid-cols-12">
        {/* Header column. Sits ~82px below the grid top in the design. */}
        <header className="md:col-span-5 md:pt-20">
          <h2
            id="experiences-title"
            className="text-section-title-sm font-display text-fg uppercase"
          >
            {experiencesCopy.title}
          </h2>
          <p className="text-card-title font-accent text-fg-muted mt-4 max-w-sm uppercase">
            {experiencesCopy.subtitle}
          </p>
        </header>

        {/* The checkerboard. One <li> per real experience; each row also carries
            its decorative empty companion cell, which is aria-hidden and is
            deliberately not a list item — three experiences, three list items. */}
        <ul className="mt-10 list-none md:col-span-7 md:mt-0">
          {experiences.map((experience, index) => {
            const filledOnLeft = index % 2 === 0;
            return (
              <li
                key={experience.marker}
                className={`md:grid md:grid-cols-2 md:ml-px ${index > 0 ? "-mt-px" : ""}`}
              >
                <ExperienceCard
                  experience={experience}
                  className={filledOnLeft ? "md:col-start-1" : "md:col-start-2"}
                />
                <EmptyCard className={filledOnLeft ? "md:col-start-2" : "md:col-start-1"} />
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/** A filled card: oxblood fill, hairline border, marker top-right, text bottom-left. */
function ExperienceCard({
  experience,
  className,
}: {
  experience: Experience;
  className: string;
}) {
  return (
    <article
      className={`bg-surface-filled border-border-card flex min-h-56 flex-col border px-5 py-6 md:-ml-px md:min-h-72 md:px-6 md:py-9 ${className}`}
    >
      <div className="flex items-start justify-between gap-4">
        <LogoSlot />
        <p className="text-meta font-display text-fg">{`[ ${experience.marker} ]`}</p>
      </div>

      <div className="mt-16 md:mt-auto">
        <h3 className="text-card-title font-display text-fg">{experience.company}</h3>
        <p className="text-meta font-display text-fg-subtle mt-8">{experience.role}</p>
        <p className="text-date font-body text-accent-soft mt-1">{`// ${experience.period}`}</p>
      </div>
    </article>
  );
}

/**
 * Reserved space for a company logo. Every entry has `logo: null` (defect 2),
 * so nothing is drawn — the slot only holds the top row's height and left edge
 * so the marker stays right-aligned and the row height is identical across
 * cards once real logos land.
 */
function LogoSlot() {
  return <span aria-hidden="true" className="block h-6 w-6 shrink-0" />;
}

/**
 * Decorative empty cell — page background plus the shared hairline border.
 * Pure visual rhythm, so it is removed below `md`: empty bordered boxes stacked
 * on a phone read as broken or unloaded. Deliberate deviation, see RESPONSIVE.md.
 */
function EmptyCard({ className }: { className: string }) {
  return (
    <div
      aria-hidden="true"
      className={`bg-bg border-border-card hidden border md:-ml-px md:block md:min-h-72 ${className}`}
    />
  );
}
