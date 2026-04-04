"use client";

import type { ReactNode } from "react";
import { TestsFeatureStoreProvider } from "./store-context";

export function TestsStateProvider({ children }: { children: ReactNode }) {
  return <TestsFeatureStoreProvider>{children}</TestsFeatureStoreProvider>;
}
