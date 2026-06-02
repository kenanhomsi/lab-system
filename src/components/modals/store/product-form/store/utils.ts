import type { UpsertStoreProductInput } from "@/modules/store/abstraction/schemas";

type Params = {
  canSubmit: boolean;
  canAdvanceStep: boolean;
  handleClose: () => void;
  updateField: <K extends keyof UpsertStoreProductInput>(
    field: K,
    value: UpsertStoreProductInput[K],
  ) => void;
  submit: () => Promise<void>;
};

const store = (): Params => ({
  canSubmit: false,
  canAdvanceStep: false,
  handleClose: () => {},
  updateField: () => {},
  submit: async () => {},
});

export { store as utilsStore };
