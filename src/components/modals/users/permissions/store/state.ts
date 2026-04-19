import { Dispatch, SetStateAction } from "react";

type Params = {
  permissionsText: string;
  setPermissionsText: Dispatch<SetStateAction<string>>;
  loadedPermissions: string[];
  setLoadedPermissions: Dispatch<SetStateAction<string[]>>;
  isSubmitting: boolean;
  setIsSubmitting: Dispatch<SetStateAction<boolean>>;
};

const store = (): Params => ({
  permissionsText: "",
  setPermissionsText: () => {},
  loadedPermissions: [],
  setLoadedPermissions: () => {},
  isSubmitting: false,
  setIsSubmitting: () => {},
});

export { store as stateStore };
export type { Params as stateParams };
