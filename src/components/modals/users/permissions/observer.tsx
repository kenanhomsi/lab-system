"use client";

import { PropsWithChildren, useEffect } from "react";
import { useMirror } from "./store";

const Observer = ({ children }: PropsWithChildren) => {
  const isOpen = useMirror("isOpen");
  const user = useMirror("user");
  const loadPermissions = useMirror("loadPermissions");
  const loadedPermissions = useMirror('loadedPermissions');


  useEffect(() => {
    if (!isOpen || !user || loadedPermissions.length > 0) {
      return;
    }

    void loadPermissions();
  }, [isOpen, loadPermissions, user, loadedPermissions]);

  return <>{children}</>;
};

export { Observer };
