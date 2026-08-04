/**
 * Ambient lighting for the hero cover.
 *
 * A Server Component on purpose: the ambient glows are pure CSS keyframes, so
 * they work with JS disabled and survive GSAP failing to load. Only the pointer
 * scan light needs JS, and that is driven from HeroMotion via `data-hero-scan`.
 *
 * ── Why these coordinates ────────────────────────────────────────────────────
 * The cover photograph already contains four real light sources. Every sprite
 * here is pinned to one of them, so the effect amplifies light that is already
 * in the image rather than laying neon on top of it. Positions were measured off
 * the raster (2154×1198) and converted to the on-screen band:
 *
 *                        ≥lg (x, y)        <lg (x, y)
 *   bike taillight       67.3%, 67.2%      56.8%, 67.0%
 *   lamp A (upper right) 92.5%, 33.8%      82.0%, 33.5%
 *   lamp B (mid right)   79.8%, 44.2%      69.3%, 43.8%
 *   lamp cluster (left)  36.4%, 39.7%      25.9%, 39.3%
 *
 * The ≥lg figures include the image's own `lg:translate-x-[10.5%]`.
 *
 * ── Registration caveat: do NOT "fix" this in JS ─────────────────────────────
 * Between lg (1024px) and 1440px the band height is locked at 793 while its
 * width shrinks, so `object-cover`'s fit axis flips and the content re-crops
 * horizontally. The taillight drifts about **40px** across that range. The
 * mitigation is SIZING, not tracking: every sprite's radius is ≥6× that drift,
 * so a 40px misregistration is invisible inside the haze. Adding a
 * ResizeObserver here would be cost for no visible gain. Above 1440px `zoom`
 * preserves the ratio exactly, so there is no drift at all.
 *
 * ── Structure: why every glow is two elements ────────────────────────────────
 * CSS `animation` outranks inline styles, so a GSAP `opacity` set on an element
 * already running the breathe keyframe is a silent no-op. Therefore:
 *   outer [data-hero-glow] — position, centring, blend mode, GSAP entrance opacity
 *   inner                  — the gradient and the CSS breathe (opacity + scale)
 * The blend sits on the OUTER so the whole group is composited additively
 * against the photograph; the inner's animation then modulates within it.
 *
 * Everything is `pointer-events-none` and `aria-hidden`.
 */

/** Bike taillight — hot red-white, the brightest thing in the frame. */
const TAILLIGHT_POS = "top-[67.0%] left-[56.8%] lg:top-[67.2%] lg:left-[67.3%]";

/** Street lamps. Cyan-white, matching the photo — red here would fight the image. */
const LAMPS = [
  { pos: "lg:top-[33.8%] lg:left-[92.5%]", size: "size-[220px]", animate: "animate-hero-lamp-a" },
  { pos: "lg:top-[44.2%] lg:left-[79.8%]", size: "size-[170px]", animate: "animate-hero-lamp-b" },
  { pos: "lg:top-[39.7%] lg:left-[36.4%]", size: "size-[190px]", animate: "animate-hero-lamp-c" },
] as const;

const CORE_GRADIENT =
  "radial-gradient(circle, var(--color-glow-taillight-core) 0%, transparent 68%)";
const HAZE_GRADIENT =
  "radial-gradient(circle, var(--color-glow-taillight-haze) 0%, transparent 72%)";
const LAMP_GRADIENT = "radial-gradient(circle, var(--color-glow-lamp) 0%, transparent 70%)";
const SCAN_GRADIENT = "radial-gradient(circle, var(--color-glow-scan) 0%, transparent 65%)";

export function HeroGlow() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Taillight haze — the wide atmospheric bloom. Because it blends additively
          over an area that is ALREADY emitting in the photograph, there is no
          visible sprite edge. */}
      <div
        data-hero-glow
        className={`absolute -translate-x-1/2 -translate-y-1/2 ${TAILLIGHT_POS}`}
        style={{ mixBlendMode: "screen" }}
      >
        <div
          className="animate-hero-glow-haze size-[420px] rounded-full"
          style={{ backgroundImage: HAZE_GRADIENT }}
        />
      </div>

      {/* Taillight core — tighter and hotter, on a different period so the
          combined beat drifts and never reads as a sine wave. */}
      <div
        data-hero-glow
        className={`absolute -translate-x-1/2 -translate-y-1/2 ${TAILLIGHT_POS}`}
        style={{ mixBlendMode: "screen" }}
      >
        <div
          className="animate-hero-glow-core size-[140px] rounded-full"
          style={{ backgroundImage: CORE_GRADIENT }}
        />
      </div>

      {/* Street lamps. lg+ only: below lg the cover is a small aspect-locked block
          where 190px glows have nothing to sit on, and three extra composited
          layers on a phone is a bad trade. They reuse the loader's own
          `boot-flicker` curve — that reuse is the strongest "same world as the
          boot sequence" move available, not a shortcut. */}
      {LAMPS.map((lamp) => (
        <div
          key={lamp.animate}
          data-hero-glow
          className={`absolute hidden -translate-x-1/2 -translate-y-1/2 lg:block ${lamp.pos}`}
          style={{ mixBlendMode: "screen" }}
        >
          <div
            className={`${lamp.animate} ${lamp.size} rounded-full`}
            style={{ backgroundImage: LAMP_GRADIENT }}
          />
        </div>
      ))}

      {/* Pointer scan light. Positioned at the plane's origin and moved entirely by
          GSAP transforms — the gradient itself never moves, because animating a
          `radial-gradient(circle at X Y)` repaints the whole band every frame
          whereas translating a fixed sprite is a compositor-only operation.
          Centred on the pointer via negative margins so GSAP owns `transform`
          outright; a Tailwind `-translate-x-1/2` here would be overwritten.
          Opacity starts at 0 and is raised on pointerenter — it is NOT in the
          entrance timeline, so it carries no `data-hero-glow`. */}
      <div
        data-hero-scan
        className="absolute top-0 left-0 -mt-[320px] -ml-[320px] hidden size-[640px] rounded-full opacity-0 lg:block"
        style={{ backgroundImage: SCAN_GRADIENT, mixBlendMode: "plus-lighter" }}
      />
    </div>
  );
}
