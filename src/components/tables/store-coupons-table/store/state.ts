import type { StoreCoupon } from "@/modules/store";

type Params = {
  pageNumber: number;
  setPageNumber: (value: number) => void;
  activeModal: "create" | "edit" | null;
  setActiveModal: (value: "create" | "edit" | null) => void;
  selectedCoupon: StoreCoupon | null;
  setSelectedCoupon: (value: StoreCoupon | null) => void;
};

const store = (): Params => ({
  pageNumber: 1,
  setPageNumber: () => {},
  activeModal: null,
  setActiveModal: () => {},
  selectedCoupon: null,
  setSelectedCoupon: () => {},
});

export { store as stateStore };
export type { Params as stateParams };
