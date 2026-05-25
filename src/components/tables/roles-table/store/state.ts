import { RoleModalType, RoleTableItem } from "../types";

type Params = {
  pageNumber: number;
  setPageNumber: (value: number) => void;
  activeModal: RoleModalType;
  setActiveModal: (value: RoleModalType) => void;
  selectedRole: RoleTableItem | null;
  setSelectedRole: (value: RoleTableItem | null) => void;
};

const store = (): Params => ({
  pageNumber: 1,
  setPageNumber: () => {},
  activeModal: null,
  setActiveModal: () => {},
  selectedRole: null,
  setSelectedRole: () => {},
});

export { store as stateStore };
export type { Params as stateParams };
