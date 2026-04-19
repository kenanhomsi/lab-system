"use client";

import { PropsWithChildren, useMemo } from "react";
import { useMirror, useMirrorRegistry } from "./store";
import { UpdateUserPayload, initialValues } from "./types";

const Utils = ({ children }: PropsWithChildren) => {
  const user = useMirror("user");
  const form = useMirror("form");
  const setForm = useMirror("setForm");
  const isSubmitting = useMirror("isSubmitting");
  const setIsSubmitting = useMirror("setIsSubmitting");
  const onClose = useMirror("onClose");
  const submitUpdate = useMirror("submitUpdate");

  const canSubmit = useMemo(() => Boolean(user && form.fullName.trim()), [form.fullName, user]);

  const updateField = (
    field: keyof UpdateUserPayload,
    value: UpdateUserPayload[keyof UpdateUserPayload],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  const submit = async () => {
    if (!user || !canSubmit) return;
    setIsSubmitting(true);
    try {
      await submitUpdate({ id: user.id, payload: form });
      setForm(initialValues);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  useMirrorRegistry("canSubmit", canSubmit);
  useMirrorRegistry("updateField", updateField);
  useMirrorRegistry("handleClose", handleClose);
  useMirrorRegistry("submit", submit);

  return <>{children}</>;
};

export { Utils };
