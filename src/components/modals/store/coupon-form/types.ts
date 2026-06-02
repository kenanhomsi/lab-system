import type { StoreCoupon } from "@/modules/store";
import type { UpsertStoreCouponInput } from "@/modules/store/abstraction/schemas";

type FactoryProps = {
  isOpen: boolean;
  onClose: () => void;
  coupon: StoreCoupon | null;
};

const DISCOUNT_TYPES = ["Percentage", "Fixed"] as const;

const initialValues: UpsertStoreCouponInput = {
  code: "",
  discountType: "Percentage",
  amount: 0,
  minimumSubtotal: 0,
  maximumDiscountAmount: 0,
  startsAt: "",
  expiresAt: "",
  isActive: true,
};

export type { FactoryProps };
export { initialValues, DISCOUNT_TYPES };
