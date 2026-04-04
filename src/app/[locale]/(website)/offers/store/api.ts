export type Offer = {
  id: string;
  name: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercent: number;
  expiryDate: string;
  image?: string;
};

export type OffersApiSliceState = {
  offers: Offer[];
  locale: string;
};

export const initialApiState: OffersApiSliceState = {
  offers: [],
  locale: "en",
};
