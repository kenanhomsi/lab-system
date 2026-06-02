import type { StoreBanner } from "@/modules/store";
import type { UpsertStoreBannerInput } from "@/modules/store/abstraction/schemas";

type Params = {
  bannersData: StoreBanner[];
  isPending: boolean;
  refetchBanners: () => void;
  createMutation: { mutateAsync: (data: UpsertStoreBannerInput) => Promise<unknown> };
  updateMutation: {
    mutateAsync: (params: { id: number; data: UpsertStoreBannerInput }) => Promise<unknown>;
  };
};

const store = (): Params => ({
  bannersData: [],
  isPending: false,
  refetchBanners: () => {},
  createMutation: { mutateAsync: async () => {} },
  updateMutation: { mutateAsync: async () => {} },
});

export { store as apiStore };
export type { Params as apiParams };
