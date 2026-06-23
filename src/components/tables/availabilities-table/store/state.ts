import type { AvailabilityModalType } from "../types";
import type { AvailabilityRow } from "../types";

type Params = {
  pageNumber: number;
  setPageNumber: (value: number) => void;
  activeModal: AvailabilityModalType;
  setActiveModal: (value: AvailabilityModalType) => void;
  selectedAvailability: AvailabilityRow | null;
  setSelectedAvailability: (value: AvailabilityRow | null) => void;
};

const store = (): Params => ({
  pageNumber: 1,
  setPageNumber: () => {},
  activeModal: null,
  setActiveModal: () => {},
  selectedAvailability: null,
  setSelectedAvailability: () => {},
});

export { store as stateStore };
export type { Params as stateParams };
