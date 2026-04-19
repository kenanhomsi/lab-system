import type { ChangePasswordRequest, MeUser, UpdateMeRequest } from "../types";

type Params = {
  me: MeUser | null;
  isPending: boolean;
  updateMe: (payload: UpdateMeRequest) => Promise<unknown>;
  changePassword: (payload: ChangePasswordRequest) => Promise<unknown>;
  requestDeletion: () => Promise<unknown>;
};

const apiStore = (): Params => ({
  me: null,
  isPending: false,
  updateMe: async () => null,
  changePassword: async () => null,
  requestDeletion: async () => null,
});

export { apiStore };
export type { Params as apiParams };

