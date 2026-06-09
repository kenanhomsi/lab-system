import { AboutAccreditationStrip } from "../ui/about/accreditation-strip";
import { AboutCtaSection } from "../ui/about/cta-section";
import { AboutHeritageTimeline } from "../ui/about/heritage-timeline";
import { AboutHeroSection } from "../ui/about/hero-section";
import { AboutLeadershipGrid } from "../ui/about/leadership-grid";
import { AboutMethodologyGrid } from "../ui/about/methodology-grid";
import { PageBannerOverflowServer, PageBannerSlotServer } from "@/components/layout/page-banner-slots-server";
import { BANNER_PLACEMENT } from "@/lib/banners/locations";

export default function AboutPage() {
  return (
    <main>
      <AboutHeroSection />
      <PageBannerSlotServer placement={BANNER_PLACEMENT.ABOUT} order={1} />
      <AboutHeritageTimeline />
      <PageBannerSlotServer placement={BANNER_PLACEMENT.ABOUT} order={2} />
      <AboutMethodologyGrid />
      <PageBannerSlotServer placement={BANNER_PLACEMENT.ABOUT} order={3} />
      <AboutLeadershipGrid />
      <PageBannerSlotServer placement={BANNER_PLACEMENT.ABOUT} order={4} />
      <AboutAccreditationStrip />
      <PageBannerSlotServer placement={BANNER_PLACEMENT.ABOUT} order={5} />
      <AboutCtaSection />
      <PageBannerSlotServer placement={BANNER_PLACEMENT.ABOUT} order={6} />
      <PageBannerOverflowServer placement={BANNER_PLACEMENT.ABOUT} />
    </main>
  );
}
