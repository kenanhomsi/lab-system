"use client";

import type { PropsWithChildren } from "react";
import { useMemo } from "react";
import { notifications } from "@mantine/notifications";
import { useTranslations } from "next-intl";
import type { UpsertStoreSliderInput } from "@/modules/store/abstraction/schemas";
import { useMirror, useMirrorRegistry } from "./store";

const Utils = ({ children }: PropsWithChildren) => {
  const t = useTranslations("labStore.admin");
  const slider = useMirror("slider");
  const onClose = useMirror("onClose");
  const form = useMirror("form");
  const setForm = useMirror("setForm");
  const isSubmitting = useMirror("isSubmitting");
  const setIsSubmitting = useMirror("setIsSubmitting");
  const createSlider = useMirror("createSlider");
  const updateSlider = useMirror("updateSlider");

  const canSubmit = useMemo(() => form.title.trim().length > 0, [form.title]);

  const updateField = <K extends keyof UpsertStoreSliderInput>(
    field: K,
    value: UpsertStoreSliderInput[K],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  const submit = async () => {
    if (!canSubmit) return;
    const body: UpsertStoreSliderInput = {
      ...form,
      title: form.title.trim(),
    };

    setIsSubmitting(true);
    try {
      if (slider) {
        await updateSlider({ id: slider.id, data: body });
        notifications.show({ title: t("saved"), message: t("sliderUpdated"), color: "green" });
      } else {
        await createSlider(body);
        notifications.show({ title: t("saved"), message: t("sliderCreated"), color: "green" });
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
