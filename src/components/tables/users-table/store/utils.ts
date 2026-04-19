type Params = {
  rolesOptions: string[];
};

const store = (): Params => ({
  rolesOptions: ["admin", "doctor", "patient", "lab"],
});

export { store as utilsStore };
export type { Params as utilsParams };
