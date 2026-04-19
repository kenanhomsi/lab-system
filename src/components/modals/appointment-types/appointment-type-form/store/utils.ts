type Params = {
  canSubmit: boolean;
  handleClose: () => void;
  submit: () => Promise<void>;
};

const store = (): Params => ({
  canSubmit: false,
  handleClose: () => {},
  submit: async () => {},
});

export { store as utilsStore };
export type { Params as utilsParams };
