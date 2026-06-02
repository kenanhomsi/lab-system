import type { StoreBanner } from "@/modules/store";

type Params = {
  pageNumber: number;
  setPageNumber: (value: number) => void;
  activeModal: "create" | "edit" | null;
  setActiveModal: (value: "create" | "edit" | null) => void;
  selectedBanner: StoreBanner | null;
  setSelectedBanner: (value: StoreBanner | null) => void;
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
