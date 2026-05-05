"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useSessionUserStore } from "./session-user-store";

/**
 * Keeps {@link useSessionUserStore} in sync with NextAuth session (no separate /me API).
 * Mount once under {@link SessionProvider}.
 */
function SyncSessionUser() {
  const { data: session, status } = useSession();
  const setSessionUser = useSessionUserStore((s) => s.setSessionUser);

  useEffect(() => {
    if (status !== "authenticated" || !session?.user) {
      setSessionUser(null);
      return;
    }
    const u = session.user;
    const id = typeof u.id === "string" ? u.id.trim() : "";
    if (!id) {
      setSessionUser(null);
      return;
    }
    setSessionUser({
      id,
      roles: Array.isArray(u.roles) ? [...u.roles] : [],
      email: u.email,
      fullName: u.fullName,
    });
  }, [session, setSessionUser, status]);

  return null;
}

export { SyncSessionUser };
