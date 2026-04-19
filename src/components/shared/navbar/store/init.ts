import { navbarConfig } from "../type";

type Params = {
  config: navbarConfig;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onLogout: () => Promise<void>;
};

const store = (): Params => ({
  config: {
    searchPlaceholder: "",
    actions: [],
    profile: {
      name: "",
      roleTitle: "",
    },
    profileMenu: [],
  },
  searchQuery: "",
  setSearchQuery: () => undefined,
  onLogout: async () => undefined,
});

export { store as initStore };
export type { Params as initParams };
