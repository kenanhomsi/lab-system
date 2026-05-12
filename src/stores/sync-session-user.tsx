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
    const currentUser = useSessionUserStore.getState().user;

    if (status !== "authenticated" || !session?.user) {
      if (currentUser !== null) {
        setSessionUser(null);
      }
      return;
    }
    const u = session.user;
    const id = typeof u.id === "string" ? u.id.trim() : "";
    if (!id) {
      if (currentUser !== null) {
        setSessionUser(null);
      }
      return;
    }
    const nextUser = {
      id,
      roles: Array.isArray(u.roles) ? [...u.roles] : [],
      email: u.email,
      fullName: u.fullName,
    };

    const hasSameUser =
      currentUser?.id === nextUser.id &&
      currentUser?.email === nextUser.email &&
      currentUser?.fullName === nextUser.fullName &&
      currentUser?.roles.length === nextUser.roles.length &&
      currentUser?.roles.every((role, index) => role === nextUser.roles[index]);

    if (!hasSameUser) {
      setSessionUser(nextUser);
    }
  }, [session, setSessionUser, status]);

  return null;
}

export { SyncSessionUser };
