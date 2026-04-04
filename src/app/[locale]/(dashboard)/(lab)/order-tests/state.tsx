"use client";

import type { ReactNode } from "react";
import { OrderTestsFeatureStoreProvider } from "./store-context";

export function OrderTestsStateProvider({ children }: { children: ReactNode }) {
  return <OrderTestsFeatureStoreProvider>{children}</OrderTestsFeatureStoreProvider>;
}
