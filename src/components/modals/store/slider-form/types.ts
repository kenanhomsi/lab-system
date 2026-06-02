import type { StoreSlider } from "@/modules/store";
import type { UpsertStoreSliderInput } from "@/modules/store/abstraction/schemas";

type FactoryProps = {
  isOpen: boolean;
  onClose: () => void;
  slider: StoreSlider | null;
};

const SLIDER_TYPES = ["Custom", "Featured", "BestSeller"] as const;

const initialValues: UpsertStoreSliderInput = {
  title: "",
  type: "Custom",
  displayOrder: 0,
  isActive: true,
  productIds: [],
};

export type { FactoryProps };
export { initialValues, SLIDER_TYPES };
