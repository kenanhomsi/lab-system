"use client";

import { PropsWithChildren, useEffect } from "react";
import { useMirror } from "./store";

const Observer = ({ children }: PropsWithChildren) => {
  const isOpen = useMirror("isOpen");
  const user = useMirror("user");
  const loadPermissions = useMirror("loadPermissions");

  useEffect(() => {
    if (!isOpen || !user) {
      return;
    }

    void loadPermissions();
  }, [isOpen, loadPermissions, user]);

  return <>{children}</>;
};

export { Observer };
