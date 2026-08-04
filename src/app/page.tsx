import { ScrollReveals } from "@/components/motion/ScrollReveals";
import { HeroNav } from "@/components/sections/hero/HeroNav";
import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { Intro } from "@/components/sections/Intro";
import { FeaturedWork } from "@/components/sections/FeaturedWork";
import { Experiences } from "@/components/sections/Experiences";
import { Services } from "@/components/sections/Services";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import { BootSequence } from "@/components/ui/BootSequence";

/**
 * Sections in Figma order.
 *
 * Inter-section spacing: each section owns its own TOP padding and adds no
 * bottom padding, so a gap is never contributed by both neighbours. The Footer
 * is the sole exception — as the last element it owns the page's trailing space.
 *
 * The nav lives in a <header> that is a SIBLING of <main>, not inside it:
 * <header> only maps to the `banner` landmark when it is not a descendant of
 * main/section/article. HeroNav positions itself absolutely and reserves no
 * height, so the shared `relative` wrapper overlays it on the hero with no
 * layout shift while keeping it reachable via landmark navigation.
 *
 * Marquee is a direct child of <main>: it is full-bleed and a shell wrapper
 * would defeat that.
 */
export default function Home() {
  return (
    <>
      {/* Outside `.app-scale` on purpose: that element carries `zoom`, and a
          `fixed` descendant of a zoomed element is scaled with it, so the
          overlay would not cover the viewport. */}
      <BootSequence />

      <div className="app-scale relative flex min-h-full flex-col">
        <header>
          <HeroNav />
        </header>

        <main>
          <Hero />
          <Marquee />
          <Intro />
          <FeaturedWork />
          <Experiences />
          <Services />
          <Contact />
        </main>

        <Footer />

        {/*
          Phase 4. Renders nothing — it owns one ScrollTrigger set for the whole
          page, driven by `data-reveal-group` / `data-reveal` attributes in the
          sections. Every section stays a Server Component; the client boundary
          is this leaf and <MarqueeMotion> inside <Marquee>.
        */}
        <ScrollReveals />
      </div>
    </>
  );
}
