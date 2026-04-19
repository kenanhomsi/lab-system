type Params = {
  statusOptions: string[];
};

const store = (): Params => ({
  statusOptions: ["pending", "confirmed", "in_progress", "completed", "cancelled"],
});

export { store as utilsStore };
export type { Params as UtilsParams };
