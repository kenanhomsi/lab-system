import type { UpsertStoreCategoryInput } from "@/modules/store/abstraction/schemas";

type Params = {
  createCategory: (data: UpsertStoreCategoryInput) => Promise<unknown>;
  updateCategory: (params: { id: number; data: UpsertStoreCategoryInput }) => Promise<unknown>;
};

const store = (): Params => ({
  createCategory: async () => {},
  updateCategory: async () => {},
});

export { store as apiStore };
export type { Params as apiParams };
