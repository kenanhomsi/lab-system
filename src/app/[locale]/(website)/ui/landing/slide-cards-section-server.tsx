import { fetchPublicSlideCards } from "@/lib/api/fetch-public-slide-cards";
import { SlideCardsWebsiteClient } from "./slide-cards-website";

/** Server wrapper: fetches slide cards once and hydrates the lightweight client UI. */
export async function SlideCardsSection() {
  const initialCards = await fetchPublicSlideCards();
  if (initialCards.length === 0) return null;
  return <SlideCardsWebsiteClient initialCards={initialCards} />;
}
