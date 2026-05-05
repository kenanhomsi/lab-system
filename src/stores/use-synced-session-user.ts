"use client";

import { useSession } from "next-auth/react";
import { useSessionUserStore } from "./session-user-store";

/** Session user from Zustand (synced from NextAuth) plus loading / auth flags. */
function useSyncedSessionUser() {
  const { status } = useSession();
  const user = useSessionUserStore((s) => s.user);

  return {
    user,
    status,
    isSessionLoading: status === "loading",
    isUnauthenticated: status === "unauthenticated",
  };
}

export { useSyncedSessionUser };
