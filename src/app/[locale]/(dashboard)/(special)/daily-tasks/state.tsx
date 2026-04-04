"use client";

import type { ReactNode } from "react";
import { DailyTasksFeatureStoreProvider } from "./store-context";

export function DailyTasksStateProvider({ children }: { children: ReactNode }) {
  return <DailyTasksFeatureStoreProvider>{children}</DailyTasksFeatureStoreProvider>;
}
