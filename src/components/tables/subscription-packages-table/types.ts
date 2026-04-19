export type TargetAudience = "All" | "Patient" | "Doctor" | "LabPartner";

export type SubscriptionPackageItem = {
  id: number;
  name: string;
  price: number;
  validityDays: number;
  includedTests: string;
  targetAudience: TargetAudience;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type SubscriptionPackagesResponse = {
  items: SubscriptionPackageItem[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type CreateSubscriptionPackageRequest = {
  name: string;
  price: number;
  validityDays: number;
  includedTests: string;
  targetAudience: TargetAudience;
  isActive: boolean;
};

export type UpdateSubscriptionPackageRequest = CreateSubscriptionPackageRequest;

export type SubscriptionPackageModalType = "create" | "edit";
