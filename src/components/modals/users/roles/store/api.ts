type Params = {
  assignRolesApi: (params: { id: string; roles: string[] }) => Promise<unknown>;
  removeRolesApi: (params: { id: string; roles: string[] }) => Promise<unknown>;
};

const store = (): Params => ({
  assignRolesApi: async () => null,
  removeRolesApi: async () => null,
});

export { store as apiStore };
export type { Params as apiParams };
