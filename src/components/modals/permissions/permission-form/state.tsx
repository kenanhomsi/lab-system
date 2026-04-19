"use client";

import { PropsWithChildren, useEffect, useState } from "react";
import { useMirror, useMirrorRegistry } from "./store";

const State = ({ children }: PropsWithChildren) => {
  const isOpen = useMirror("isOpen");
  const permission = useMirror("permission");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (permission) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(permission.name);
      setDescription(permission.description);
      return;
    }

    setName("");
    setDescription("");
  }, [isOpen, permission]);

  useMirrorRegistry("name", name);
  useMirrorRegistry("setName", setName);
  useMirrorRegistry("description", description);
  useMirrorRegistry("setDescription", setDescription);
  useMirrorRegistry("isSubmitting", isSubmitting);
  useMirrorRegistry("setIsSubmitting", setIsSubmitting);

  return <>{children}</>;
};

export { State };
