"use client";

import { PropsWithChildren, useMemo } from "react";
import { useMirror, useMirrorRegistry } from "./store";
import { CreateUserPayload, initialValues } from "./types";

const Utils = ({ children }: PropsWithChildren) => {
  const form = useMirror("form");
  const setForm = useMirror("setForm");
  const isSubmitting = useMirror("isSubmitting");
  const setIsSubmitting = useMirror("setIsSubmitting");
  const onClose = useMirror("onClose");
  const submitCreate = useMirror("submitCreate");

  const canSubmit = useMemo(
    () => Boolean(form.email.trim() && form.password.trim() && form.fullName.trim()),
    [form.email, form.fullName, form.password],
  );

  const updateField = (
    field: keyof CreateUserPayload,
    value: CreateUserPayload[keyof CreateUserPayload],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  const submit = async () => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    try {
      await submitCreate({ ...form, roles: form.roles.filter(Boolean) });
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
