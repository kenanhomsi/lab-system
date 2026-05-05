"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import { SyncSessionUser } from "@/stores/sync-session-user";

export function SessionProvider({ children }: { children: ReactNode }) {
  return (
    <NextAuthSessionProvider>
      <SyncSessionUser />
      {children}
    </NextAuthSessionProvider>
  );
}
