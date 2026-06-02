import type { StoreCoupon } from "@/modules/store";

type Params = {
  couponsData: StoreCoupon[];
  isPending: boolean;
  refetchCoupons: () => void;
};

const store = (): Params => ({
  couponsData: [],
  isPending: false,
  refetchCoupons: () => {},
});

export { store as apiStore };
export type { Params as apiParams };
