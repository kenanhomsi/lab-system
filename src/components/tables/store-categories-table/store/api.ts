import type { StoreCategory } from "@/modules/store";
import type { UpsertStoreCategoryInput } from "@/modules/store/abstraction/schemas";

type Params = {
  categoriesData: StoreCategory[];
  isPending: boolean;
  refetchCategories: () => void;
  createMutation: { mutateAsync: (data: UpsertStoreCategoryInput) => Promise<unknown> };
  updateMutation: {
    mutateAsync: (params: { id: number; data: UpsertStoreCategoryInput }) => Promise<unknown>;
  };
  deleteMutation: { mutateAsync: (id: number) => Promise<unknown> };
};

const store = (): Params => ({
  categoriesData: [],
  isPending: false,
  refetchCategories: () => {},
  createMutation: { mutateAsync: async () => {} },
  updateMutation: { mutateAsync: async () => {} },
  deleteMutation: { mutateAsync: async () => {} },
});

export { store as apiStore };
export type { Params as apiParams };
