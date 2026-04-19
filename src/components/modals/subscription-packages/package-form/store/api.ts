import {
  CreateSubscriptionPackageRequest,
  TargetAudience,
  UpdateSubscriptionPackageRequest,
} from "@/components/tables/subscription-packages-table/types";

type Params = {
  audienceOptions: TargetAudience[];
  createPackageApi: (payload: CreateSubscriptionPackageRequest) => Promise<unknown>;
  updatePackageApi: (
    id: number,
    payload: UpdateSubscriptionPackageRequest,
  ) => Promise<unknown>;
};

const store = (): Params => ({
  audienceOptions: [],
  createPackageApi: async () => null,
  updatePackageApi: async () => null,
});

export { store as apiStore };
export type { Params as apiParams };
