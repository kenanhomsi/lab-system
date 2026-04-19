"use client";

import { PropsWithChildren, useCallback, useState } from "react";
import { signOut } from "next-auth/react";
import { useMirror, useMirrorRegistry } from "./store";

const State = ({ children }: PropsWithChildren) => {
  const config = useMirror("config");
  const [searchQuery, setSearchQuery] = useState(config.searchValue ?? "");

  const handleLogout = useCallback(async () => {
    await signOut({ callbackUrl: "/login" });
  }, []);

  useMirrorRegistry("searchQuery", searchQuery, "value");
  useMirrorRegistry("setSearchQuery", setSearchQuery, "reference");
  useMirrorRegistry("onLogout", handleLogout, "reference");

  return <>{children}</>;
};

export default State;
