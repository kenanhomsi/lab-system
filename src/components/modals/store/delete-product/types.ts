import type { StoreProduct } from "@/modules/store";

type FactoryProps = {
  isOpen: boolean;
  onClose: () => void;
  product: StoreProduct | null;
};

export type { FactoryProps };
