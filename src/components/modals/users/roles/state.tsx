"use client";

import { PropsWithChildren, useState } from "react";
import { useMirrorRegistry } from "./store";

const State = ({ children }: PropsWithChildren) => {
  const [rolesText, setRolesText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useMirrorRegistry("rolesText", rolesText);
  useMirrorRegistry("setRolesText", setRolesText);
  useMirrorRegistry("isSubmitting", isSubmitting);
  useMirrorRegistry("setIsSubmitting", setIsSubmitting);

  return <>{children}</>;
};

export { State };
