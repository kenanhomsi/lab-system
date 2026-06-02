"use client";

import type { EmploymentApplicationStatus } from "../types";

type Params = {
  pageNumber: number;
  setPageNumber: (value: number) => void;
  searchValue: string;
  setSearchValue: (value: string) => void;
  debouncedValue: string;
  statusFilter: "all" | EmploymentApplicationStatus;
  setStatusFilter: (value: "all" | EmploymentApplicationStatus) => void;
  statusUpdateTargetId: number | null;
  setStatusUpdateTargetId: (value: number | null) => void;
  statusUpdateIntent: EmploymentApplicationStatus | null;
  setStatusUpdateIntent: (value: EmploymentApplicationStatus | null) => void;
};

const store = (): Params => ({
  pageNumber: 1,
  setPageNumber: () => {},
  searchValue: "",
  setSearchValue: () => {},
  debouncedValue: "",
  statusFilter: "all",
  setStatusFilter: () => {},
  statusUpdateTargetId: null,
  setStatusUpdateTargetId: () => {},
  statusUpdateIntent: null,
  setStatusUpdateIntent: () => {},
});

export { store as stateStore };
export type { Params as stateParams };
