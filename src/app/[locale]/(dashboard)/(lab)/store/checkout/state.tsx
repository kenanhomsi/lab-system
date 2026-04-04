"use client";

import type { ReactNode } from "react";
import { StoreCheckoutFeatureStoreProvider } from "./store-context";

export function StoreCheckoutStateProvider({ children }: { children: ReactNode }) {
  return (
    <StoreCheckoutFeatureStoreProvider>{children}</StoreCheckoutFeatureStoreProvider>
  );
}
