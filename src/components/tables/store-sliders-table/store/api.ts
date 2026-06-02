import type { StoreProduct, StoreSlider } from "@/modules/store";

type Params = {
  slidersData: StoreSlider[];
  productsData: StoreProduct[];
  isPending: boolean;
  isProductsPending: boolean;
  refetchSliders: () => void;
};

const store = (): Params => ({
  slidersData: [],
  productsData: [],
  isPending: false,
  isProductsPending: false,
  refetchSliders: () => {},
});

export { store as apiStore };
export type { Params as apiParams };
