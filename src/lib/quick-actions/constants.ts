const QUICK_ACTION_OPEN_PARAM = "open";
const QUICK_ACTION_TAB_PARAM = "tab";
const QUICK_ACTION_STORAGE_KEY = "dashboard:pending-quick-action";

type PendingQuickAction = {
  modal: string;
  tab?: string;
  /** When set (navbar quick actions), modal opens only on this path */
  targetPath?: string;
};

export {
  QUICK_ACTION_OPEN_PARAM,
  QUICK_ACTION_TAB_PARAM,
  QUICK_ACTION_STORAGE_KEY,
};
export type { PendingQuickAction };
