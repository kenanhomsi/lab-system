"use client";

import type { ReactNode } from "react";
import { InsuranceRequestFeatureStoreProvider } from "./store-context";

export function InsuranceRequestStateProvider({ children }: { children: ReactNode }) {
  return <InsuranceRequestFeatureStoreProvider>{children}</InsuranceRequestFeatureStoreProvider>;
}
