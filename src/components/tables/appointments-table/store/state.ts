import { AppointmentItem, AppointmentModalType } from "../types";

type Params = {
  pageNumber: number;
  setPageNumber: (value: number) => void;
  searchValue: string;
  setSearchValue: (value: string) => void;
  debouncedValue: string;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  patientIdFilter: string;
  setPatientIdFilter: (value: string) => void;
  doctorIdFilter: string;
  setDoctorIdFilter: (value: string) => void;
  labPartnerIdFilter: string;
  setLabPartnerIdFilter: (value: string) => void;
  activeModal: AppointmentModalType | null;
  setActiveModal: (value: AppointmentModalType | null) => void;
  selectedAppointment: AppointmentItem | null;
  setSelectedAppointment: (value: AppointmentItem | null) => void;
};

const store = (): Params => ({
  pageNumber: 1,
  setPageNumber: () => {},
  searchValue: "",
  setSearchValue: () => {},
  debouncedValue: "",
  statusFilter: "",
  setStatusFilter: () => {},
  patientIdFilter: "",
  setPatientIdFilter: () => {},
  doctorIdFilter: "",
  setDoctorIdFilter: () => {},
  labPartnerIdFilter: "",
  setLabPartnerIdFilter: () => {},
  activeModal: null,
  setActiveModal: () => {},
  selectedAppointment: null,
  setSelectedAppointment: () => {},
});

export { store as stateStore };
export type { Params as StateParams };
