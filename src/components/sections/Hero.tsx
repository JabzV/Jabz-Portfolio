import Image from "next/image";

import { BioCard } from "@/components/sections/hero/BioCard";
import { HeroNav } from "@/components/sections/hero/HeroNav";
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
 *           it carries the 801px design height, so the section is sized by real
 *           content, not by an absolute canvas. The cover image is pinned behind
 *           it (`inset-0`) and every remaining piece is layered decoration or a
 *           free-floating text block pinned over the cover.
 *  - `<lg`  a flex column: nav, cover image (aspect-locked), red panel, quotes,
 *           BIO card, social rail. Purely decorative layers drop out.
 *
 * Horizontal design coordinates are converted to right/percentage offsets
 * wherever a 1440-based `left` would fall off a 1024px viewport; vertical
 * coordinates hold unchanged at `lg` because the section height does.
 *
 * DEFECT 6: the Figma cover sits at `left: 216px` with width 1440 inside a 1440
 * frame, overflowing by 216px. Treated as a mistake — pinned to `left: 0`.
 */
export function Hero() {
  const [jobs, ford] = heroCopy.quotes;

  return (
    <section
      aria-labelledby="hero-headline"
      className="bg-bg relative flex w-full flex-col gap-10 overflow-hidden pb-16 lg:block lg:gap-0 lg:pb-0"
    >
      <HeroNav />

      {/* Plane 1 — cover image, and the wordmark stack that sits on top of it but
          under the red panel (the design's paint order). */}
      <div className="relative aspect-[1440/801] w-full overflow-hidden lg:absolute lg:inset-0 lg:z-0 lg:aspect-auto">
        <Image
          src="/assets/hero/hero-cover.png"
          alt=""
          width={1440}
          height={801}
          priority
          sizes="100vw"
          className="h-full w-full object-cover object-center"
        />
        <LayeredWordmark />
      </div>

      {/* Plane 2 — the red panel. Full-width block below `lg`; the designed
          453×801 slab flush left at `lg`+. Its children flow in reading order
          below `lg` and take their design coordinates at `lg`+. */}
      <div className="bg-accent relative z-10 flex w-full flex-col gap-8 px-5 py-8 sm:px-8 lg:block lg:h-[801px] lg:w-[453px] lg:gap-0 lg:p-0">
        {/* Hero copyright (22:4371) + light-mode link (22:4361).
            DEFECT 5: this copyright also exists in the footer. Kept — different
            size (12px) and role (a print-style credit on the poster). */}
        <div className="flex items-start justify-between gap-4 lg:absolute lg:top-3 lg:right-[10px] lg:left-4">
          <p className="text-caption text-fg">{site.copyright}</p>
          {/* `lightModeLink.href` is null (U6) and the light design does not
              exist, so this is static text, not a link. */}
          <p className="text-caption text-fg text-right whitespace-pre-line underline lg:w-[111px]">
            {heroCopy.lightModeLink.label}
          </p>
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

        {/* `resume.href` is null (U6): a button, not an <a> with no target. */}
        <button
          type="button"
          className="text-body text-fg font-body min-h-[44px] self-start text-left whitespace-pre transition-opacity hover:opacity-70 lg:absolute lg:top-[711px] lg:left-[49px] lg:min-h-0"
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
