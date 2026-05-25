import {
  QUICK_ACTION_STORAGE_KEY,
  type PendingQuickAction,
} from "./constants";

const readPendingQuickAction = (): PendingQuickAction | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.sessionStorage.getItem(QUICK_ACTION_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as PendingQuickAction;
  } catch {
    return { modal: raw };
  }
};

const writePendingQuickAction = (payload: PendingQuickAction) => {
  window.sessionStorage.setItem(QUICK_ACTION_STORAGE_KEY, JSON.stringify(payload));
};

const clearPendingQuickAction = () => {
  window.sessionStorage.removeItem(QUICK_ACTION_STORAGE_KEY);
};

export { readPendingQuickAction, writePendingQuickAction, clearPendingQuickAction };
