"use client";

import { PropsWithChildren, useState } from "react";
import { useMirrorRegistry } from "./store";

const State = ({ children }: PropsWithChildren) => {
  const [permissionsText, setPermissionsText] = useState("");
  const [loadedPermissions, setLoadedPermissions] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useMirrorRegistry("permissionsText", permissionsText);
  useMirrorRegistry("setPermissionsText", setPermissionsText);
  useMirrorRegistry("loadedPermissions", loadedPermissions);
  useMirrorRegistry("setLoadedPermissions", setLoadedPermissions);
  useMirrorRegistry("isSubmitting", isSubmitting);
  useMirrorRegistry("setIsSubmitting", setIsSubmitting);

  return <>{children}</>;
};

export { State };
