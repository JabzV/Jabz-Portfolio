/**
 * One vertical katakana column (Figma `22:4364` ジャベス, `22:4365` スピード).
 *
 * These are the only two nodes on the page with an explicit numeric line-height,
 * and they disagree with each other (40 vs 48) — reproduced via the two
 * `leading-katakana*` tokens, flagged as probably unintentional.
 *
 * Rendered one glyph per line so the column reads top-to-bottom without
 * `writing-mode`, which would not honour the numeric line-height the same way.
 * Decorative romanisation of the name ("jabesu" / "supiido") — `aria-hidden`.
 */
export function KatakanaColumn({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  return (
    <p aria-hidden="true" lang="ja" className={`text-katakana text-fg font-body ${className}`}>
      {[...text].map((glyph, i) => (
        <span key={`${glyph}-${i}`} className="block">
          {glyph}
        </span>
      ))}
    </p>
  );
}
