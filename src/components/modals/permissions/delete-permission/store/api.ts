type Params = {
  deletePermissionApi: (id: string) => Promise<unknown>;
  submit: () => Promise<void>;
};

const store = (): Params => ({
  deletePermissionApi: async () => null,
  submit: async () => {},
});

export { store as apiStore };
export type { Params as apiParams };
