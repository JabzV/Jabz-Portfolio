import Image from "next/image";
import Link from "next/link";

import { BioCard } from "@/components/sections/hero/BioCard";
import { KatakanaColumn } from "@/components/sections/hero/KatakanaColumn";
import { LayeredWordmark } from "@/components/sections/hero/LayeredWordmark";
import { QuoteBlock } from "@/components/sections/hero/QuoteBlock";
import { SocialBlock } from "@/components/sections/hero/SocialBlock";
import { heroCopy, site, social } from "@/data/site";

/**
 * Hero — Figma y 0–801. A collage of layered planes rather than a stack of rows.
 *
 * Structure (one markup, two compositions):
 *
 *  - `lg`+  the designed composition. The red panel is the only in-flow child and
 *           it carries the band height, so the section is sized by real content,
 *           not by an absolute canvas. The cover image is pinned behind it
 *           (`inset-0`) and every remaining piece is layered decoration or a
 *           free-floating text block pinned over the cover.
 *           Height is 793px — the design's 801 less 1%, per an explicit request.
 *           The panel's inner coordinates are still 801-based, so the 8px comes
 *           off the bottom margin; the lowest element (the glyph trio at
 *           746 + 42 = 788) still clears it.
 *  - `<lg`  a flex column: cover image (aspect-locked), red panel, quotes,
 *           BIO card, social rail. Purely decorative layers drop out.
 *
 * The nav is NOT rendered here. `HeroNav` needs a `<header>` outside `<main>` to
 * expose a `banner` landmark, so `page.tsx` mounts it as a sibling of `<main>`
 * and it overlays this section by positioning itself.
 *
 * Horizontal design coordinates are converted to right/percentage offsets
 * wherever a 1440-based `left` would fall off a 1024px viewport; vertical
 * coordinates hold unchanged at `lg` because the section height does.
 *
 * DEFECT 6, resolved: the Figma cover sits at `left: 216px` with width 1440
 * inside a 1440 frame. This was first read as a mistake and pinned to `left: 0`,
 * which was wrong — the offset is deliberate, and the overflow is meant to be
 * clipped. The cover is now offset, tuned to put the helmet at 57% of frame
 * width. See the note on the <Image> itself.
 */
