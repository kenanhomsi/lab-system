import { Dispatch, SetStateAction } from "react";

type Params = {
  rolesText: string;
  setRolesText: Dispatch<SetStateAction<string>>;
  currentRoles: string[];
  setCurrentRoles: Dispatch<SetStateAction<string[]>>;
  isSubmitting: boolean;
  setIsSubmitting: Dispatch<SetStateAction<boolean>>;
};

const store = (): Params => ({
  rolesText: "",
  setRolesText: () => {},
  currentRoles: [],
  setCurrentRoles: () => {},
  isSubmitting: false,
  setIsSubmitting: () => {},
});

export { store as stateStore };
export type { Params as stateParams };
