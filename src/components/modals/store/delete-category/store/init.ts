import type { FactoryProps } from "../types";

const store = (): FactoryProps => ({
  isOpen: false,
  onClose: () => {},
  category: null,
});

export { store as initStore };
