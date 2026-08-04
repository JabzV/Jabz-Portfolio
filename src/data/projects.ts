export type Project = {
  /** Display index shown as `//n`. */
  index: number;
  title: string;
  /** Rendered at a smaller size inside the title, mid-word. `null` when the title is uniform. */
  accent: { char: string; after: string } | null;
  image: string;
  alt: string;
  href: string | null;
};

/**
 * Featured Work. Order here is render order (top to bottom).
 *
 * Every `image` is the same greybox placeholder — the Figma contains no real
 * project imagery (see docs/design/00-overview.md defect 3). Replace per project
 * and drop `imageIsPlaceholder` handling in the component once real art exists.
 *
 * `href` is null throughout: the design defines no link targets (U6).
 */
export const projects: Project[] = [
  {
    index: 1,
    title: "LIVESWEALTH",
    accent: null,
    image: "/assets/featured-work/project-placeholder.svg",
    alt: "Liveswealth project preview — placeholder",
    href: null,
  },
  {
    index: 2,
    // The "9" is set in the accent face at a smaller size in the design.
    title: "J9 DESIGN AND BUILD",
    accent: { char: "9", after: " DESIGN AND BUILD" },
    image: "/assets/featured-work/project-placeholder.svg",
    alt: "J9 Design and Build project preview — placeholder",
    href: null,
  },
  {
    index: 3,
    title: "BATCHLINX",
    accent: null,
    image: "/assets/featured-work/project-placeholder.svg",
    alt: "Batchlinx project preview — placeholder",
    href: null,
  },
  {
    index: 4,
    title: "BG WEBSITE",
    accent: null,
    image: "/assets/featured-work/project-placeholder.svg",
    alt: "BG Website project preview — placeholder",
    href: null,
  },
];
