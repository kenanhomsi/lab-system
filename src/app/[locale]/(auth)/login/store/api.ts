type Params = {
  loading: boolean;
  preformLogin: () => Promise<unknown>;
};
const store = (): Params => ({
  loading: false,
  preformLogin: async () => {},
});
export { store as apiStore };
export type { Params as apiParams };
