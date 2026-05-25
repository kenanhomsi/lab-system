import type { Offer } from "@/app/[locale]/(website)/offers/store/api";
import type { MockOffer } from "@/lib/api/bff-public-mock-data";
import { MOCK_MEDICAL_TESTS } from "@/lib/api/bff-public-mock-data";

export type OfferDetail = Offer & {
  details?: string;
  includedTests?: { name: string }[];
};

function isArLocale(locale: string) {
  return locale.toLowerCase().startsWith("ar");
}

function testLabel(testId: string, locale: string): { name: string } {
  const t = MOCK_MEDICAL_TESTS.find((x) => x.id === testId);
  if (!t) return { name: testId };
  return { name: isArLocale(locale) ? t.nameAr : t.nameEn };
}

/** Map CMS-style mock rows to UI list rows (localized). */
export function mapMockOfferToListItem(mock: MockOffer, locale: string): Offer {
  const ar = isArLocale(locale);
  return {
    id: mock.id,
    name: ar ? mock.titleAr : mock.titleEn,
    description: ar ? mock.summaryAr : mock.summaryEn,
    originalPrice: mock.originalPrice,
    discountedPrice: mock.discountedPrice,
    discountPercent: mock.discountPercent,
    expiryDate: mock.validTo,
    image: undefined,
  };
}

export function mapMockOffersToList(mocks: MockOffer[], locale: string): Offer[] {
  return mocks.map((m) => mapMockOfferToListItem(m, locale));
}

export function mapMockOfferToDetail(mock: MockOffer, locale: string): OfferDetail {
  const list = mapMockOfferToListItem(mock, locale);
  const ar = isArLocale(locale);
  return {
    ...list,
    details: ar ? mock.descriptionAr : mock.descriptionEn,
    includedTests: mock.testsIncluded.map((id) => testLabel(id, locale)),
  };
}
