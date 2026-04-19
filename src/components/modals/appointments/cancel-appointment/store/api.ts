type Params = {
  submit: () => Promise<void>;
};

const store = (): Params => ({
  submit: async () => {},
});

export { store as apiStore };
