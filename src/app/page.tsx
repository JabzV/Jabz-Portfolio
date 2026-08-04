import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { Intro } from "@/components/sections/Intro";
import { FeaturedWork } from "@/components/sections/FeaturedWork";
import { Experiences } from "@/components/sections/Experiences";
import { Services } from "@/components/sections/Services";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";

/**
 * Sections in Figma order. Inter-section spacing is owned by each section's own
 * top padding — no section adds bottom padding for the gap beneath it, so gaps
 * are never contributed by both neighbours.
 *
 * Marquee is a direct child of <main>, not wrapped: it is full-bleed and a shell
 * container would defeat that.
 */
export default function Home() {
  return (
    <>
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
    </>
  );
}
