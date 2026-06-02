import type { Dispatch, SetStateAction } from "react";
import type { StoreCategory } from "@/modules/store";
import { initialValues } from "../types";
import type { UpsertStoreCategoryInput } from "@/modules/store/abstraction/schemas";

type Params = {
  form: UpsertStoreCategoryInput;
  setForm: Dispatch<SetStateAction<UpsertStoreCategoryInput>>;
  isSubmitting: boolean;
  setIsSubmitting: Dispatch<SetStateAction<boolean>>;
  categories: StoreCategory[];
};

const store = (): Params => ({
  form: initialValues,
  setForm: () => {},
  isSubmitting: false,
  setIsSubmitting: () => {},
  categories: [],
});

export { store as stateStore };
export type { Params as stateParams };
