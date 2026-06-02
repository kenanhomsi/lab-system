import type { StoreCategory } from "@/modules/store";

type Params = {
  pageNumber: number;
  setPageNumber: (value: number) => void;
  activeModal: "create" | "edit" | "delete" | null;
  setActiveModal: (value: "create" | "edit" | "delete" | null) => void;
  selectedCategory: StoreCategory | null;
  setSelectedCategory: (value: StoreCategory | null) => void;
};

const store = (): Params => ({
  pageNumber: 1,
  setPageNumber: () => {},
  activeModal: null,
  setActiveModal: () => {},
  selectedCategory: null,
  setSelectedCategory: () => {},
});

export { store as stateStore };
export type { Params as stateParams };
