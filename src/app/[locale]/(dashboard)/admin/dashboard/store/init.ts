import type { DashboardData } from "../type";
import type { SlideCardItem } from "@/types/slide-card";

type Params = {
  dashboard: DashboardData | null;
  slideCards: SlideCardItem[];
};

const store = (): Params => ({
  dashboard: null,
  slideCards: [],
});

export { store as initStore };
export type { Params as initParams };
