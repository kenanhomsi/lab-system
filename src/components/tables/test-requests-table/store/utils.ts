type Params = {
  statusOptions: string[];
};

const store = (): Params => ({
  statusOptions: ["pending", "completed", "cancelled"],
});

export { store as utilsStore };
export type { Params as utilsParams };
