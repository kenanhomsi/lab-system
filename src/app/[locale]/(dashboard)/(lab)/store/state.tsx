"use client";

import type { ReactNode } from "react";
import { StorefrontFeatureStoreProvider } from "./store-context";

export function StorefrontStateProvider({ children }: { children: ReactNode }) {
  return <StorefrontFeatureStoreProvider>{children}</StorefrontFeatureStoreProvider>;
}
