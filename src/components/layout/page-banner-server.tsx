import { fetchPublicBannersForPlacement } from "@/lib/banners/fetch-public-banners";
import { PageBanner } from "./page-banner";

type PageBannerServerProps = {
  placement: string;
  fallbackToHomepage?: boolean;
};

export async function PageBannerServer({
  placement,
  fallbackToHomepage = true,
}: PageBannerServerProps) {
  const banners = await fetchPublicBannersForPlacement(
    placement,
    fallbackToHomepage,
  );
  if (banners.length === 0) return null;
  return <PageBanner banners={banners} />;
}
