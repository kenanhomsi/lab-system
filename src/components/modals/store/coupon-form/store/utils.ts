import type { UpsertStoreCouponInput } from "@/modules/store/abstraction/schemas";

type Params = {
  canSubmit: boolean;
  handleClose: () => void;
  updateField: <K extends keyof UpsertStoreCouponInput>(
    field: K,
    value: UpsertStoreCouponInput[K],
  ) => void;
  submit: () => Promise<void>;
};

const store = (): Params => ({
  canSubmit: false,
  handleClose: () => {},
  updateField: () => {},
  submit: async () => {},
});

export { store as utilsStore };
export type { Params as utilsParams };
