import type { StoreCategory } from "@/modules/store";

type FactoryProps = {
  isOpen: boolean;
  onClose: () => void;
  category: StoreCategory | null;
};

export type { FactoryProps };
