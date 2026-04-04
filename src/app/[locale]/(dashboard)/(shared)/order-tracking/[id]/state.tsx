"use client";

import type { ReactNode } from "react";
import { OrderTrackingFeatureStoreProvider } from "./store-context";

export function OrderTrackingStateProvider({ children }: { children: ReactNode }) {
  return <OrderTrackingFeatureStoreProvider>{children}</OrderTrackingFeatureStoreProvider>;
}
