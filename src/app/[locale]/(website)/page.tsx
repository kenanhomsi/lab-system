import { Suspense } from "react";
import dynamic from "next/dynamic";
import { PageBannerServer } from "@/components/layout/page-banner-server";
import { BANNER_PLACEMENT } from "@/lib/banners/locations";
import { ServicesGrid } from "./ui/landing/services-grid";
import { BannerCardSliderSection } from "./ui/landing/banner-card-slider-section";
import { HeroSection } from "./ui/landing/hero-section";

const SlideCardsSection = dynamic(() =>
  import("./ui/landing/slide-cards-section").then((m) => ({
    default: m.SlideCardsSection,
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

/**
 * Renders the public customer homepage.
 */
export default function LandingPage() {
  return (
    <main>
      <HeroSection />

      <Suspense fallback={null}>
        <PageBannerServer
          placement={BANNER_PLACEMENT.HOME_PAGE}
          fallbackToHomepage={false}
        />
      </Suspense>

      <EditorialSection />
      <ServicesGrid />
      <SlideCardsSection />

      <Suspense fallback={null}>
        <BannerCardSliderSection
          placement={BANNER_PLACEMENT.MEDICAL_ADVICE}
          titleAr="نصائح طبية"
          titleEn="Medical Advice"
          descriptionAr="نصائح وصور توعوية يمكن التحكم بظهورها وترتيبها من لوحة التحكم."
          descriptionEn="Educational tips and image cards controlled from the dashboard."
          viewAllHref="/blog"
          surface="muted"
        />
      </Suspense>

      <QualitySection />
      <DepartmentsSection />

      <Suspense fallback={null}>
        <BannerCardSliderSection
          placement={BANNER_PLACEMENT.EQUIPMENT}
          titleAr="أجهزة المخبر"
          titleEn="Laboratory Equipment"
          descriptionAr="أجهزة وتقنيات المخبر مع صورة ووصف مختصر وزر تفاصيل لكل عنصر."
          descriptionEn="Lab devices and technologies with images, short descriptions, and detail actions."
          viewAllHref="/services"
        />
      </Suspense>

      <BranchesMapSection />
      <PartnersStrip />

      <Suspense fallback={null}>
        <BannerCardSliderSection
          placement={BANNER_PLACEMENT.PARTNERS}
          titleAr="شركاؤنا"
          titleEn="Our Partners"
          descriptionAr="شعارات ووصف مختصر للشركات المتعاملة معنا."
          descriptionEn="Partner logos and short descriptions managed from the dashboard."
          viewAllHref="/about"
          displayMode="logos"
          surface="muted"
        />
      </Suspense>

      <Suspense fallback={null}>
        <BannerCardSliderSection
          placement={BANNER_PLACEMENT.CLIENTS}
          titleAr="عملاؤنا"
          titleEn="Our Clients"
          descriptionAr="شركات ومؤسسات تتعامل معنا، مع إمكانية عرض الكل في صفحة منفصلة."
          descriptionEn="Organizations and companies served by the lab."
          viewAllHref="/join-as-client"
          displayMode="logos"
        />
      </Suspense>
    </main>
  );
}
