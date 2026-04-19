import { ComplaintStatus } from "../types";

type Params = {
  statusOptions: ComplaintStatus[];
};

const store = (): Params => ({
  statusOptions: ["received", "in_progress", "resolved"],
});

export { store as utilsStore };
export type { Params as utilsParams };
