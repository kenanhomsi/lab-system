import { FactoryProps } from "../types";

type Params = FactoryProps;

const store = (): Params => ({
  isOpen: false,
  onClose: () => {},
  appointmentType: null,
});

export { store as initStore };
export type { Params as initParams };
