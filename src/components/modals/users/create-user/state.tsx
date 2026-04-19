"use client";

import { PropsWithChildren, useEffect, useState } from "react";
import { useMirror, useMirrorRegistry } from "./store";
import { CreateUserPayload, initialValues } from "./types";

const State = ({ children }: PropsWithChildren) => {
  const isOpen = useMirror("isOpen");
  const [form, setForm] = useState<CreateUserPayload>(initialValues);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm(initialValues);
    }
  }, [isOpen]);

  useMirrorRegistry("form", form);
  useMirrorRegistry("setForm", setForm);
  useMirrorRegistry("isSubmitting", isSubmitting);
  useMirrorRegistry("setIsSubmitting", setIsSubmitting);

  return <>{children}</>;
};

export { State };
