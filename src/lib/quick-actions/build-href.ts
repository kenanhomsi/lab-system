import {
  QUICK_ACTION_OPEN_PARAM,
  QUICK_ACTION_TAB_PARAM,
} from "./constants";

type QuickActionHrefOptions = {
  modal?: string;
  tab?: string;
};

const buildQuickActionSearchParams = (
  options: QuickActionHrefOptions = {},
): URLSearchParams | null => {
  if (!options.modal) {
    return null;
  }

  const params = new URLSearchParams();
  params.set(QUICK_ACTION_OPEN_PARAM, options.modal);

  if (options.tab) {
    params.set(QUICK_ACTION_TAB_PARAM, options.tab);
  }

  return params;
};

const buildQuickActionHref = (
  href: string,
  options: QuickActionHrefOptions = {},
): string => {
  const params = buildQuickActionSearchParams(options);
  if (!params) {
    return href;
  }

  return `${href}?${params.toString()}`;
};

export { buildQuickActionHref, buildQuickActionSearchParams };
export type { QuickActionHrefOptions };
