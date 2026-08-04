/**
 * A lit filament down the red panel's right edge (design x = 453).
 *
 * This is the highest-value *compositional* change in the hero lighting: that
 * edge is currently a hard seam where the flat accent panel meets a photograph,
 * and it reads as a crop. A 2px glowing line reframes it as an installed light
 * strip — the panel becomes a lightbox standing in the scene rather than a
 * rectangle pasted over it.
 *
 * Why this is a separate component from HeroGlow: it must paint ABOVE the red
 * panel (`z-10`), whereas HeroGlow lives inside the cover plane at `z-0`. So this
 * is a direct child of the section at `lg:z-20`.
 *
 * lg+ only. Below lg the panel is a full-width block stacked under the cover
 * rather than beside it, so there is no vertical seam to light.
 *
 * Server Component — pure CSS, works with JS disabled.
 *
 * The static `shadow-glow-edge` is painted once and cached. Only the travelling
 * segment animates, and only on `transform`, inside a 2px-wide clipping strip —
 * about as cheap as a composited layer gets. Animating the box-shadow itself
 * would be a per-frame raster op over the blur radius and is banned here.
 */
export function HeroEdgeLight() {
  return (
    <div
      aria-hidden="true"
      data-hero-glow
      className="bg-glow-edge shadow-glow-edge pointer-events-none absolute top-0 hidden h-[793px] w-[2px] overflow-hidden lg:left-[453px] lg:z-20 lg:block"
    >
      {/* Travelling bright segment. `hero-edge-travel` fades in and out at the
          ends so it does not pop at the clip boundary. */}
      <div className="animate-hero-edge from-glow-edge/0 via-fg to-glow-edge/0 h-[22%] w-full bg-gradient-to-b" />
    </div>
  );
}
