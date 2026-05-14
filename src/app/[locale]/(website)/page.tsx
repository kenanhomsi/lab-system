import { BranchesMapSection } from "./ui/landing/branches-map-section";
import { DepartmentsSection } from "./ui/landing/departments-section";
import { EditorialSection } from "./ui/landing/editorial-section";
import { HeroSection } from "./ui/landing/hero-section";
import { PartnersStrip } from "./ui/landing/partners-strip";
import { QualitySection } from "./ui/landing/quality-section";
import { ServicesGrid } from "./ui/landing/services-grid";
import { PageBanner } from "@/components/layout/page-banner";

export default function LandingPage() {
  return (
    <main>
      <HeroSection />
      <PageBanner />
      <EditorialSection />
      <ServicesGrid />
      <QualitySection />
      <DepartmentsSection />
      <BranchesMapSection />
      <PartnersStrip />
    </main>
  );
}
