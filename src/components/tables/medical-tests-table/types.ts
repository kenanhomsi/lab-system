import type { ParameterSchemaInput } from "@/modules/medical-tests/abstraction";

export type MedicalTestItem = {
  id: number;
  nameAr: string;
  nameEn: string;
  price: number;
  categoryMedicalId: number | null;
  categoryNameAr?: string;
  categoryNameEn?: string;
  category: string;
  sampleType: string;
  parameterSchema: ParameterSchemaInput;
  status: string;
  createdByUserId: string;
  createdAt: string;
  updatedAt: string;
};

export type MedicalTestsResponse = {
  items: MedicalTestItem[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};
