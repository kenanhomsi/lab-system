import type { StoreCategory } from "@/modules/store";
import type { UpsertStoreCategoryInput } from "@/modules/store/abstraction/schemas";

type FactoryProps = {
  isOpen: boolean;
  onClose: () => void;
  category: StoreCategory | null;
};

const initialValues: UpsertStoreCategoryInput = {
  nameAr: "",
  nameEn: "",
  description: "",
  imageUrl: "",
  parentCategoryId: null,
  displayOrder: 0,
  isActive: true,
};

export type { FactoryProps };
export { initialValues };