export function Hero() {
  const [jobs, ford] = heroCopy.quotes;

  return (
    <section
      aria-labelledby="hero-headline"
      className="bg-bg relative flex w-full flex-col gap-10 overflow-hidden pb-16 lg:block lg:gap-0 lg:pb-0"
    >
      {/* Plane 1 — cover image, and the wordmark stack that sits on top of it but
          under the red panel (the design's paint order). */}
      <div className="relative aspect-[1440/793] w-full overflow-hidden lg:absolute lg:inset-0 lg:z-0 lg:aspect-auto">
        {/* The LCP image.

            `fill` rather than width/height: at lg+ this plane is
            `absolute inset-0` and its height is pinned to the red panel, so the
            render box (viewport x 793) never matches the intrinsic 2154x1198
            ratio — which is exactly what triggered the dev-time
            "width or height modified, but not the other" warning. `fill` is the
            case that warning points at.

            Source re-encoded PNG -> WebP: 3.90MB -> 52KB at identical
            dimensions. The PNG mattered because public/ is served verbatim and
            the optimizer had to decode 4MB per cold-cache variant.

            `unoptimized` deliberately: the scaled canvas is 1600 CSS px wide but
            renders at the full viewport, and the browser resolves `sizes`
            against the UNZOOMED layout — so it kept picking variants far below
            the rendered size (1436px, and still only 1795px even when asked for
            3200) and upscaling them, visibly softening this image. At 52KB the
            source is smaller than most variants the optimizer would emit, so
            serving it verbatim is both sharper and lighter.

            The Figma places this image at `left: 216px` in a 1440 frame (15%),
            which is a real offset and not the mistake it was first read as.
            Tuned to 10.5% so the helmet lands at 57% of frame width: the helmet
            sits at 46.5% within the image, and because the translate is a
            percentage of the image's own width — which equals the container
            width at lg — on-screen position is just `translate% + 46.5%`,
            independent of viewport. 10.5 + 46.5 = 57.
            The uncovered strip on the left sits behind the red panel
            (453/1440 = 31.5% wide), so nothing shows through; the right side
            overflows and is clipped by the parent. Offset is lg+ only — below
            lg the panel stacks underneath rather than overlapping, so the gap
            would be visible.

            `object-top` because the design shows the image's full height with
            its top edge at y=1. Cover-cropping from the centre at viewports
            wider than 1440 pulls the framing upward and loses the top. */}
        <Image
          src="/assets/hero/hero-cover.webp"
          alt=""
          fill
          priority
          unoptimized
          className="object-cover object-top lg:translate-x-[10.5%]"
        />
        <LayeredWordmark />
      </div>

      {/* Plane 2 — the red panel. Full-width block below `lg`; the designed
          453×801 slab flush left at `lg`+. Its children flow in reading order
          below `lg` and take their design coordinates at `lg`+. */}
      <div className="bg-accent relative z-10 flex w-full flex-col gap-8 px-5 py-8 sm:px-8 lg:block lg:h-[793px] lg:w-[453px] lg:gap-0 lg:p-0">
        {/* Hero copyright (22:4371) + light-mode link (22:4361).
            DEFECT 5: this copyright also exists in the footer. Kept — different
            size (12px) and role (a print-style credit on the poster). */}
        <div className="flex items-start justify-between gap-4 lg:absolute lg:top-3 lg:right-[10px] lg:left-4">
          <p className="text-caption text-fg">{site.copyright}</p>
          {/* Now a real link to /light. It was underlined static text before,
              which was misleading — underline without a destination reads as a
              broken link. */}
          <Link
            href={heroCopy.lightModeLink.href}
            className="text-caption text-fg text-right whitespace-pre-line underline transition-opacity hover:opacity-70 lg:w-[111px]"
          >
            {heroCopy.lightModeLink.label}
          </Link>
        </div>

        {/* Wireframe globe (21:4353) + the two katakana columns. The globe's
            right edge (32+272) is exactly the first column's left edge, so the
            design's 85px-style pitch here is simply a zero gap. */}
        <div className="flex items-start lg:absolute lg:top-[33px] lg:left-8">
          <Image
            src="/assets/hero/hero-image-2.png"
            alt=""
            width={272}
            height={275}
            aria-hidden="true"
            className="h-[275px] w-[272px] max-w-none shrink-0 object-cover"
          />
          <div className="hidden shrink-0 gap-2.5 pt-[52px] md:flex">
            <KatakanaColumn text={site.katakana.name} className="leading-katakana-tight pt-1" />
            <KatakanaColumn text={site.katakana.speed} className="leading-katakana" />
          </div>
        </div>

        <h1
          id="hero-headline"
          className="text-section-title-sm text-fg font-display whitespace-nowrap lg:absolute lg:top-[321px] lg:left-[51px]"
        >
          {site.headline.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>

        <p className="text-body text-fg font-body lg:absolute lg:top-[561px] lg:left-[51px] lg:w-[371px]">
          <span className="font-semibold">{heroCopy.warningLabel}</span>: {heroCopy.warning}
        </p>

        {/* Hazard stripe rule (21:4356) */}
        <Image
          src="/assets/hero/hero-image-3.png"
          alt=""
          aria-hidden="true"
          width={379}
          height={33}
          className="h-[33px] w-full max-w-[379px] object-cover lg:absolute lg:top-[669px] lg:left-[37px]"
        />

        {/* `resume.href` is null (U6): a button, not an <a> with no target — and
            `aria-disabled` plus no hover affordance, because until a résumé file
            exists this button would otherwise promise an action it cannot do.
            Not `disabled`: that would remove it from the tab order and hide a
            visible design element. */}
        <button
          type="button"
          aria-disabled="true"
          className="text-body text-fg font-body min-h-[44px] cursor-default self-start text-left whitespace-pre lg:absolute lg:top-[711px] lg:left-[49px] lg:min-h-0"
        >
          {heroCopy.resume.label}
        </button>

        {/* Three small arrow glyphs (23:4381 / 23:4383 / 23:4385). The 81/83px
            pitch and the 3px drop on the middle, un-rotated one are
            hand-placement drift in the design; reproduced. Decorative, and they
            need the 801px band, so they appear at `lg`+ only. */}
        <span aria-hidden="true" className="hidden lg:block">
          <Image
            src="/assets/hero/hero-arrow-glyph.png"
            alt=""
            width={71}
            height={42}
            className="absolute top-[746px] left-[210px] h-[42px] w-[71px] rotate-180"
          />
          <Image
            src="/assets/hero/hero-arrow-glyph.png"
            alt=""
            width={71}
            height={42}
            className="absolute top-[749px] left-[291px] h-[42px] w-[71px]"
          />
          <Image
            src="/assets/hero/hero-arrow-glyph.png"
            alt=""
            width={71}
            height={42}
            className="absolute top-[746px] left-[374px] h-[42px] w-[71px] rotate-180"
          />
        </span>
      </div>

      {/* Plane 3 — free-floating text over the cover. */}
      <QuoteBlock
        text={ford.text}
        author={ford.author}
        className="px-5 sm:px-8 lg:absolute lg:top-[120px] lg:right-[241px] lg:z-20 lg:w-[182px] lg:px-0"
      />
      <QuoteBlock
        text={jobs.text}
        author={jobs.author}
        className="px-5 sm:px-8 lg:absolute lg:top-[696px] lg:left-[52%] lg:z-20 lg:w-[178px] lg:px-0"
      />

      {/* Decorative overlay glyphs (22:4376 arrow, 23:4379 badge). */}
      <Image
        src="/assets/hero/hero-arrow-glyph.png"
        alt=""
        aria-hidden="true"
        width={140}
        height={83}
        className="hidden h-[83px] w-[140px] rotate-180 lg:absolute lg:top-[684px] lg:right-[320px] lg:z-20 lg:block"
      />
      <Image
        src="/assets/hero/hero-badge-glyph.png"
        alt=""
        aria-hidden="true"
        width={106}
        height={109}
        className="hidden h-[109px] w-[106px] lg:absolute lg:top-[123px] lg:right-[17px] lg:z-20 lg:block"
      />

      {/* Plane 4 — the BIO card, flush to the bottom-right corner at `lg`+. */}
      <div className="self-center lg:absolute lg:right-0 lg:bottom-0 lg:z-20">
        <BioCard />
      </div>

      {/* Plane 5 — social rail. A column on the design's right edge; a centred
          row below `lg`, where a 100px-wide column would look stranded. */}
      <div className="flex flex-row justify-center gap-8 lg:absolute lg:top-[281px] lg:right-[18px] lg:z-20 lg:flex-col lg:gap-5">
        {social.map((item) => (
          <SocialBlock key={item.label} label={item.label} icon={item.icon} />
        ))}
      </div>
    </section>
  );
}
