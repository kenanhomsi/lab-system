import { Dispatch, SetStateAction } from "react";

type Params = {
  rolesText: string;
  setRolesText: Dispatch<SetStateAction<string>>;
  isSubmitting: boolean;
  setIsSubmitting: Dispatch<SetStateAction<boolean>>;
};

const store = (): Params => ({
  rolesText: "",
  setRolesText: () => {},
  isSubmitting: false,
  setIsSubmitting: () => {},
});

export { store as stateStore };
export type { Params as stateParams };
