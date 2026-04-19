import { Dispatch, SetStateAction } from "react";
import { FormState, defaultForm } from "../types";

type Params = {
  form: FormState;
  setForm: Dispatch<SetStateAction<FormState>>;
  isSubmitting: boolean;
  setIsSubmitting: Dispatch<SetStateAction<boolean>>;
};

const store = (): Params => ({
  form: defaultForm,
  setForm: () => {},
  isSubmitting: false,
  setIsSubmitting: () => {},
});

export { store as stateStore };
export type { Params as stateParams };
