import type { StoreProduct } from "@/modules/store";

type Params = {
  pageNumber: number;
  setPageNumber: (value: number) => void;
  activeModal: "create" | "edit" | "delete" | null;
  setActiveModal: (value: "create" | "edit" | "delete" | null) => void;
  selectedProduct: StoreProduct | null;
  setSelectedProduct: (value: StoreProduct | null) => void;
};

const store = (): Params => ({
  pageNumber: 1,
  setPageNumber: () => {},
  activeModal: null,
  setActiveModal: () => {},
  selectedProduct: null,
  setSelectedProduct: () => {},
});

export { store as stateStore };
export type { Params as stateParams };
