import type { StoreProduct } from "@/modules/store";
import type { UpsertStoreProductInput } from "@/modules/store/abstraction/schemas";

type FactoryProps = {
  isOpen: boolean;
  onClose: () => void;
  product: StoreProduct | null;
};

const initialValues: UpsertStoreProductInput = {
  categoryId: 0,
  nameAr: "",
  nameEn: "",
  description: "",
  imageUrl: "",
  saleUnit: "",
  price: 0,
  discountPrice: 0,
  topBadge: "",
  displayOrder: 0,
  isRecommended: false,
  isBestSeller: false,
  isActive: true,
};

export type { FactoryProps };
export { initialValues };
