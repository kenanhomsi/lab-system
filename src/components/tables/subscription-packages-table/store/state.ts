import {
  SubscriptionPackageItem,
  SubscriptionPackageModalType,
  TargetAudience,
} from "../types";

type Params = {
  pageNumber: number;
  setPageNumber: (value: number) => void;
  targetAudienceFilter: TargetAudience | "all";
  setTargetAudienceFilter: (value: TargetAudience | "all") => void;
  isActiveFilter: "all" | "active" | "inactive";
  setIsActiveFilter: (value: "all" | "active" | "inactive") => void;
  activeModal: SubscriptionPackageModalType | null;
  setActiveModal: (value: SubscriptionPackageModalType | null) => void;
  selectedPackage: SubscriptionPackageItem | null;
  setSelectedPackage: (value: SubscriptionPackageItem | null) => void;
};

const store = (): Params => ({
  pageNumber: 1,
  setPageNumber: () => {},
  targetAudienceFilter: "all",
  setTargetAudienceFilter: () => {},
  isActiveFilter: "all",
  setIsActiveFilter: () => {},
  activeModal: null,
  setActiveModal: () => {},
  selectedPackage: null,
  setSelectedPackage: () => {},
});

export { store as stateStore };
export type { Params as stateParams };
