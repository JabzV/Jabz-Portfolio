/**
 * A warm light that follows the pointer across the red panel.
 *
 * The panel is the deadest surface in the hero — a flat `#9c2222` fill with no
 * gradient, shadow or texture anywhere in the design. Everything to its right is
 * a photograph with real light in it, so the panel reads as a sticker laid over a
 * scene. A pointer-tracked highlight makes it behave like a lit surface in the
 * same room, which is the cheapest way to tie the two halves together.
 *
 * Driven by HeroMotion via `data-hero-panel-light`. Starts invisible and is only
 * raised while the pointer is actually over the panel, so it costs one composited
 * layer and only then.
 *
 * `plus-lighter` rather than `screen`: on a saturated mid-red, `screen` washes
 * toward pink, whereas `plus-lighter` adds luminance while holding the hue.
 *
 * Positioned at the panel's origin and moved entirely by GSAP transforms — the
 * gradient never moves, because animating `radial-gradient(at X Y)` repaints the
 * whole panel every frame while translating a fixed sprite is compositor-only.
 * Centred with negative margins so GSAP owns `transform` outright.
 */
const PANEL_GRADIENT =
  "radial-gradient(circle, var(--color-glow-taillight-core) 0%, transparent 70%)";

export function HeroPanelLight() {
  return (
    <div
      aria-hidden="true"
      data-hero-panel-light
      className="pointer-events-none absolute top-0 left-0 -mt-[280px] -ml-[280px] hidden size-[560px] rounded-full opacity-0 lg:block"
      style={{ backgroundImage: PANEL_GRADIENT, mixBlendMode: "plus-lighter" }}
    />
  );
}
