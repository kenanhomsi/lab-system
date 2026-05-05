import { Dispatch, SetStateAction } from "react";

type Params = {
  checkedPermissions: string[];
  setCheckedPermissions: Dispatch<SetStateAction<string[]>>;
  permissionsText: string;
  setPermissionsText: Dispatch<SetStateAction<string>>;
  loadedPermissions: string[];
  setLoadedPermissions: Dispatch<SetStateAction<string[]>>;
  isSubmitting: boolean;
  setIsSubmitting: Dispatch<SetStateAction<boolean>>;
};

const store = (): Params => ({
  checkedPermissions: [],
  setCheckedPermissions: () => {},
  permissionsText: "",
  setPermissionsText: () => {},
  loadedPermissions: [],
  setLoadedPermissions: () => {},
  isSubmitting: false,
  setIsSubmitting: () => {},
});

export { store as stateStore };
export type { Params as stateParams };
