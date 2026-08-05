import Image from "next/image";

/**
 * Anaglyph fringe over the cover photo: a red copy and a cyan copy, blended
 * additively and pushed in opposite directions by the pointer. The eye reads
 * opposed colour fringes as depth, so the still photograph gains a sense of
 * dimension without anything actually moving in 3D.
 *
 * ── Why this is affordable, when "filters are expensive" is the usual rule ────
 * The filters here are STATIC. A filter is rasterised into the layer once and
 * cached; what costs per frame is *animating* a filter. Only `transform` is
 * animated, which is compositor-only. So this is two extra composited layers of
 * an already-decoded bitmap, not two per-frame raster passes.
 *
 * `mix-blend-mode: screen` also stays cheap here because the backdrop it reads —
 * the base cover image — is static. (The one case that would be expensive is
 * blending against something that is itself animating, which is why the glow
 * sprites are siblings of the cover wrapper rather than children of it.)
 *
 * Each copy is a WRAPPER that GSAP transforms, with the <Image> inside carrying
 * the Tailwind `lg:translate-x-[10.5%]` — the same split the base cover uses.
 * Letting both write the same element's transform would have them clobber each
 * other.
 *
 * lg+ only. Below lg the cover is a small aspect-locked block, there is no
 * pointer, and two extra full-width composited layers on a phone is a bad trade.
 * Starts at opacity 0 and is raised on pointerenter by HeroMotion, so it costs
 * nothing until the reader actually moves a pointer over the hero.
 */

/** sepia+saturate+hue-rotate is the cheap way to force a bitmap toward one hue. */
const RED = "sepia(1) saturate(7) hue-rotate(-38deg)";
const CYAN = "sepia(1) saturate(6) hue-rotate(150deg)";

const SRC = "/assets/hero/hero-cover.webp";

function Channel({ tone, filter }: { tone: "r" | "c"; filter: string }) {
  return (
    <div
      data-hero-chroma={tone}
      className="absolute inset-0 opacity-0"
      style={{ mixBlendMode: "screen" }}
    >
      <Image
        src={SRC}
        alt=""
        fill
        // Same source as the base cover, so the browser reuses the decoded
        // bitmap — no extra download, no extra decode.
        unoptimized
        className="object-cover object-top lg:translate-x-[10.5%]"
        style={{ filter }}
      />
    </div>
  );
}

export function HeroChromatic() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden lg:block">
      <Channel tone="r" filter={RED} />
      <Channel tone="c" filter={CYAN} />
    </div>
  );
}
