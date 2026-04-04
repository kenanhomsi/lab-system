"use client";

import type { ReactNode } from "react";
import { MyResultsFeatureStoreProvider } from "./store-context";

export function MyResultsStateProvider({ children }: { children: ReactNode }) {
  return <MyResultsFeatureStoreProvider>{children}</MyResultsFeatureStoreProvider>;
}
