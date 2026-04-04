"use client";

import type { ReactNode } from "react";
import type { Offer } from "./store/api";
import { OffersFeatureStoreProvider } from "./store-context";

export function OffersStateProvider({
  children,
  offers,
  locale,
}: {
  children: ReactNode;
  offers: Offer[];
  locale: string;
}) {
  return (
    <OffersFeatureStoreProvider extras={{ offers, locale }}>
      {children}
    </OffersFeatureStoreProvider>
  );
}
