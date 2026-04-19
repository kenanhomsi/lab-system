"use client";

import { PropsWithChildren, useEffect, useState } from "react";
import { useMirror, useMirrorRegistry } from "./store";

const State = ({ children }: PropsWithChildren) => {
  const isOpen = useMirror("isOpen");
  const role = useMirror("role");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (role) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(role.name);
      return;
    }

    setName("");
  }, [isOpen, role]);

  useMirrorRegistry("name", name);
  useMirrorRegistry("setName", setName);
  useMirrorRegistry("isSubmitting", isSubmitting);
  useMirrorRegistry("setIsSubmitting", setIsSubmitting);

  return <>{children}</>;
};

export { State };
