import { sideBarItem } from "../type";

type Params = {
  items: sideBarItem[];
  activeIndex: number;
  activeUtility: "light" | "dark";
  setActiveIndex: (index: number) => void;
  setActiveUtility: (mode: "light" | "dark") => void;
};

const store = (): Params => ({
  items: [],
  activeIndex: 0,
  activeUtility: "light",
  setActiveIndex: () => undefined,
  setActiveUtility: () => undefined,
});

export { store as initStore };
export type { Params as initParams };
