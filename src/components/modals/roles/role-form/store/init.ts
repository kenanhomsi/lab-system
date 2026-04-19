import { FactoryProps } from "../types";

type Params = FactoryProps;

const store = (): Params => ({
  isOpen: false,
  onClose: () => {},
  role: null,
});

export { store as initStore };
export type { Params as initParams };
