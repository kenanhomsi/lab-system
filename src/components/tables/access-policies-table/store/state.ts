import { AccessPolicyModalType, AccessPolicyTableItem } from "../types";

type Params = {
  pageNumber: number;
  setPageNumber: (value: number) => void;
  activeModal: AccessPolicyModalType;
  setActiveModal: (value: AccessPolicyModalType) => void;
  selectedPolicy: AccessPolicyTableItem | null;
  setSelectedPolicy: (value: AccessPolicyTableItem | null) => void;
};

const store = (): Params => ({
  pageNumber: 1,
  setPageNumber: () => {},
  activeModal: null,
  setActiveModal: () => {},
  selectedPolicy: null,
  setSelectedPolicy: () => {},
});

export { store as stateStore };
export type { Params as stateParams };
