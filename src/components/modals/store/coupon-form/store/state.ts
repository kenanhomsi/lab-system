import type { Dispatch, SetStateAction } from "react";
import type { UpsertStoreCouponInput } from "@/modules/store/abstraction/schemas";
import { initialValues } from "../types";

type Params = {
  form: UpsertStoreCouponInput;
  setForm: Dispatch<SetStateAction<UpsertStoreCouponInput>>;
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
