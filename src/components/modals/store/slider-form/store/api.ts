import type { UpsertStoreSliderInput } from "@/modules/store/abstraction/schemas";

type Params = {
  createSlider: (data: UpsertStoreSliderInput) => Promise<unknown>;
  updateSlider: (params: { id: number; data: UpsertStoreSliderInput }) => Promise<unknown>;
};

const store = (): Params => ({
  createSlider: async () => {},
  updateSlider: async () => {},
});

export { store as apiStore };
export type { Params as apiParams };
