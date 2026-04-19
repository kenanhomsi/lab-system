type Params = {
  activeTab: "profile" | "security" | "danger";
  setActiveTab: (tab: Params["activeTab"]) => void;
};

const stateStore = (): Params => ({
  activeTab: "profile",
  setActiveTab: () => {},
});

export { stateStore };
export type { Params as stateParams };

