"use client";

import {
  CreateSubscriptionPackageRequest,
  UpdateSubscriptionPackageRequest,
} from "@/components/tables/subscription-packages-table/types";
import { PropsWithChildren, useMemo } from "react";
import { useMirror, useMirrorRegistry } from "./store";
import { FormState } from "./types";

const Utils = ({ children }: PropsWithChildren) => {
  const subscriptionPackage = useMirror("subscriptionPackage");
  const onClose = useMirror("onClose");
  const form = useMirror("form");
  const setForm = useMirror("setForm");
  const isSubmitting = useMirror("isSubmitting");
  const setIsSubmitting = useMirror("setIsSubmitting");
  const createPackageApi = useMirror("createPackageApi");
  const updatePackageApi = useMirror("updatePackageApi");

  const canSubmit = useMemo(
    () =>
      Boolean(
        form.name.trim() &&
          form.validityDays >= 0 &&
          form.price >= 0 &&
          form.includedTests.trim(),
      ),
    [form.includedTests, form.name, form.price, form.validityDays],
  );

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  const updateField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const submit = async () => {
    if (!canSubmit) return;

    setIsSubmitting(true);
    try {
      if (subscriptionPackage) {
        const payload: UpdateSubscriptionPackageRequest = { ...form };
        await updatePackageApi(subscriptionPackage.id, payload);
      } else {
        const payload: CreateSubscriptionPackageRequest = { ...form };
        await createPackageApi(payload);
      }
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  useMirrorRegistry("canSubmit", canSubmit);
  useMirrorRegistry("handleClose", handleClose);
  useMirrorRegistry("updateField", updateField);
  useMirrorRegistry("submit", submit);

  return <>{children}</>;
};

export { Utils };
