import { CreateUserPayload } from "../types";

type RoleOption = {
  value: string;
  label: string;
};

type Params = {
  submitCreate: (payload: CreateUserPayload) => Promise<unknown>;
  roleOptions: RoleOption[];
  isLoadingRoles: boolean;
};

const store = (): Params => ({
  submitCreate: async () => null,
  roleOptions: [],
  isLoadingRoles: false,
});

export { store as apiStore };
export type { Params as apiParams, RoleOption };
