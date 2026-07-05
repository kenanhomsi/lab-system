import dynamic from "next/dynamic";
import { getLocale } from "next-intl/server";
import { fetchPublicBannersForPlacement } from "@/lib/banners/fetch-public-banners";
import type { BannerPlacement } from "@/lib/banners/locations";

const BannerCardSliderClient = dynamic(() =>
  import("./banner-card-slider-client").then((m) => ({
    default: m.BannerCardSliderClient,
  })),
);

type BannerCardSliderSectionProps = {
  placement: BannerPlacement;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  viewAllHref?: string;
  displayMode?: "cards" | "logos";
  surface?: "plain" | "muted";
};

/**
 * Fetches a public banner placement and presents it as a homepage card slider.
 */
export async function BannerCardSliderSection({
  placement,
  titleAr,
  titleEn,
  descriptionAr,
  descriptionEn,
  viewAllHref,
  displayMode,
  surface,
}: BannerCardSliderSectionProps) {
  const [locale, banners] = await Promise.all([
    getLocale(),
    fetchPublicBannersForPlacement(placement, false),
  ]);

  if (banners.length === 0) return null;

  const isArabic = locale === "ar";

  return (
    <BannerCardSliderClient
      banners={banners}
      title={isArabic ? titleAr : titleEn}
      description={isArabic ? descriptionAr : descriptionEn}
      viewAllHref={viewAllHref}
      displayMode={displayMode}
      surface={surface}
    />
  );
}
