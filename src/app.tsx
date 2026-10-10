import { FaqAccordion } from '@/components/sections/FaqAccordion';
import { FeaturedTours } from '@/components/sections/FeaturedTours';
import { GalleryParallax } from '@/components/sections/GalleryParallax';
import { Hero } from '@/components/sections/Hero';
import { PlanCta } from '@/components/sections/PlanCta';
import { Destinations } from '@/components/sections/Destinations';
import { Testimonials } from '@/components/sections/Testimonials';
import { TrustMarquee } from '@/components/sections/TrustMarquee';
import { Welcome } from '@/components/sections/Welcome';
import { WhyChooseUs } from '@/components/sections/WhyChooseUs';
import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { SmoothScroll } from '@/components/layout/SmoothScroll';
import { SectionDivider } from '@/components/ui/SectionDivider';

/**
 * Musti Targui Morocco Tours — single-page scroll landing page.
 *
 * The narrative order descends from the city into the desert:
 * hero → trust → welcome → why us (dark) → tours → destinations →
 * reviews → gallery (night) → plan CTA (night) → FAQ → footer.
 */
export default function App() {
  return (
    <SmoothScroll>
      <Navbar />

      <main>
        <Hero />
        <TrustMarquee />
        <Welcome />
        <SectionDivider className="bg-sand pb-2" />
        <WhyChooseUs />
        <FeaturedTours />
        <Destinations />
        <Testimonials />
        <GalleryParallax />
        <PlanCta />
        <FaqAccordion />
      </main>

      <Footer />
    </SmoothScroll>
  );
}
