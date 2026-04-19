import { UserItem, UserModalType } from "../types";

type Params = {
  pageNumber: number;
  setPageNumber: (value: number) => void;
  searchValue: string;
  setSearchValue: (value: string) => void;
  debouncedValue: string;
  roleFilter: string;
  setRoleFilter: (value: string) => void;
  isActiveFilter: "all" | "active" | "inactive";
  setIsActiveFilter: (value: "all" | "active" | "inactive") => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  sortDesc: boolean;
  setSortDesc: (value: boolean) => void;
  activeModal: UserModalType | null;
  setActiveModal: (value: UserModalType | null) => void;
  selectedUser: UserItem | null;
  setSelectedUser: (value: UserItem | null) => void;
};

const store = (): Params => ({
  pageNumber: 1,
  setPageNumber: () => {},
  searchValue: "",
  setSearchValue: () => {},
  debouncedValue: "",
  roleFilter: "",
  setRoleFilter: () => {},
  isActiveFilter: "all",
  setIsActiveFilter: () => {},
  sortBy: "createdAt",
  setSortBy: () => {},
  sortDesc: true,
  setSortDesc: () => {},
  activeModal: null,
  setActiveModal: () => {},
  selectedUser: null,
  setSelectedUser: () => {},
});

export { store as stateStore };
export type { Params as stateParams };
