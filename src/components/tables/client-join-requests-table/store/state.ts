import type { ClientJoinRequestItem, ClientJoinRequestStatus } from "../types";

type Params = {
  pageNumber: number;
  setPageNumber: (value: number) => void;
  searchValue: string;
  setSearchValue: (value: string) => void;
  debouncedValue: string;
  statusFilter: "all" | ClientJoinRequestStatus;
  setStatusFilter: (value: "all" | ClientJoinRequestStatus) => void;
  selectedRequest: ClientJoinRequestItem | null;
  setSelectedRequest: (value: ClientJoinRequestItem | null) => void;
  isDetailModalOpen: boolean;
  setIsDetailModalOpen: (value: boolean) => void;
  statusUpdateTargetId: number | null;
  setStatusUpdateTargetId: (value: number | null) => void;
  deleteTargetId: number | null;
  setDeleteTargetId: (value: number | null) => void;
};

const store = (): Params => ({
  pageNumber: 1,
  setPageNumber: () => {},
  searchValue: "",
  setSearchValue: () => {},
  debouncedValue: "",
  statusFilter: "all",
  setStatusFilter: () => {},
  selectedRequest: null,
  setSelectedRequest: () => {},
  isDetailModalOpen: false,
  setIsDetailModalOpen: () => {},
  statusUpdateTargetId: null,
  setStatusUpdateTargetId: () => {},
  deleteTargetId: null,
  setDeleteTargetId: () => {},
});

export { store as stateStore };
export type { Params as stateParams };
