"use client";

import type { ReactNode } from "react";
import { BookAppointmentFeatureStoreProvider } from "./store-context";

export function BookAppointmentStateProvider({ children }: { children: ReactNode }) {
  return (
    <BookAppointmentFeatureStoreProvider>{children}</BookAppointmentFeatureStoreProvider>
  );
}
