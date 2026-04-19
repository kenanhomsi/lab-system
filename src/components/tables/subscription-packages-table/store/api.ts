import {
  CreateSubscriptionPackageRequest,
  SubscriptionPackagesResponse,
  UpdateSubscriptionPackageRequest,
} from "../types";

type Params = {
  packagesData: SubscriptionPackagesResponse;
  isPending: boolean;
  refetchPackages: () => void;
  createPackage: (payload: CreateSubscriptionPackageRequest) => Promise<unknown>;
  updatePackage: (
    id: number,
    payload: UpdateSubscriptionPackageRequest,
  ) => Promise<unknown>;
  activatePackage: (id: number) => Promise<unknown>;
  deactivatePackage: (id: number) => Promise<unknown>;
};

const store = (): Params => ({
  packagesData: {
    items: [],
    page: 1,
    pageSize: 20,
    totalCount: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },
  isPending: false,
  refetchPackages: () => {},
  createPackage: async () => null,
  updatePackage: async () => null,
  activatePackage: async () => null,
  deactivatePackage: async () => null,
});

export { store as apiStore };
export type { Params as apiParams };
