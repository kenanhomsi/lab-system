"use client";

import { PropsWithChildren, useEffect, useState } from "react";
import { useMirror, useMirrorRegistry } from "./store";

const State = ({ children }: PropsWithChildren) => {
  const isOpen = useMirror("isOpen");
  const appointmentType = useMirror("appointmentType");
  const [name, setName] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (appointmentType) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(appointmentType.name);
      setIsActive(appointmentType.isActive);
      return;
    }

    setName("");
    setIsActive(true);
  }, [appointmentType, isOpen]);

  useMirrorRegistry("name", name);
  useMirrorRegistry("setName", setName);
  useMirrorRegistry("isActive", isActive);
  useMirrorRegistry("setIsActive", setIsActive);
  useMirrorRegistry("isSubmitting", isSubmitting);
  useMirrorRegistry("setIsSubmitting", setIsSubmitting);

  return <>{children}</>;
};

export { State };
