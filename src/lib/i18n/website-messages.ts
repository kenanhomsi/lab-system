/** Top-level namespaces required by public website routes (excludes dashboard). */
export const WEBSITE_MESSAGE_NAMESPACES = [
  "common",
  "nav",
  "header",
  "footer",
  "blog",
  "landing",
  "about",
  "aboutPage",
  "servicesPage",
  "contactPage",
  "contactUs",
  "offers",
  "offerDetails",
  "subscriptions",
  "careers",
  "complaint",
  "joinAsClient",
  "joinClient",
  "labEncyclopedia",
  "labEncyclopediaDetail",
  "priceCalculator",
  "tests",
  "testDetails",
  "booking",
  "results",
  "insurance",
  "tracking",
  "specialPages",
  "encyclopedia",
] as const;

export function pickWebsiteMessages(
  messages: Record<string, unknown>,
): Record<string, unknown> {
  const picked: Record<string, unknown> = {};
  for (const key of WEBSITE_MESSAGE_NAMESPACES) {
    if (key in messages) {
      picked[key] = messages[key];
    }
  }
  return picked;
}
