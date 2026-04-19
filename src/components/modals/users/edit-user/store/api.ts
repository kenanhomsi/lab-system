import { UpdateUserPayload } from "../types";

type Params = {
  submitUpdate: (params: { id: string; payload: UpdateUserPayload }) => Promise<unknown>;
};

const store = (): Params => ({
  submitUpdate: async () => null,
});

export { store as apiStore };
export type { Params as apiParams };
