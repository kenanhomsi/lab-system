import type { PaginatedStoreOrders, StoreOrderStatus } from "@/modules/store";

type Params = {
  ordersData: PaginatedStoreOrders;
  isPending: boolean;
  refetchOrders: () => void;
  updateStatusMutation: {
    mutateAsync: (params: { id: number; status: StoreOrderStatus }) => Promise<unknown>;
    isPending: boolean;
  };
};

const emptyOrders = (): PaginatedStoreOrders => ({
  items: [],
  page: 1,
  pageSize: 20,
  totalCount: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
});

const store = (): Params => ({
  ordersData: emptyOrders(),
  isPending: false,
  refetchOrders: () => {},
  updateStatusMutation: { mutateAsync: async () => {}, isPending: false },
});

export { store as apiStore, emptyOrders };
export type { Params as apiParams };
