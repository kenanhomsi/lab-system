import { UpdateUserPayload } from "../types";

type Params = {
  canSubmit: boolean;
  handleClose: () => void;
  updateField: (field: keyof UpdateUserPayload, value: UpdateUserPayload[keyof UpdateUserPayload]) => void;
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
