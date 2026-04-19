import {
  UsersResponse,
} from "../types";

type Params = {
  usersData: UsersResponse;
  isPending: boolean;
  refetchUsers: () => void;
  activateUser: (id: string) => Promise<unknown>;
  deactivateUser: (id: string) => Promise<unknown>;
};

const store = (): Params => ({
  usersData: {
    items: [],
    page: 1,
    pageSize: 20,
    totalCount: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },
  isPending: false,
  refetchUsers: () => {},
  activateUser: async () => null,
  deactivateUser: async () => null,
});

export { store as apiStore };
export type { Params as apiParams };
