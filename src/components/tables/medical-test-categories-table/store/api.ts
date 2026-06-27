import type {
  MedicalTestCategoriesResponse,
  UpsertMedicalTestCategoryInput,
} from "@/modules/medical-test-categories";

type Params = {
  categoriesData: MedicalTestCategoriesResponse;
  isPending: boolean;
  refetchCategories: () => void;
  createMutation: { mutateAsync: (data: UpsertMedicalTestCategoryInput) => Promise<unknown> };
  updateMutation: {
    mutateAsync: (params: { id: number; data: UpsertMedicalTestCategoryInput }) => Promise<unknown>;
  };
  deleteMutation: { mutateAsync: (id: number) => Promise<unknown> };
};

const emptyCategories: MedicalTestCategoriesResponse = {
  items: [],
  page: 1,
  pageSize: 20,
  totalCount: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

const store = (): Params => ({
  categoriesData: emptyCategories,
  isPending: false,
  refetchCategories: () => {},
  createMutation: { mutateAsync: async () => {} },
  updateMutation: { mutateAsync: async () => {} },
  deleteMutation: { mutateAsync: async () => {} },
});

export { emptyCategories, store as apiStore };
export type { Params as apiParams };
