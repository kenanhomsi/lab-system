import type { AdsResponse, CreateAdRequest, UpdateAdRequest } from "../types";

type Params = {
  adsData: AdsResponse;
  isPending: boolean;
  refetchAds: () => void;
  createAd: (payload: CreateAdRequest) => Promise<unknown>;
  updateAd: (payload: UpdateAdRequest) => Promise<unknown>;
  deleteAd: (id: number) => Promise<unknown>;
};

const store = (): Params => ({
  adsData: [],
  isPending: false,
  refetchAds: () => {},
  createAd: async () => null,
  updateAd: async () => null,
  deleteAd: async () => null,
});

export { store as apiStore };
export type { Params as apiParams };
