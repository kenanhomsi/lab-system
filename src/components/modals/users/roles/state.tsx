"use client";

import { PropsWithChildren, useState } from "react";
import { useMirror, useMirrorRegistry } from "./store";

const State = ({ children }: PropsWithChildren) => {
  const user = useMirror("user");
  const [rolesText, setRolesText] = useState("");
  const [currentRoles, setCurrentRoles] = useState<string[]>(() => user?.roles ?? []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useMirrorRegistry("rolesText", rolesText);
  useMirrorRegistry("setRolesText", setRolesText);
  useMirrorRegistry("currentRoles", currentRoles);
  useMirrorRegistry("setCurrentRoles", setCurrentRoles);
  useMirrorRegistry("isSubmitting", isSubmitting);
  useMirrorRegistry("setIsSubmitting", setIsSubmitting);

  return <>{children}</>;
};

export { State };
