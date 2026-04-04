"use client";

import type { ReactNode } from "react";
import { NewPaymentFeatureStoreProvider } from "./store-context";

export function NewPaymentStateProvider({ children }: { children: ReactNode }) {
  return <NewPaymentFeatureStoreProvider>{children}</NewPaymentFeatureStoreProvider>;
}
