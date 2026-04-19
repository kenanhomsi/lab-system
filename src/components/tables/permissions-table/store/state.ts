import { PermissionItem, PermissionModalType } from "../types";

type Params = {
  pageNumber: number;
  setPageNumber: (value: number) => void;
  activeModal: PermissionModalType;
  setActiveModal: (value: PermissionModalType) => void;
  selectedPermission: PermissionItem | null;
  setSelectedPermission: (value: PermissionItem | null) => void;
};

const store = (): Params => ({
  pageNumber: 1,
  setPageNumber: () => {},
  activeModal: null,
  setActiveModal: () => {},
  selectedPermission: null,
  setSelectedPermission: () => {},
});

export { store as stateStore };
export type { Params as stateParams };
