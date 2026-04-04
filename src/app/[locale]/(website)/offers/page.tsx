import { getLocale } from "next-intl/server";
import { OffersFeatureFactory } from "./factory";
import type { Offer } from "./store/api";

export const revalidate = 3600;

async function fetchOffers(): Promise<Offer[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/offers`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function Page() {
  const locale = await getLocale();
  const offers = await fetchOffers();
  return <OffersFeatureFactory offers={offers} locale={locale} />;
}
