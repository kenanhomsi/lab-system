import type { ParameterSchemaInput } from "../abstraction";

type FindAllQueryParams = {
  Page?: string;
  PageSize?: string;
  Search?: string;
  IsActive?: string;
  Role?: string;
  SortBy?: string;
  SortDesc?: string;
};

type FindAllMedicalTestsParams = {
  query?: FindAllQueryParams;
};

type FindOneMedicalTestParams = {
  id: string;
};

type CreateMedicalTestParams = {
  nameAr: string;
  nameEn: string;
  price: number;
  category: string;
  sampleType: string;
  parameterSchema: ParameterSchemaInput;
  status: string;
};

type UpdateMedicalTestParams = {
  id: string;
  nameAr: string;
  nameEn: string;
  price: number;
  category: string;
  sampleType: string;
  parameterSchema: ParameterSchemaInput;
  status: string;
};

type DeleteMedicalTestParams = {
  id: string;
};

export type {
  DeleteMedicalTestParams,
  FindAllQueryParams,
  FindAllMedicalTestsParams,
  FindOneMedicalTestParams,
  CreateMedicalTestParams,
  UpdateMedicalTestParams,
};
