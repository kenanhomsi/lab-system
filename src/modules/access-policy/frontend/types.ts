import type { AccessPolicyWritePayload } from "../abstraction";

type FindAllAccessPolicyFrontendParams = {
  query?: Record<string, string | undefined>;
};

type FindOneAccessPolicyFrontendParams = {
  id: string;
};

type CreateAccessPolicyFrontendParams = AccessPolicyWritePayload;

type UpdateAccessPolicyFrontendParams = {
  id: string;
} & AccessPolicyWritePayload;

type DeleteAccessPolicyFrontendParams = {
  id: string;
};

type EnableAccessPolicyFrontendParams = {
  id: string;
};

type DisableAccessPolicyFrontendParams = {
  id: string;
};

type ValidateAccessPolicyFrontendParams = AccessPolicyWritePayload;

export type {
  CreateAccessPolicyFrontendParams,
  DeleteAccessPolicyFrontendParams,
  DisableAccessPolicyFrontendParams,
  EnableAccessPolicyFrontendParams,
  FindAllAccessPolicyFrontendParams,
  FindOneAccessPolicyFrontendParams,
  UpdateAccessPolicyFrontendParams,
  ValidateAccessPolicyFrontendParams,
};
