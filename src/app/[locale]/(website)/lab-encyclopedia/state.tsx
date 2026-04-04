"use client";

import type { ReactNode } from "react";
import { LabEncyclopediaFeatureStoreProvider } from "./store-context";

export function LabEncyclopediaStateProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <LabEncyclopediaFeatureStoreProvider>
      {children}
    </LabEncyclopediaFeatureStoreProvider>
  );
}
