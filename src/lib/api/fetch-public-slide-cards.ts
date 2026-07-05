import { unstable_cache } from "next/cache";
import { backendContainer } from "@/container/backend";
import { slideCardModuleNames } from "@/modules/slide-card";
import { SlideCardBackendService } from "@/modules/slide-card/backend";
import type { SlideCardItem } from "@/types/slide-card";

const PUBLIC_SLIDE_CARDS_REVALIDATE_SECONDS = 300;
const PUBLIC_SLIDE_CARDS_CACHE_TAG = "website-slide-cards";

const slideCardService = backendContainer.get<SlideCardBackendService>(
  slideCardModuleNames.service,
);

async function fetchPublicSlideCardsFromBackend(): Promise<SlideCardItem[]> {
  try {
    return await slideCardService.findAllPublic({});
  } catch {
    return [];
  }
}

const fetchPublicSlideCardsCached = unstable_cache(
  fetchPublicSlideCardsFromBackend,
  ["website-public-slide-cards"],
  {
    revalidate: PUBLIC_SLIDE_CARDS_REVALIDATE_SECONDS,
    tags: [PUBLIC_SLIDE_CARDS_CACHE_TAG],
  },
);

/**
 * Returns active public slide cards for dashboard and website surfaces.
 */
export async function fetchPublicSlideCards(): Promise<SlideCardItem[]> {
  const cards = await fetchPublicSlideCardsCached();
  return cards
    .filter((item) => item.isActive)
    .sort((a, b) => a.displayOrder - b.displayOrder);
}
