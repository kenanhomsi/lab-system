"use client";

import type { ReactNode } from "react";
import { StoreCartFeatureStoreProvider } from "./store-context";

export function StoreCartStateProvider({ children }: { children: ReactNode }) {
  return <StoreCartFeatureStoreProvider>{children}</StoreCartFeatureStoreProvider>;
}
