import type { AdItem, AdModalType } from "../types";

type Params = {
  pageNumber: number;
  setPageNumber: (value: number) => void;
  activeModal: AdModalType;
  setActiveModal: (value: AdModalType) => void;
  selectedAd: AdItem | null;
  setSelectedAd: (value: AdItem | null) => void;
};

const store = (): Params => ({
  pageNumber: 1,
  setPageNumber: () => {},
  activeModal: null,
  setActiveModal: () => {},
  selectedAd: null,
  setSelectedAd: () => {},
});

export { store as stateStore };
export type { Params as stateParams };
