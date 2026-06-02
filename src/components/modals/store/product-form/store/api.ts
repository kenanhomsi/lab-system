import type { UpsertStoreProductInput } from "@/modules/store/abstraction/schemas";

type Params = {
  createProduct: (data: UpsertStoreProductInput) => Promise<unknown>;
  updateProduct: (params: { id: number; data: UpsertStoreProductInput }) => Promise<unknown>;
};

const store = (): Params => ({
  createProduct: async () => {},
  updateProduct: async () => {},
});

export { store as apiStore };
