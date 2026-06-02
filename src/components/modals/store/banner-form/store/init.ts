import type { FactoryProps } from "../types";

type Params = FactoryProps;

const store = (): Params => ({
  isOpen: false,
  onClose: () => {},
  banner: null,
});

export { store as initStore };
export type { Params as initParams };
