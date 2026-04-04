"use client";

import type { ReactNode } from "react";

export function JoinAsClientUtilsProvider({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
