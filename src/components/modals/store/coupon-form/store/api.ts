import type { UpsertStoreCouponInput } from "@/modules/store/abstraction/schemas";

type Params = {
  createCoupon: (data: UpsertStoreCouponInput) => Promise<unknown>;
  updateCoupon: (params: { id: number; data: UpsertStoreCouponInput }) => Promise<unknown>;
};

const store = (): Params => ({
  createCoupon: async () => {},
  updateCoupon: async () => {},
});

export { store as apiStore };
export type { Params as apiParams };
