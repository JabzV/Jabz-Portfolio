export type Experience = {
  /** Bracketed marker shown as `[ n ]` — descends down the page in the design. */
  marker: number;
  company: string;
  role: string;
  /** Rendered with a leading `//`. */
  period: string;
  /**
   * Company logo. `null` for every entry: the Figma has literal "(Insert LOGO)"
   * placeholder text and contains no logo assets (docs/design/00-overview.md
   * defect 2). Components must render a neutral slot, never the placeholder string.
   */
  logo: string | null;
};

/**
 * Experience entries. Order here is render order (top to bottom), which runs
 * markers 3 → 1 as in the design.
 *
 * Laid out as an offset checkerboard: entries alternate between the left and
 * right column, with an empty card filling the opposite cell on each row.
 */
export const experiences: Experience[] = [
  {
    marker: 3,
    company: "Batchlinx [Startup]",
    role: "Project Lead",
    period: "2026 - Present",
    logo: null,
  },
  {
    marker: 2,
    company: "PrinceTechnologies Corporation",
    role: "Software Developer",
    period: "Jan 2025 - Present",
    logo: null,
  },
  {
    marker: 1,
    company: "Freelance",
    role: "Software Developer",
    period: "Aug 2024 - Present",
    logo: null,
  },
];
