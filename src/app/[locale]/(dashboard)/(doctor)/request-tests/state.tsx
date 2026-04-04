"use client";

import type { ReactNode } from "react";
import { RequestTestsFeatureStoreProvider } from "./store-context";

export function RequestTestsStateProvider({ children }: { children: ReactNode }) {
  return <RequestTestsFeatureStoreProvider>{children}</RequestTestsFeatureStoreProvider>;
}
