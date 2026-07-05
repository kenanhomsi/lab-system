import type { Appointment } from "@/modules/appointments";
import { TestRequestItem } from "../types";

export type TestRequestModalType =
  | "create"
  | "edit"
  | "delete"
  | "appointment"
  | "detail"
  | null;

export type AppointmentInlineModalType = "edit" | "cancel" | null;

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
  activeModal: TestRequestModalType;
  setActiveModal: (value: TestRequestModalType) => void;
  selectedTestRequest: TestRequestItem | null;
  setSelectedTestRequest: (value: TestRequestItem | null) => void;
  expandedRows: number[];
  setExpandedRows: (value: number[] | ((current: number[]) => number[])) => void;
  toggleExpandedRow: (id: number) => void;
  appointmentActiveModal: AppointmentInlineModalType;
  setAppointmentActiveModal: (value: AppointmentInlineModalType) => void;
  selectedAppointment: Appointment | null;
  setSelectedAppointment: (value: Appointment | null) => void;
};

const store = (): Params => ({
  pageNumber: 1,
  setPageNumber: () => {},
  pageSize: 100,
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
  expandedRows: [],
  setExpandedRows: () => {},
  toggleExpandedRow: () => {},
  appointmentActiveModal: null,
  setAppointmentActiveModal: () => {},
  selectedAppointment: null,
  setSelectedAppointment: () => {},
});

export { store as stateStore };
export type { Params as stateParams };
