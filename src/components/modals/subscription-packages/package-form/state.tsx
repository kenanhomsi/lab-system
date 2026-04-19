"use client";

import { PropsWithChildren, useEffect, useState } from "react";
import { useMirror, useMirrorRegistry } from "./store";
import { FormState, defaultForm } from "./types";

const State = ({ children }: PropsWithChildren) => {
  const isOpen = useMirror("isOpen");
  const subscriptionPackage = useMirror("subscriptionPackage");
  const [form, setForm] = useState<FormState>(defaultForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (subscriptionPackage) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        name: subscriptionPackage.name,
        price: subscriptionPackage.price,
        validityDays: subscriptionPackage.validityDays,
        includedTests: subscriptionPackage.includedTests,
        targetAudience: subscriptionPackage.targetAudience,
        isActive: subscriptionPackage.isActive,
      });
      return;
    }

    setForm(defaultForm);
  }, [isOpen, subscriptionPackage]);

  useMirrorRegistry("form", form);
  useMirrorRegistry("setForm", setForm);
  useMirrorRegistry("isSubmitting", isSubmitting);
  useMirrorRegistry("setIsSubmitting", setIsSubmitting);

  return <>{children}</>;
};

export { State };
