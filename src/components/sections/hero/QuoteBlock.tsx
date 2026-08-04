import type { ComponentProps } from "react";

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
  ...rest
}: {
  text: string;
  author: string;
} & ComponentProps<"figure">) {
  return (
    <figure className={`text-body text-fg font-body ${className}`} {...rest}>
      <blockquote>
        <span className="underline">&ldquo;{text}&rdquo;</span>
      </blockquote>
      <figcaption>— {author}</figcaption>
    </figure>
  );
}
