"use client";

import type { ReactNode } from "react";
import { StoreOrdersFeatureStoreProvider } from "./store-context";

export function StoreOrdersStateProvider({ children }: { children: ReactNode }) {
  return <StoreOrdersFeatureStoreProvider>{children}</StoreOrdersFeatureStoreProvider>;
}
