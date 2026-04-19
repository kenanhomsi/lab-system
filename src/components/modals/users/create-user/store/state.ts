import { Dispatch, SetStateAction } from "react";
import { CreateUserPayload, initialValues } from "../types";

type Params = {
  form: CreateUserPayload;
  setForm: Dispatch<SetStateAction<CreateUserPayload>>;
  isSubmitting: boolean;
  setIsSubmitting: Dispatch<SetStateAction<boolean>>;
};

const store = (): Params => ({
  form: initialValues,
  setForm: () => {},
  isSubmitting: false,
  setIsSubmitting: () => {},
});

export { store as stateStore };
export type { Params as stateParams };
