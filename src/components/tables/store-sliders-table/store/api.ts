import type { StoreProduct, StoreSlider } from "@/modules/store";
import type { UpsertStoreSliderInput } from "@/modules/store/abstraction/schemas";

type Params = {
  slidersData: StoreSlider[];
  productsData: StoreProduct[];
  isPending: boolean;
  isProductsPending: boolean;
  refetchSliders: () => void;
  createMutation: { mutateAsync: (data: UpsertStoreSliderInput) => Promise<unknown> };
  updateMutation: {
    mutateAsync: (params: { id: number; data: UpsertStoreSliderInput }) => Promise<unknown>;
  };
};

const store = (): Params => ({
  slidersData: [],
  productsData: [],
  isPending: false,
  isProductsPending: false,
  refetchSliders: () => {},
  createMutation: { mutateAsync: async () => {} },
  updateMutation: { mutateAsync: async () => {} },
});

export { store as apiStore };
export type { Params as apiParams };
