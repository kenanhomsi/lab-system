import { ServicesHeroSection } from "../ui/services/hero-section";
import { ServiceCategories } from "../ui/services/service-categories";
import { TestsOverview } from "../ui/services/tests-overview";
import { ServicesCtaSection } from "../ui/services/cta-section";
import { PageBannerServer } from "@/components/layout/page-banner-server";
import { BANNER_PLACEMENT } from "@/lib/banners/locations";

export default function ServicesPage() {
  return (
    <main>
      <ServicesHeroSection />
      <PageBannerServer placement={BANNER_PLACEMENT.SERVICES} />
      <ServiceCategories />
      <TestsOverview />
      <ServicesCtaSection />
    </main>
  );
}
