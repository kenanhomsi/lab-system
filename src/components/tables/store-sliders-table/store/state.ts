import type { StoreSlider } from "@/modules/store";

type Params = {
  pageNumber: number;
  setPageNumber: (value: number) => void;
  activeModal: "create" | "edit" | null;
  setActiveModal: (value: "create" | "edit" | null) => void;
  selectedSlider: StoreSlider | null;
  setSelectedSlider: (value: StoreSlider | null) => void;
};

const store = (): Params => ({
  pageNumber: 1,
  setPageNumber: () => {},
  activeModal: null,
  setActiveModal: () => {},
  selectedSlider: null,
  setSelectedSlider: () => {},
});

export { store as stateStore };
export type { Params as stateParams };
