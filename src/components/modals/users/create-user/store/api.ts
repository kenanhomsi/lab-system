import { CreateUserPayload } from "../types";

type Params = {
  submitCreate: (payload: CreateUserPayload) => Promise<unknown>;
};

const store = (): Params => ({
  submitCreate: async () => null,
});

export { store as apiStore };
export type { Params as apiParams };
