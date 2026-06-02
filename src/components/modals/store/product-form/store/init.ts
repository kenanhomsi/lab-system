import type { FactoryProps } from "../types";

const store = (): FactoryProps => ({
  isOpen: false,
  onClose: () => {},
  product: null,
});

export { store as initStore };
