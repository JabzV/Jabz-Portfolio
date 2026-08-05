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
      className="shell pt-24 md:pt-64"
    >
      <div className="md:grid md:grid-cols-12">
        {/* Header column. Sits ~82px below the grid top in the design. */}
        {/* Phase 4 reveal hooks: attributes only, no structure change. */}
        <header data-reveal-group className="md:col-span-5 md:pt-20">
          <h2
            data-reveal
            id="experiences-title"
            className="text-section-title-sm font-display text-fg uppercase"
          >
            {experiencesCopy.title}
          </h2>
          <p
            data-reveal
            className="text-card-title font-accent text-fg-muted mt-4 max-w-sm uppercase"
          >
            {experiencesCopy.subtitle}
          </p>
        </header>

        {/* The checkerboard. One <li> per real experience; each row also carries
            its decorative empty companion cell, which is aria-hidden and is
            deliberately not a list item — three experiences, three list items. */}
        <ul role="list" className="mt-10 list-none md:col-span-7 md:mt-0">
          {experiences.map((experience, index) => {
            const filledOnLeft = index % 2 === 0;
            return (
              // `data-reveal="fade"` (opacity only, no y): the cards are 381 wide
              // on a 380 pitch and share their border pixels with the row above
              // via `-mt-px`, so translating a row would visibly tear the
              // collapsed border away from its neighbour mid-animation.
              <li
                key={experience.marker}
                data-reveal-group
                data-reveal="fade"
                className={`md:grid md:grid-cols-2 md:ml-px ${index > 0 ? "-mt-px" : ""}`}
              >
                {/* Cells are emitted in VISUAL order and take their column from
                    auto-placement. An explicit `col-start` here left a hole:
                    sparse placement never moves the cursor backwards, so row 2's
                    card at col 2 followed by its empty at col 1 opened a whole
                    extra row. Order, not placement, drives the checkerboard. */}
                {filledOnLeft ? (
                  <>
                    <ExperienceCard experience={experience} />
                    <EmptyCard />
                  </>
                ) : (
                  <>
                    <EmptyCard />
                    <ExperienceCard experience={experience} />
                  </>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/** A filled card: oxblood fill, hairline border, marker top-right, text bottom-left. */
function ExperienceCard({ experience }: { experience: Experience }) {
  return (
    // `group` for hover. Deliberately NO lift/translate here, unlike the other
    // hover treatments: these cards share collapsed borders with their neighbours
    // (`md:-ml-px` here, `-mt-px` on the rows), so translating one would tear its
    // border away from the card beside it. The response is colour and glow only,
    // which the collapsed construction tolerates. Like services, a card is not a
    // link and carries no `data-cursor`, so the cursor stays `default`.
    <article className="group bg-surface-filled border-border-card hover:border-accent-soft flex min-h-56 flex-col border px-5 py-6 transition-colors duration-300 md:-ml-px md:min-h-72 md:px-6 md:py-9">
      <div className="flex items-start justify-between gap-4">
        <LogoSlot />
        <p className="text-meta font-display text-fg group-hover:text-shadow-glow-link transition-[text-shadow] duration-(--duration-hover)">{`[ ${experience.marker} ]`}</p>
      </div>

      <div className="mt-16 md:mt-auto">
        <h3 className="text-card-title font-display text-fg">{experience.company}</h3>
        <p className="text-meta font-display text-fg-subtle mt-8">{experience.role}</p>
        {/* `font-semibold` is a contrast fix, not a design choice: #c75057 on
            #1a0303 measures 4.45:1 at 18px, just under the 4.5:1 floor for
            normal-weight text. General Sans ships a real 600, so nothing is
            synthesized. */}
        <p className="text-date font-body text-accent-soft mt-1 font-semibold">{`// ${experience.period}`}</p>
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
function EmptyCard() {
  return (
    <div
      aria-hidden="true"
      className="bg-bg border-border-card hidden border md:-ml-px md:block md:min-h-72"
    />
  );
}
