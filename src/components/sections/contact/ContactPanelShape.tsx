/**
 * The decorative `Subtract` slab from the contact panel (Figma `41:122`,
 * 382×640.354): a rectangle with the top-left and bottom-right corners sliced
 * off at ~45° by ~99px.
 *
 * Shipped as `public/assets/contact/contact-subtract-shape.svg` with the fill
 * baked in as `#d9d9d9`. The path is inlined here instead of loaded through
 * `next/image` for one reason only: inline SVG can take the fill from the
 * `contact-panel` token, so the colour lives in the theme rather than in a
 * binary-ish asset. The path data is copied verbatim — not reimplemented.
 *
 * Purely decorative (spec: content UNKNOWN, a flat slab with nothing in it),
 * so it is hidden from assistive tech.
 */
export function ContactPanelShape({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 381.999 640.354"
      role="presentation"
      aria-hidden="true"
      focusable="false"
      className={`fill-contact-panel h-auto ${className}`}
    >
      <path d="M381.999 543.602L282.993 640.178L283.174 640.354H0V96.75L99.0049 0.175781L98.8242 0H381.999V543.602Z" />
    </svg>
  );
}
