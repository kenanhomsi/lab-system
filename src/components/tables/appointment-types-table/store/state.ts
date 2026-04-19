import { AppointmentTypeItem, AppointmentTypeModalType } from "../types";

type Params = {
  pageNumber: number;
  setPageNumber: (value: number) => void;
  activeModal: AppointmentTypeModalType;
  setActiveModal: (value: AppointmentTypeModalType) => void;
  selectedType: AppointmentTypeItem | null;
  setSelectedType: (value: AppointmentTypeItem | null) => void;
};

const store = (): Params => ({
  pageNumber: 1,
  setPageNumber: () => {},
  activeModal: null,
  setActiveModal: () => {},
  selectedType: null,
  setSelectedType: () => {},
});

export { store as stateStore };
export type { Params as stateParams };
