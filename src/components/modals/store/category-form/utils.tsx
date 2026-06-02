"use client";

import type { PropsWithChildren } from "react";
import { useMemo } from "react";
import { notifications } from "@mantine/notifications";
import { useTranslations } from "next-intl";
import type { UpsertStoreCategoryInput } from "@/modules/store/abstraction/schemas";
import { useMirror, useMirrorRegistry } from "./store";

const Utils = ({ children }: PropsWithChildren) => {
  const t = useTranslations("labStore.admin");
  const category = useMirror("category");
  const onClose = useMirror("onClose");
  const form = useMirror("form");
  const setForm = useMirror("setForm");
  const isSubmitting = useMirror("isSubmitting");
  const setIsSubmitting = useMirror("setIsSubmitting");
  const createCategory = useMirror("createCategory");
  const updateCategory = useMirror("updateCategory");

  const canSubmit = useMemo(
    () => form.nameAr.trim().length > 0 && form.nameEn.trim().length > 0,
    [form.nameAr, form.nameEn],
  );

  const updateField = <K extends keyof UpsertStoreCategoryInput>(
    field: K,
    value: UpsertStoreCategoryInput[K],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  const submit = async () => {
    if (!canSubmit) return;
    const body: UpsertStoreCategoryInput = {
      ...form,
      nameAr: form.nameAr.trim(),
      nameEn: form.nameEn.trim(),
      description: form.description.trim(),
      imageUrl: form.imageUrl.trim(),
    };

    setIsSubmitting(true);
    try {
      if (category) {
        await updateCategory({ id: category.id, data: body });
        notifications.show({ title: t("saved"), message: t("categoryUpdated"), color: "green" });
      } else {
        await createCategory(body);
        notifications.show({ title: t("saved"), message: t("categoryCreated"), color: "green" });
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
