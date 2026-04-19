"use client";

import { PropsWithChildren, useEffect, useState } from "react";
import { useMirror, useMirrorRegistry } from "./store";
import { UpdateUserPayload, initialValues } from "./types";

const State = ({ children }: PropsWithChildren) => {
  const isOpen = useMirror("isOpen");
  const user = useMirror("user");
  const [form, setForm] = useState<UpdateUserPayload>(initialValues);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm(initialValues);
      return;
    }
    if (!user) return;

    setForm({
      fullName: user.fullName,
      city: user.city || "",
      phoneNumber: user.phoneNumber || "",
      profileMetadata: "",
    });
  }, [isOpen, user]);

  useMirrorRegistry("form", form);
  useMirrorRegistry("setForm", setForm);
  useMirrorRegistry("isSubmitting", isSubmitting);
  useMirrorRegistry("setIsSubmitting", setIsSubmitting);

  return <>{children}</>;
};

export { State };
