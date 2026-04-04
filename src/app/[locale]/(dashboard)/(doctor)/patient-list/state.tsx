"use client";

import type { ReactNode } from "react";
import { PatientListFeatureStoreProvider } from "./store-context";

export function PatientListStateProvider({ children }: { children: ReactNode }) {
  return <PatientListFeatureStoreProvider>{children}</PatientListFeatureStoreProvider>;
}
