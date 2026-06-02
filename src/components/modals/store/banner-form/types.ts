import type { StoreBanner } from "@/modules/store";
import type { UpsertStoreBannerInput } from "@/modules/store/abstraction/schemas";

type FactoryProps = {
  isOpen: boolean;
  onClose: () => void;
  banner: StoreBanner | null;
};

const initialValues: UpsertStoreBannerInput = {
  title: "",
  imageUrl: "",
  linkUrl: "",
  location: "",
  categoryId: 0,
  displayOrder: 0,
  isActive: true,
  startsAt: "",
  endsAt: "",
};

export type { FactoryProps };
export { initialValues };
