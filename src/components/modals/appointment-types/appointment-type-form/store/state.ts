import { Dispatch, SetStateAction } from "react";

type Params = {
  name: string;
  setName: Dispatch<SetStateAction<string>>;
  isActive: boolean;
  setIsActive: Dispatch<SetStateAction<boolean>>;
  isSubmitting: boolean;
  setIsSubmitting: Dispatch<SetStateAction<boolean>>;
};

const store = (): Params => ({
  name: "",
  setName: () => {},
  isActive: true,
  setIsActive: () => {},
  isSubmitting: false,
  setIsSubmitting: () => {},
});

export { store as stateStore };
export type { Params as stateParams };
