import type { PaginatedStoreProducts, StoreCategory } from "@/modules/store";
import type { UpsertStoreProductInput } from "@/modules/store/abstraction/schemas";

type Params = {
  productsData: PaginatedStoreProducts;
  categoriesData: StoreCategory[];
  isPending: boolean;
  refetchProducts: () => void;
  createMutation: { mutateAsync: (data: UpsertStoreProductInput) => Promise<unknown> };
  updateMutation: {
    mutateAsync: (params: { id: number; data: UpsertStoreProductInput }) => Promise<unknown>;
  };
  deleteMutation: { mutateAsync: (id: number) => Promise<unknown> };
};

const emptyProductsData = (): PaginatedStoreProducts => ({
  items: [],
  page: 1,
  pageSize: 20,
  totalCount: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
});

const store = (): Params => ({
  productsData: emptyProductsData(),
  categoriesData: [],
  isPending: false,
  refetchProducts: () => {},
  createMutation: { mutateAsync: async () => {} },
  updateMutation: { mutateAsync: async () => {} },
  deleteMutation: { mutateAsync: async () => {} },
});

export { store as apiStore, emptyProductsData };
export type { Params as apiParams };
