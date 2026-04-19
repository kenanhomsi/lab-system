type Params = {
  parseRoles: (value: string) => string[];
  assign: () => Promise<void>;
  remove: () => Promise<void>;
};

const store = (): Params => ({
  parseRoles: () => [],
  assign: async () => {},
  remove: async () => {},
});

export { store as utilsStore };
export type { Params as utilsParams };
