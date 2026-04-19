import {
  SubscriptionPackageItem,
  TargetAudience,
} from "@/components/tables/subscription-packages-table/types";

type FactoryProps = {
  isOpen: boolean;
  onClose: () => void;
  subscriptionPackage: SubscriptionPackageItem | null;
};

type FormState = {
  name: string;
  price: number;
  validityDays: number;
  includedTests: string;
  targetAudience: TargetAudience;
  isActive: boolean;
};

const defaultForm: FormState = {
  name: "",
  price: 0,
  validityDays: 0,
  includedTests: "",
  targetAudience: "All",
  isActive: true,
};

export type { FactoryProps, FormState };
export { defaultForm };
