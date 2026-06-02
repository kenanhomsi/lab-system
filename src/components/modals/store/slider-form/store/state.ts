import type { Dispatch, SetStateAction } from "react";
import type { StoreProduct } from "@/modules/store";
import type { UpsertStoreSliderInput } from "@/modules/store/abstraction/schemas";
import { initialValues } from "../types";

type Params = {
  form: UpsertStoreSliderInput;
  setForm: Dispatch<SetStateAction<UpsertStoreSliderInput>>;
  isSubmitting: boolean;
  setIsSubmitting: Dispatch<SetStateAction<boolean>>;
  productsData: StoreProduct[];
  isProductsPending: boolean;
};

const store = (): Params => ({
  form: initialValues,
  setForm: () => {},
  isSubmitting: false,
  setIsSubmitting: () => {},
  productsData: [],
  isProductsPending: false,
});

export { store as stateStore };
export type { Params as stateParams };
