type Params = {
  deleteRoleApi: (id: string) => Promise<unknown>;
  submit: () => Promise<void>;
};

const store = (): Params => ({
  deleteRoleApi: async () => null,
  submit: async () => {},
});

export { store as apiStore };
export type { Params as apiParams };
