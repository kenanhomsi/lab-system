import {
  CreateAccessPolicyRequest,
  AccessPoliciesResponse,
  UpdateAccessPolicyRequest,
} from "../types";

type Params = {
  policiesData: AccessPoliciesResponse;
  isPending: boolean;
  refetchAccessPolicies: () => void;
  createAccessPolicy: (payload: CreateAccessPolicyRequest) => Promise<unknown>;
  updateAccessPolicy: (id: string, payload: UpdateAccessPolicyRequest) => Promise<unknown>;
  deleteAccessPolicy: (id: string) => Promise<unknown>;
  enableAccessPolicy: (id: string) => Promise<unknown>;
  disableAccessPolicy: (id: string) => Promise<unknown>;
  validateAccessPolicy: (payload: CreateAccessPolicyRequest) => Promise<unknown>;
};

const store = (): Params => ({
  policiesData: [],
  isPending: false,
  refetchAccessPolicies: () => {},
  createAccessPolicy: async () => null,
  updateAccessPolicy: async () => null,
  deleteAccessPolicy: async () => null,
  enableAccessPolicy: async () => null,
  disableAccessPolicy: async () => null,
  validateAccessPolicy: async () => null,
});

export { store as apiStore };
export type { Params as apiParams };
