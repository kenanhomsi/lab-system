"use client";

import type { ReactNode } from "react";
import { CareersFeatureStoreProvider } from "./store-context";

export function CareersStateProvider({ children }: { children: ReactNode }) {
  return (
    <CareersFeatureStoreProvider>{children}</CareersFeatureStoreProvider>
  );
}
