import { TestRequestItem } from "../types";

type Params = {
  pageNumber: number;
  setPageNumber: (value: number) => void;
  pageSize: number;
  setPageSize: (value: number) => void;
  searchValue: string;
  setSearchValue: (value: string) => void;
  debouncedValue: string;
  sortBy: string;
  setSortBy: (value: string) => void;
  sortDesc: boolean;
  setSortDesc: (value: boolean) => void;
  activeModal: "create" | "edit" | "delete" | null;
  setActiveModal: (value: "create" | "edit" | "delete" | null) => void;
  selectedTestRequest: TestRequestItem | null;
  setSelectedTestRequest: (value: TestRequestItem | null) => void;
};

const store = (): Params => ({
  pageNumber: 1,
  setPageNumber: () => {},
  pageSize: 20,
  setPageSize: () => {},
  searchValue: "",
  setSearchValue: () => {},
  debouncedValue: "",
  sortBy: "createdAt",
  setSortBy: () => {},
  sortDesc: true,
  setSortDesc: () => {},
  activeModal: null,
  setActiveModal: () => {},
  selectedTestRequest: null,
  setSelectedTestRequest: () => {},
});

export { store as stateStore };
export type { Params as stateParams };
