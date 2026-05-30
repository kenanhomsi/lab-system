"use client";

import { PropsWithChildren, useCallback, useState } from "react";
import { signOut } from "next-auth/react";
import { unregisterDeviceTokenIfStored } from "@/features/push-notifications/lib/unregister-device-token";
import { useRouter } from "@/i18n/navigation";
import { useMirror, useMirrorRegistry } from "./store";

const State = ({ children }: PropsWithChildren) => {
  const config = useMirror("config");
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(config.searchValue ?? "");

  const handleLogout = useCallback(async () => {
    await unregisterDeviceTokenIfStored();
    // Avoid NextAuth server redirect (uses NEXTAUTH_URL). Navigate on the current origin instead.
    await signOut({ redirect: false, callbackUrl: "/login" });
    router.replace("/login");
    router.refresh();
  }, [router]);

  useMirrorRegistry("searchQuery", searchQuery, "value");
  useMirrorRegistry("setSearchQuery", setSearchQuery, "reference");
  useMirrorRegistry("onLogout", handleLogout, "reference");

  return <>{children}</>;
};

export default State;
