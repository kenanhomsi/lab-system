"use client";

import type { ReactNode } from "react";

export function JoinAsClientObserverProvider({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
