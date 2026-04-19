import { FormState } from "../types";

type Params = {
  canSubmit: boolean;
  handleClose: () => void;
  updateField: <K extends keyof FormState>(field: K, value: FormState[K]) => void;
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
