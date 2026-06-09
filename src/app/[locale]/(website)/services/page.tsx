import { ServicesHeroSection } from "../ui/services/hero-section";
import { ServiceCategories } from "../ui/services/service-categories";
import { TestsOverview } from "../ui/services/tests-overview";
import { ServicesCtaSection } from "../ui/services/cta-section";
import { PageBannerOverflowServer, PageBannerSlotServer } from "@/components/layout/page-banner-slots-server";
import { BANNER_PLACEMENT } from "@/lib/banners/locations";

export default function ServicesPage() {
  return (
    <main>
      <ServicesHeroSection />
      <PageBannerSlotServer placement={BANNER_PLACEMENT.SERVICES} order={1} />
      <ServiceCategories />
      <PageBannerSlotServer placement={BANNER_PLACEMENT.SERVICES} order={2} />
      <TestsOverview />
      <PageBannerSlotServer placement={BANNER_PLACEMENT.SERVICES} order={3} />
      <ServicesCtaSection />
      <PageBannerSlotServer placement={BANNER_PLACEMENT.SERVICES} order={4} />
      <PageBannerOverflowServer placement={BANNER_PLACEMENT.SERVICES} />
    </main>
  );
}
