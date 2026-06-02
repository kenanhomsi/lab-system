import type { Dispatch, SetStateAction } from "react";
import type { StoreCategory } from "@/modules/store";
import type { UpsertStoreBannerInput } from "@/modules/store/abstraction/schemas";
import { initialValues } from "../types";

type Params = {
  form: UpsertStoreBannerInput;
  setForm: Dispatch<SetStateAction<UpsertStoreBannerInput>>;
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
