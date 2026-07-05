"use client";

import dynamic from "next/dynamic";

const WebsiteWelcomePagesModal = dynamic(
  () =>
    import("@/components/welcome-pages").then(
      (module) => module.WebsiteWelcomePagesModal,
    ),
  { ssr: false },
);

/**
 * Defers welcome-page modal code until after hydration.
 */
export function LazyWebsiteWelcomePagesModal() {
  return <WebsiteWelcomePagesModal />;
}
