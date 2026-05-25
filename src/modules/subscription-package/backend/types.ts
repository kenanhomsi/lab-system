type AuthParams = {
  token: string;
};

type FindAllQueryParams = {
  Page?: string;
  PageSize?: string;
  TargetAudience?: string;
  IsActive?: string;
};

type FindAllSubscriptionPackageParams = AuthParams & {
  query?: FindAllQueryParams;
};

type FindAllPublicSubscriptionPackageParams = {
  query?: FindAllQueryParams;
};

type CreateSubscriptionPackageParams = AuthParams & {
  name: string;
  price: number;
  validityDays: number;
  includedTests: string;
  targetAudience: "All" | "Patient" | "Doctor" | "LabPartner";
  isActive: boolean;
};

type FindOneSubscriptionPackageParams = AuthParams & {
  id: string;
};

type UpdateSubscriptionPackageParams = AuthParams & {
  id: string;
  name: string;
  price: number;
  validityDays: number;
  includedTests: string;
  targetAudience: "All" | "Patient" | "Doctor" | "LabPartner";
  isActive: boolean;
};

type ActivateSubscriptionPackageParams = AuthParams & {
  id: string;
};

type DeactivateSubscriptionPackageParams = AuthParams & {
  id: string;
};

export type {
  ActivateSubscriptionPackageParams,
  CreateSubscriptionPackageParams,
  DeactivateSubscriptionPackageParams,
  FindAllPublicSubscriptionPackageParams,
  FindAllQueryParams,
  FindAllSubscriptionPackageParams,
  FindOneSubscriptionPackageParams,
  UpdateSubscriptionPackageParams,
};
