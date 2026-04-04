import { ServicesHeroSection } from "../ui/services/hero-section";
import { ServiceCategories } from "../ui/services/service-categories";
import { TestsOverview } from "../ui/services/tests-overview";
import { ServicesCtaSection } from "../ui/services/cta-section";

export default function ServicesPage() {
  return (
    <main>
      <ServicesHeroSection />
      <ServiceCategories />
      <TestsOverview />
      <ServicesCtaSection />
    </main>
  );
}
