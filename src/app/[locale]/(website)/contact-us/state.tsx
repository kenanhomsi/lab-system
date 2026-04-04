"use client";

import type { ReactNode } from "react";
import { ContactUsFeatureStoreProvider } from "./store-context";

export function ContactUsStateProvider({ children }: { children: ReactNode }) {
  return (
    <ContactUsFeatureStoreProvider>{children}</ContactUsFeatureStoreProvider>
  );
}
