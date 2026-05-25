import { COMPLAINT_STATUSES, ComplaintStatus } from "@/lib/complaint-status";

type Params = {
  statusOptions: ComplaintStatus[];
};

const store = (): Params => ({
  statusOptions: [...COMPLAINT_STATUSES],
});

export { store as utilsStore };
export type { Params as utilsParams };
