type Params = {
  submitDelete: (id: string) => Promise<unknown>;
  submit: () => Promise<void>;
};

const store = (): Params => ({
  submitDelete: async () => null,
  submit: async () => {},
});

export { store as apiStore };
export type { Params as apiParams };
