"use client";

import type { ReactNode } from "react";
import { AccountStatementFeatureStoreProvider } from "./store-context";

export function AccountStatementStateProvider({ children }: { children: ReactNode }) {
  return (
    <AccountStatementFeatureStoreProvider>{children}</AccountStatementFeatureStoreProvider>
  );
}
