const SHARED_MESSAGE_KEYS = [
  "common",
  "navbar",
  "sidebar",
  "bottomNav",
  "errors",
  "auth",
  "nav",
  "header",
  "footer",
  "about",
] as const;

const DASHBOARD_MESSAGE_KEYS = [
  "admin",
  "patient",
  "doctor",
  "lab",
  "dashboard",
  "pushNotifications",
  "notificationsPage",
  "adminNotifications",
  "chatPage",
  "myComplaints",
  "myInsuranceApproval",
  "externalPatients",
  "subscriptions",
  "labStore",
  "specialPages",
  "doctorPages",
  "labPages",
  "appointmentsFeature",
] as const;

const HOMEPAGE_MESSAGE_KEYS = [
  "nav",
  "header",
  "footer",
  "landing",
  "contactPage",
  "admin",
] as const;

const WEBSITE_MESSAGE_KEYS = [
  "nav",
  "header",
  "footer",
  "blog",
  "landing",
  "about",
  "aboutPage",
  "servicesPage",
  "contactPage",
  "qualityPage",
  "tests",
  "encyclopedia",
  "offers",
  "careers",
  "joinClient",
  "contactUs",
  "complaintPage",
  "booking",
  "results",
  "priceCalc",
  "insurance",
  "tracking",
  "testDetails",
  "labEncyclopedia",
  "labEncyclopediaDetail",
  "offerDetails",
  "joinAsClient",
  "contractServiceRequest",
  "complaint",
  "priceCalculator",
  "patientWebsite",
  "admin",
] as const;

type MessageRecord = Record<string, unknown>;

function pickMessageKeys(
  messages: MessageRecord,
  keys: readonly string[],
): MessageRecord {
  return Object.fromEntries(
    keys.filter((key) => key in messages).map((key) => [key, messages[key]]),
  );
}

function isDashboardPath(pathname: string): boolean {
  const normalized = pathname.replace(/^\/(en|ar)/, "");
  return /^\/(admin|doctor|patient|lab|secretary|special)(\/|$)/.test(
    normalized,
  );
}

function isAuthPath(pathname: string): boolean {
  const normalized = pathname.replace(/^\/(en|ar)/, "");
  return /^\/(login|register|forgot-password|reset-password)(\/|$)/.test(
    normalized,
  );
}

function isHomepagePath(pathname: string): boolean {
  const normalized = pathname.replace(/^\/(en|ar)/, "") || "/";
  return normalized === "/";
}

function isProfilePath(pathname: string): boolean {
  const normalized = pathname.replace(/^\/(en|ar)/, "");
  return normalized === "/profile" || normalized.startsWith("/profile/");
}

/**
 * Returns a route-scoped subset of messages to reduce client hydration payload.
 */
export function getMessagesForPath(
  messages: MessageRecord,
  pathname = "/",
): MessageRecord {
  const shared = pickMessageKeys(messages, SHARED_MESSAGE_KEYS);

  if (isDashboardPath(pathname)) {
    return {
      ...shared,
      ...pickMessageKeys(messages, DASHBOARD_MESSAGE_KEYS),
    };
  }

  if (isAuthPath(pathname)) {
    return {
      ...shared,
      auth: messages.auth,
    };
  }

  if (isProfilePath(pathname)) {
    return {
      ...shared,
      ...pickMessageKeys(messages, WEBSITE_MESSAGE_KEYS),
      ...pickMessageKeys(messages, DASHBOARD_MESSAGE_KEYS),
    };
  }

  if (isHomepagePath(pathname)) {
    return {
      ...shared,
      ...pickMessageKeys(messages, HOMEPAGE_MESSAGE_KEYS),
    };
  }

  return {
    ...shared,
    ...pickMessageKeys(messages, WEBSITE_MESSAGE_KEYS),
  };
}

export { DASHBOARD_MESSAGE_KEYS, SHARED_MESSAGE_KEYS, WEBSITE_MESSAGE_KEYS };
