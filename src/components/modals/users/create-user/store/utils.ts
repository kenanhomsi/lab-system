import { CreateUserPayload } from "../types";

type Params = {
  canSubmit: boolean;
  handleClose: () => void;
  updateField: (field: keyof CreateUserPayload, value: CreateUserPayload[keyof CreateUserPayload]) => void;
  submit: () => Promise<void>;
};

const store = (): Params => ({
  canSubmit: false,
  handleClose: () => {},
  updateField: () => {},
  submit: async () => {},
});

export { store as utilsStore };
export type { Params as utilsParams };
