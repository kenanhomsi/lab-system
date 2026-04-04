"use client";

import type { ReactNode } from "react";
import { NewExpenseFeatureStoreProvider } from "./store-context";

export function NewExpenseStateProvider({ children }: { children: ReactNode }) {
  return <NewExpenseFeatureStoreProvider>{children}</NewExpenseFeatureStoreProvider>;
}
