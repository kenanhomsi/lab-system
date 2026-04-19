type FindAllQueryParams = {
  Page?: string;
  PageSize?: string;
  TargetAudience?: string;
  IsActive?: string;
};

type FindAllSubscriptionPackageParams = {
  query?: FindAllQueryParams;
};

type CreateSubscriptionPackageParams = {
  name: string;
  price: number;
  validityDays: number;
  includedTests: string;
  targetAudience: "All" | "Patient" | "Doctor" | "LabPartner";
  isActive: boolean;
};

type FindOneSubscriptionPackageParams = {
  id: string;
};

type UpdateSubscriptionPackageParams = {
  id: string;
  name: string;
  price: number;
  validityDays: number;
  includedTests: string;
  targetAudience: "All" | "Patient" | "Doctor" | "LabPartner";
  isActive: boolean;
};

type ActivateSubscriptionPackageParams = {
  id: string;
};

type DeactivateSubscriptionPackageParams = {
  id: string;
};

export type {
  ActivateSubscriptionPackageParams,
  CreateSubscriptionPackageParams,
  DeactivateSubscriptionPackageParams,
  FindAllQueryParams,
  FindAllSubscriptionPackageParams,
  FindOneSubscriptionPackageParams,
  UpdateSubscriptionPackageParams,
};
