import { Suspense } from "react";
import dynamic from "next/dynamic";
import { HeroSection } from "./ui/landing/hero-section";
import { PageBannerServer } from "@/components/layout/page-banner-server";
import { BANNER_PLACEMENT } from "@/lib/banners/locations";

const ServicesGrid = dynamic(() =>
  import("./ui/landing/services-grid").then((m) => ({
    default: m.ServicesGrid,
  })),
);
const EditorialSection = dynamic(() =>
  import("./ui/landing/editorial-section").then((m) => ({
    default: m.EditorialSection,
  })),
);
const QualitySection = dynamic(() =>
  import("./ui/landing/quality-section").then((m) => ({
    default: m.QualitySection,
  })),
);
const DepartmentsSection = dynamic(() =>
  import("./ui/landing/departments-section").then((m) => ({
    default: m.DepartmentsSection,
  })),
);
const BranchesMapSection = dynamic(() =>
  import("./ui/landing/branches-map-section").then((m) => ({
    default: m.BranchesMapSection,
  })),
);
const PartnersStrip = dynamic(() =>
  import("./ui/landing/partners-strip").then((m) => ({
    default: m.PartnersStrip,
  })),
);

export default function LandingPage() {
  return (
    <main>
      kenan
      <HeroSection />
      <Suspense fallback={null}>
        <PageBannerServer placement={BANNER_PLACEMENT.HOME_PAGE} />
      </Suspense>
      <EditorialSection />
      <ServicesGrid />
      <QualitySection />
      <DepartmentsSection />
      <BranchesMapSection />
      <PartnersStrip />
    </main>
  );
}
