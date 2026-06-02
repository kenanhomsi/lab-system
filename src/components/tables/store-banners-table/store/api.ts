import type { StoreBanner } from "@/modules/store";

type Params = {
  bannersData: StoreBanner[];
  isPending: boolean;
  refetchBanners: () => void;
};

const store = (): Params => ({
  bannersData: [],
  isPending: false,
  refetchBanners: () => {},
});

export { store as apiStore };
export type { Params as apiParams };
