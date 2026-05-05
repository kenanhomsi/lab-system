type Params = {
  statusOptions: string[];
};

const store = (): Params => ({
  statusOptions: ["active", "inactive"],
});

export { store as utilsStore };
export type { Params as utilsParams };
