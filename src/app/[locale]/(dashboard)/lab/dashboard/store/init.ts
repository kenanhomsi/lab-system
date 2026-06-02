import type { DashboardData } from "../type";

type Params = {
  dashboard: DashboardData | null;
};

const store = (): Params => ({
  dashboard: null,
});

export { store as initStore };
export type { Params as initParams };
