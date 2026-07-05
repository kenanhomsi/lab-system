import type { AppointmentsPage } from "../types";

type Params = {
  appointmentsPage: AppointmentsPage;
};

const store = (): Params => ({
  appointmentsPage: {
    items: [],
    page: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },
});

export { store as utilsStore };
export type { Params as utilsParams };
