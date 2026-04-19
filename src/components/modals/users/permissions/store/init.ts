import { FactoryProps } from "../types";

type Params = FactoryProps;

const store = (): Params => ({
  isOpen: false,
  onClose: () => {},
  user: null,
});

export { store as initStore };
export type { Params as initParams };
