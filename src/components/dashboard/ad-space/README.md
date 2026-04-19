# Dashboard Advertisements (Guide)

This folder contains **UI-only** advertisement placements for the dashboard area.  
Admin/API logic can be connected later.

## What exists (placements)

- **Top strip banner**: `DashboardAdBanner`
  - Rendered in the shared dashboard layout so it appears on *all* dashboard pages:
    - `src/app/[locale]/(dashboard)/layout.tsx`
- **Inline promo card**: `DashboardAdCard`
  - Inserted in the three dashboard home UIs (admin/doctor/patient) under the stats row.
- **Floating corner promo**: `DashboardAdFloating`
  - Fixed-position card on desktop/tablet (hidden on small screens).

All three placements have a **dismiss** button using local component state (no persistence).

## Key files

- Components:
  - `DashboardAdBanner.tsx`
  - `DashboardAdCard.tsx`
  - `DashboardAdFloating.tsx`
- Types:
  - `types.ts` (`DashboardAdSourceProps`)
- Demo media:
  - `demo-images.ts` (remote image URLs)
- Styles:
  - `styles.module.scss`
- Exports:
  - `index.ts`

## Translation (i18n)

All ad UI text uses **next-intl**:

- English: `messages/en.json`
- Arabic: `messages/ar.json`

Strings live under:

- `dashboard.ads.*`

Examples:

- `dashboard.ads.regionAria`
- `dashboard.ads.dismissAria`
- `dashboard.ads.banner.*`
- `dashboard.ads.card.*`
- `dashboard.ads.floating.*`

## Images

Ads currently load **demo images** using `next/image`:

- URLs are defined in `demo-images.ts`.
- `next.config.ts` allows `images.unsplash.com` under `images.remotePatterns`.

When you connect real ads later, replace the `src` (and `alt`) values with your API-provided media.

## Showing your own promotions vs external (third-party) ads

Each component accepts the same optional props:

```ts
type DashboardAdSourceProps = {
  kind?: "own" | "external";
  partnerName?: string;
};
```

- **`kind: "own"`** (default): use for your lab’s own offers.
- **`kind: "external"`**: use for another business’s ad inventory.
  - Pass `partnerName` when available to show a clear “By {partner}” line.
  - The inline card and floating placement also show disclaimer text from translations:
    - `dashboard.ads.disclaimerExternal` / `dashboard.ads.disclaimerShort`

Usage examples:

```tsx
import { DashboardAdCard, DashboardAdBanner, DashboardAdFloating } from "@/components/dashboard/ad-space";

// Your promotions
<DashboardAdBanner kind="own" />
<DashboardAdCard kind="own" />

// External business ads
<DashboardAdBanner kind="external" partnerName="City Pharmacy" />
<DashboardAdCard kind="external" partnerName="City Pharmacy" />
<DashboardAdFloating kind="external" partnerName="City Pharmacy" />
```

## Suggested data model for later (admin/API)

When you add logic, a simple shape that maps well to the current UI:

- `id`
- `kind`: `"own" | "external"`
- `partnerName` (external only)
- `title` / `body`
- `mediaUrl` + `mediaType` (`image | video | gif`)
- `linkUrl`
- `isActive`
- `placements`: `["banner" | "card" | "floating"]`

Then each placement can select the active ad for that area and pass props into the component.

