import { Dispatch, SetStateAction } from "react";

type Params = {
  initialIds: string[];
  setInitialIds: Dispatch<SetStateAction<string[]>>;
  checkedIds: string[];
  setCheckedIds: Dispatch<SetStateAction<string[]>>;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  isSubmitting: boolean;
  setIsSubmitting: Dispatch<SetStateAction<boolean>>;
};

const store = (): Params => ({
  initialIds: [],
  setInitialIds: () => {},
  checkedIds: [],
  setCheckedIds: () => {},
  search: "",
  setSearch: () => {},
  isSubmitting: false,
  setIsSubmitting: () => {},
});

export { store as stateStore };
export type { Params as stateParams };
