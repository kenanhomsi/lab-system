const profileTabs = [
  "profile",
  "security",
  "danger",
  "testRequests",
  "testResults",
  "insuranceApprovals",
] as const;

type ProfileTab = (typeof profileTabs)[number];

type Params = {
  activeTab: ProfileTab;
  setActiveTab: (tab: Params["activeTab"]) => void;
};

const stateStore = (): Params => ({
  activeTab: "profile",
  setActiveTab: () => {},
});

/** Safely resolves a profile tab from an unknown value. */
const parseProfileTab = (value: unknown): ProfileTab => {
  if (typeof value !== "string") return "profile";
  return profileTabs.includes(value as ProfileTab) ? (value as ProfileTab) : "profile";
};

export { stateStore };
export { parseProfileTab };
export type { Params as stateParams };
export type { ProfileTab };
