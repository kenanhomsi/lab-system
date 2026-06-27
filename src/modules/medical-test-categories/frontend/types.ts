import type { UpsertMedicalTestCategoryInput } from "../abstraction";

type ListMedicalTestCategoriesParams = {
  query?: Record<string, string | number | boolean | undefined>;
};

type GetMedicalTestCategoryParams = {
  id: number;
};

type UpdateMedicalTestCategoryParams = UpsertMedicalTestCategoryInput & {
  id: number;
};

export type {
  GetMedicalTestCategoryParams,
  ListMedicalTestCategoriesParams,
  UpdateMedicalTestCategoryParams,
};
