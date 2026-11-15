import {
  AccessPolicyModalType,
  AccessPolicyTableItem,
  CreateAccessPolicyRequest,
} from "../types";

type Params = {
  pageNumber: number;
  setPageNumber: (value: number) => void;
  activeModal: AccessPolicyModalType;
  setActiveModal: (value: AccessPolicyModalType) => void;
  selectedPolicy: AccessPolicyTableItem | null;
  setSelectedPolicy: (value: AccessPolicyTableItem | null) => void;
  /** Optional prefill for the create modal (e.g. opened from a permissions-matrix cell). */
  createDraft: Partial<CreateAccessPolicyRequest> | null;
  setCreateDraft: (value: Partial<CreateAccessPolicyRequest> | null) => void;
};

const store = (): Params => ({
  pageNumber: 1,
  setPageNumber: () => {},
  activeModal: null,
  setActiveModal: () => {},
  selectedPolicy: null,
  setSelectedPolicy: () => {},
  createDraft: null,
  setCreateDraft: () => {},
});

export { store as stateStore };
export type { Params as stateParams };
