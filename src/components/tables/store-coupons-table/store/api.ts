import type { StoreCoupon } from "@/modules/store";
import type { UpsertStoreCouponInput } from "@/modules/store/abstraction/schemas";

type Params = {
  couponsData: StoreCoupon[];
  isPending: boolean;
  refetchCoupons: () => void;
  createMutation: { mutateAsync: (data: UpsertStoreCouponInput) => Promise<unknown> };
  updateMutation: {
    mutateAsync: (params: { id: number; data: UpsertStoreCouponInput }) => Promise<unknown>;
  };
};

const store = (): Params => ({
  couponsData: [],
  isPending: false,
  refetchCoupons: () => {},
  createMutation: { mutateAsync: async () => {} },
  updateMutation: { mutateAsync: async () => {} },
});

export { store as apiStore };
export type { Params as apiParams };
