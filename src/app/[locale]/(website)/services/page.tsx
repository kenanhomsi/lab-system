import { ServicesHeroSection } from "../ui/services/hero-section";
import { ServiceCategories } from "../ui/services/service-categories";
import { TestsOverview } from "../ui/services/tests-overview";
import { ServicesCtaSection } from "../ui/services/cta-section";
import { PageBanner } from "@/components/layout/page-banner";

export default function ServicesPage() {
  return (
    <main>
      <ServicesHeroSection />
      <PageBanner />
      <ServiceCategories />
      <TestsOverview />
      <ServicesCtaSection />
    </main>
  );
}
