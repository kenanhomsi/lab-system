export type MedicalTestCategory = {
  id: number;
  nameAr: string;
  nameEn: string;
  description: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type MedicalTestCategoriesResponse = {
  items: MedicalTestCategory[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type UpsertMedicalTestCategoryInput = {
  nameAr: string;
  nameEn: string;
  description: string;
  displayOrder: number;
  isActive: boolean;
};
