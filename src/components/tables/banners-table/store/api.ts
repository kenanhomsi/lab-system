import { CreateBannerRequest, BannersResponse } from "../types";

type Params = {
  bannersData: BannersResponse;
  isPending: boolean;
  refetchBanners: () => void;
  createBanner: (payload: CreateBannerRequest) => Promise<unknown>;
  deleteBanner: (id: string) => Promise<unknown>;
};

const store = (): Params => ({
  bannersData: [],
  isPending: false,
  refetchBanners: () => {},
  createBanner: async () => null,
  deleteBanner: async () => null,
});

export { store as apiStore };
export type { Params as apiParams };
