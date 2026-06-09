type ProfileTab =
  | "profile"
  | "security"
  | "danger"
  | "testRequests"
  | "testResults"
  | "insuranceApprovals";

type Params = {
  activeTab: ProfileTab;
  setActiveTab: (tab: Params["activeTab"]) => void;
};

const stateStore = (): Params => ({
  activeTab: "profile",
  setActiveTab: () => {},
});

export { stateStore };
export type { Params as stateParams };
export type { ProfileTab };
