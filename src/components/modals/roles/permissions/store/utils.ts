import { PermissionCatalogItem } from "../types";

type Params = {
  filteredPermissions: PermissionCatalogItem[];
  toggle: (permissionId: string) => void;
  selectAll: () => void;
  clearAll: () => void;
  submit: () => Promise<void>;
  hasChanges: boolean;
};

const store = (): Params => ({
  filteredPermissions: [],
  toggle: () => {},
  selectAll: () => {},
  clearAll: () => {},
  submit: async () => {},
  hasChanges: false,
});

export { store as utilsStore };
export type { Params as utilsParams };
