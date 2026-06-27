import type { MedicalTestCategory } from "@/modules/medical-test-categories";

type Params = {
  pageNumber: number;
  setPageNumber: (value: number) => void;
  selectedCategory: MedicalTestCategory | null;
  setSelectedCategory: (value: MedicalTestCategory | null) => void;
  activeModal: null | "create" | "edit" | "delete";
  setActiveModal: (value: null | "create" | "edit" | "delete") => void;
};

const store = (): Params => ({
  pageNumber: 1,
  setPageNumber: () => {},
  selectedCategory: null,
  setSelectedCategory: () => {},
  activeModal: null,
  setActiveModal: () => {},
});

export { store as stateStore };
export type { Params as stateParams };
