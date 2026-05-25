import { AboutAccreditationStrip } from "../ui/about/accreditation-strip";
import { AboutCtaSection } from "../ui/about/cta-section";
import { AboutHeritageTimeline } from "../ui/about/heritage-timeline";
import { AboutHeroSection } from "../ui/about/hero-section";
import { AboutLeadershipGrid } from "../ui/about/leadership-grid";
import { AboutMethodologyGrid } from "../ui/about/methodology-grid";
import { PageBannerServer } from "@/components/layout/page-banner-server";
import { BANNER_PLACEMENT } from "@/lib/banners/locations";

export default function AboutPage() {
  return (
    <main>
      <AboutHeroSection />
      <PageBannerServer placement={BANNER_PLACEMENT.ABOUT} />
      <AboutHeritageTimeline />
      <AboutMethodologyGrid />
      <AboutLeadershipGrid />
      <AboutAccreditationStrip />
      <AboutCtaSection />
    </main>
  );
}
