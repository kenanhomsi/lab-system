"use client";

import type { ReactNode } from "react";
import { JoinAsClientFeatureStoreProvider } from "./store-context";

export function JoinAsClientStateProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <JoinAsClientFeatureStoreProvider>
      {children}
    </JoinAsClientFeatureStoreProvider>
  );
}
