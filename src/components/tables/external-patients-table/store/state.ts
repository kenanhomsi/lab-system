import type { ExternalPatientRow } from "../types";

type Params = {
  pageNumber: number;
  setPageNumber: (value: number) => void;
  pageSize: number;
  setPageSize: (value: number) => void;
  searchValue: string;
  setSearchValue: (value: string) => void;
  debouncedValue: string;
  activeModal: "create" | "view" | "link" | null;
  setActiveModal: (value: "create" | "view" | "link" | null) => void;
  selectedPatient: ExternalPatientRow | null;
  setSelectedPatient: (value: ExternalPatientRow | null) => void;
};

const store = (): Params => ({
  pageNumber: 1,
  setPageNumber: () => {},
  pageSize: 20,
  setPageSize: () => {},
  searchValue: "",
  setSearchValue: () => {},
  debouncedValue: "",
  activeModal: null,
  setActiveModal: () => {},
  selectedPatient: null,
  setSelectedPatient: () => {},
});

export { store as stateStore };
export type { Params as stateParams };
