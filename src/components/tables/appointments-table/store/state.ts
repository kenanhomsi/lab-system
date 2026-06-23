import type { AppointmentModalType } from "../types";
import type { AppointmentRow } from "../types";

type Params = {
  pageNumber: number;
  setPageNumber: (value: number) => void;
  searchValue: string;
  setSearchValue: (value: string) => void;
  debouncedValue: string;
  statusFilter: "all" | string;
  setStatusFilter: (value: "all" | string) => void;
  activeModal: AppointmentModalType;
  setActiveModal: (value: AppointmentModalType) => void;
  selectedAppointment: AppointmentRow | null;
  setSelectedAppointment: (value: AppointmentRow | null) => void;
};

const store = (): Params => ({
  pageNumber: 1,
  setPageNumber: () => {},
  searchValue: "",
  setSearchValue: () => {},
  debouncedValue: "",
  statusFilter: "all",
  setStatusFilter: () => {},
  activeModal: null,
  setActiveModal: () => {},
  selectedAppointment: null,
  setSelectedAppointment: () => {},
});

export { store as stateStore };
export type { Params as stateParams };
