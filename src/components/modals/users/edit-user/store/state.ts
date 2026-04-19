import { Dispatch, SetStateAction } from "react";
import { UpdateUserPayload, initialValues } from "../types";

type Params = {
  form: UpdateUserPayload;
  setForm: Dispatch<SetStateAction<UpdateUserPayload>>;
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
