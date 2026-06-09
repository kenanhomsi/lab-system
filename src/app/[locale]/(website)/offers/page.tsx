import { getLocale } from "next-intl/server";
import { OffersFeatureFactory } from "./factory";
import type { Offer } from "./store/api";
import { getRequestOrigin } from "@/lib/api/request-origin";

export const revalidate = 3600;

async function fetchOffers(locale: string): Promise<Offer[]> {
  try {
    const origin = await getRequestOrigin();
    const url = new URL("/api/offers", origin);
    url.searchParams.set("locale", locale);
    const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function Page() {
  const locale = await getLocale();
  const offers = await fetchOffers(locale);
  return (
    <OffersFeatureFactory offers={offers} locale={locale} />
  );
}
