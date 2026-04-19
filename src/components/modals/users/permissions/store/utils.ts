type Params = {
  parsePermissions: (value: string) => string[];
  assign: () => Promise<void>;
  replace: () => Promise<void>;
  removeOne: () => Promise<void>;
  loadPermissions: () => Promise<void>;
};

const store = (): Params => ({
  parsePermissions: () => [],
  assign: async () => {},
  replace: async () => {},
  removeOne: async () => {},
  loadPermissions: async () => {},
});

export { store as utilsStore };
export type { Params as utilsParams };
