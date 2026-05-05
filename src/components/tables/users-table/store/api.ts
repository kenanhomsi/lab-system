import { UsersResponse } from "../types";

type Params = {
  usersData: UsersResponse;
  userPermissions: string[];
  userPermissionsPending: boolean;
  isPending: boolean;
  refetchUsers: () => void;
  activateUser: (id: string) => Promise<unknown>;
  deactivateUser: (id: string) => Promise<unknown>;
  deleteUser: (id: string) => Promise<unknown>;
};

const store = (): Params => ({
  userPermissions: [],
  userPermissionsPending: false,
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
  deleteUser: async () => null,
});

export { store as apiStore };
export type { Params as apiParams };
