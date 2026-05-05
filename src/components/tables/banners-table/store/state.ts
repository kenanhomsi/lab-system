import { BannerModalType } from "../types";

type Params = {
  pageNumber: number;
  setPageNumber: (value: number) => void;
  activeModal: BannerModalType;
  setActiveModal: (value: BannerModalType) => void;
};

const store = (): Params => ({
  pageNumber: 1,
  setPageNumber: () => {},
  activeModal: null,
  setActiveModal: () => {},
});

export { store as stateStore };
export type { Params as stateParams };
