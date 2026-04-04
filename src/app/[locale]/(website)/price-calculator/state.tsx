"use client";

import type { ReactNode } from "react";
import { PriceCalculatorFeatureStoreProvider } from "./store-context";

export function PriceCalculatorStateProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <PriceCalculatorFeatureStoreProvider>
      {children}
    </PriceCalculatorFeatureStoreProvider>
  );
}
