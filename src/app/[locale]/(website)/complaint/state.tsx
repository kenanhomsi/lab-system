"use client";

import type { ReactNode } from "react";
import { ComplaintFeatureStoreProvider } from "./store-context";

export function ComplaintStateProvider({ children }: { children: ReactNode }) {
  return (
    <ComplaintFeatureStoreProvider>{children}</ComplaintFeatureStoreProvider>
  );
}
