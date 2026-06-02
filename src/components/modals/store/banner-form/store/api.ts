import type { UpsertStoreBannerInput } from "@/modules/store/abstraction/schemas";

type Params = {
  createBanner: (data: UpsertStoreBannerInput) => Promise<unknown>;
  updateBanner: (params: { id: number; data: UpsertStoreBannerInput }) => Promise<unknown>;
};

const store = (): Params => ({
  createBanner: async () => {},
  updateBanner: async () => {},
});

export { store as apiStore };
export type { Params as apiParams };
