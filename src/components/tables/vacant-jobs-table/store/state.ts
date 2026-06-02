import { VacantJobItem } from "../types";

type Params = {
  pageNumber: number;
  setPageNumber: (value: number) => void;
  pageSize: number;
  setPageSize: (value: number) => void;
  activeModal: "create" | "edit" | "delete" | null;
  setActiveModal: (value: "create" | "edit" | "delete" | null) => void;
  selectedVacantJob: VacantJobItem | null;
  setSelectedVacantJob: (value: VacantJobItem | null) => void;
};

const store = (): Params => ({
  pageNumber: 1,
  setPageNumber: () => {},
  pageSize: 20,
  setPageSize: () => {},
  activeModal: null,
  setActiveModal: () => {},
  selectedVacantJob: null,
  setSelectedVacantJob: () => {},
});

export { store as stateStore };
export type { Params as stateParams };
