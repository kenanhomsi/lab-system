import type { UpsertStoreBannerInput } from "@/modules/store/abstraction/schemas";

type Params = {
  canSubmit: boolean;
  handleClose: () => void;
  updateField: <K extends keyof UpsertStoreBannerInput>(
    field: K,
    value: UpsertStoreBannerInput[K],
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
