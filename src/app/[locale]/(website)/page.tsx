import { Suspense } from "react";
import dynamic from "next/dynamic";
import { BANNER_PLACEMENT } from "@/lib/banners/locations";
import {
  getHomePageBannerGroups,
  HomePageBannerOverflow,
  HomePageBannerSlot,
} from "./ui/landing/home-page-banners";
import { BannerCardSliderSection } from "./ui/landing/banner-card-slider-section";
import { HeroSection } from "./ui/landing/hero-section";
import { TestsSpotlightSection } from "./ui/landing/tests-spotlight-section";

const SlideCardsSection = dynamic(() =>
  import("./ui/landing/slide-cards-section-server").then((m) => ({
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
const ServicesGrid = dynamic(() =>
  import("./ui/landing/services-grid").then((m) => ({
    default: m.ServicesGrid,
  })),
);

/**
 * Renders the public customer homepage.
 */
export default async function LandingPage() {
  const bannerGroups = await getHomePageBannerGroups();

  return (
    <main>
      <HeroSection />
      <HomePageBannerSlot groups={bannerGroups} order={1} />

      <EditorialSection />
      <HomePageBannerSlot groups={bannerGroups} order={2} />
      <ServicesGrid />
      <HomePageBannerSlot groups={bannerGroups} order={3} />
      <SlideCardsSection />
      <HomePageBannerSlot groups={bannerGroups} order={4} />

      <Suspense fallback={null}>
        <TestsSpotlightSection />
      </Suspense>
      <HomePageBannerSlot groups={bannerGroups} order={5} />

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
      <HomePageBannerSlot groups={bannerGroups} order={6} />

      <QualitySection />
      <HomePageBannerSlot groups={bannerGroups} order={7} />
      <Suspense fallback={null}>
        <BannerCardSliderSection
          placement={BANNER_PLACEMENT.DEPARTMENTS}
          titleAr="أقسام المخبر"
          titleEn="Laboratory Departments"
          descriptionAr="أقسام المخبر وخدماته التخصصية، مع زر تفاصيل على كل بطاقة."
          descriptionEn="Laboratory departments and specialties, with a details button on each card."
          viewAllHref="/services"
          surface="muted"
          fallback={<DepartmentsSection />}
        />
      </Suspense>
      <HomePageBannerSlot groups={bannerGroups} order={8} />

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
      <HomePageBannerSlot groups={bannerGroups} order={9} />

      <BranchesMapSection />
      <HomePageBannerSlot groups={bannerGroups} order={10} />
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
      <HomePageBannerSlot groups={bannerGroups} order={11} />

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
      <HomePageBannerSlot groups={bannerGroups} order={12} />
      <HomePageBannerOverflow groups={bannerGroups} />
    </main>
  );
}
