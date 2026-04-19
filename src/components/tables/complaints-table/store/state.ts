import { ComplaintItem, ComplaintStatus } from "../types";

type Params = {
  pageNumber: number;
  setPageNumber: (value: number) => void;
  searchValue: string;
  setSearchValue: (value: string) => void;
  debouncedValue: string;
  statusFilter: "all" | ComplaintStatus;
  setStatusFilter: (value: "all" | ComplaintStatus) => void;
  userIdFilter: string;
  setUserIdFilter: (value: string) => void;
  selectedComplaint: ComplaintItem | null;
  setSelectedComplaint: (value: ComplaintItem | null) => void;
};

const store = (): Params => ({
  pageNumber: 1,
  setPageNumber: () => {},
  searchValue: "",
  setSearchValue: () => {},
  debouncedValue: "",
  statusFilter: "all",
  setStatusFilter: () => {},
  userIdFilter: "",
  setUserIdFilter: () => {},
  selectedComplaint: null,
  setSelectedComplaint: () => {},
});

export { store as stateStore };
export type { Params as stateParams };
