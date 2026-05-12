import type { AccessPolicyWritePayload } from "../abstraction";

type AuthParams = {
  token: string;
};

type FindAllAccessPolicyParams = AuthParams & {
  query?: Record<string, string | undefined>;
};

type CreateAccessPolicyParams = AuthParams & AccessPolicyWritePayload;

type FindOneAccessPolicyParams = AuthParams & {
  id: string;
};

type UpdateAccessPolicyParams = AuthParams & {
  id: string;
} & AccessPolicyWritePayload;

type DeleteAccessPolicyParams = AuthParams & {
  id: string;
};

type EnableAccessPolicyParams = AuthParams & {
  id: string;
};

type DisableAccessPolicyParams = AuthParams & {
  id: string;
};

type ValidateAccessPolicyParams = AuthParams & AccessPolicyWritePayload;

export type {
  CreateAccessPolicyParams,
  DeleteAccessPolicyParams,
  DisableAccessPolicyParams,
  EnableAccessPolicyParams,
  FindAllAccessPolicyParams,
  FindOneAccessPolicyParams,
  UpdateAccessPolicyParams,
  ValidateAccessPolicyParams,
};
