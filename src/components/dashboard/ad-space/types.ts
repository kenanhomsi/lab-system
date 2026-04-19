/**
 * How to show ads for *your* business vs *another* business (partner / paid inventory):
 * - `kind: "own"` — your lab’s promotions (default in demos).
 * - `kind: "external"` — another advertiser; always show `partnerName` when you have it from admin/API,
 *   plus the disclaimer strings so users know you only display the ad, not the offer itself.
 */
export type DashboardAdBusinessKind = "own" | "external";

export type DashboardAdSourceProps = {
  kind?: DashboardAdBusinessKind;
  /** Partner / advertiser name from your admin or API (recommended when kind is "external"). */
  partnerName?: string;
};
