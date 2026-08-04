/**
 * A hero pull quote (Figma `16:4337` Jobs, `16:4339` Ford).
 *
 * Only the quoted sentence is underlined; the attribution is a separate unstyled
 * span, so this is two elements rather than one underlined block. The design's
 * `text-decoration-skip-ink: none` on the Jobs quote only is a trivial
 * inconsistency and is not reproduced.
 */
export function QuoteBlock({
  text,
  author,
  className = "",
}: {
  text: string;
  author: string;
  className?: string;
}) {
  return (
    <figure className={`text-body text-fg font-body ${className}`}>
      <blockquote>
        <span className="underline">&ldquo;{text}&rdquo;</span>
      </blockquote>
      <figcaption>— {author}</figcaption>
    </figure>
  );
}
