import type { UpsertMedicalTestCategoryInput } from "../abstraction";

type AuthParams = {
  token: string;
};

type ListMedicalTestCategoriesParams = AuthParams & {
  query?: Record<string, string | number | boolean | undefined>;
};

type GetMedicalTestCategoryParams = AuthParams & {
  id: number;
};

type CreateMedicalTestCategoryParams = AuthParams & UpsertMedicalTestCategoryInput;

type UpdateMedicalTestCategoryParams = AuthParams &
  UpsertMedicalTestCategoryInput & {
    id: number;
  };

type DeleteMedicalTestCategoryParams = AuthParams & {
  id: number;
};

export type {
  CreateMedicalTestCategoryParams,
  DeleteMedicalTestCategoryParams,
  GetMedicalTestCategoryParams,
  ListMedicalTestCategoriesParams,
  UpdateMedicalTestCategoryParams,
};
