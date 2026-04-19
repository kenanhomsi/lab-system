import { BannerItem, BannerModalType } from "../types";

type Params = {
  pageNumber: number;
  setPageNumber: (value: number) => void;
  activeModal: BannerModalType;
  setActiveModal: (value: BannerModalType) => void;
  selectedBanner: BannerItem | null;
  setSelectedBanner: (value: BannerItem | null) => void;
};

const store = (): Params => ({
  pageNumber: 1,
  setPageNumber: () => {},
  activeModal: null,
  setActiveModal: () => {},
  selectedBanner: null,
  setSelectedBanner: () => {},
});

export { store as stateStore };
export type { Params as stateParams };
