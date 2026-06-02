import type { Dispatch, SetStateAction } from "react";
import type { StoreCategory } from "@/modules/store";
import { initialValues } from "../types";
import type { UpsertStoreProductInput } from "@/modules/store/abstraction/schemas";

type Params = {
  form: UpsertStoreProductInput;
  setForm: Dispatch<SetStateAction<UpsertStoreProductInput>>;
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
