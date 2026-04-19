import { Dispatch, SetStateAction } from "react";

type Params = {
  name: string;
  setName: Dispatch<SetStateAction<string>>;
  isSubmitting: boolean;
  setIsSubmitting: Dispatch<SetStateAction<boolean>>;
};

const store = (): Params => ({
  name: "",
  setName: () => {},
  isSubmitting: false,
  setIsSubmitting: () => {},
});

export { store as stateStore };
export type { Params as stateParams };
