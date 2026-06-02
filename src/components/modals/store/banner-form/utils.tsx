"use client";

import type { PropsWithChildren } from "react";
import { useMemo } from "react";
import { notifications } from "@mantine/notifications";
import { useTranslations } from "next-intl";
import type { UpsertStoreBannerInput } from "@/modules/store/abstraction/schemas";
import { useMirror, useMirrorRegistry } from "./store";

const toDateTimeLocal = (value?: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value.slice(0, 16);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const Utils = ({ children }: PropsWithChildren) => {
  const t = useTranslations("labStore.admin");
  const banner = useMirror("banner");
  const onClose = useMirror("onClose");
  const form = useMirror("form");
  const setForm = useMirror("setForm");
  const isSubmitting = useMirror("isSubmitting");
  const setIsSubmitting = useMirror("setIsSubmitting");
  const createBanner = useMirror("createBanner");
  const updateBanner = useMirror("updateBanner");

  const canSubmit = useMemo(
    () =>
      form.title.trim().length > 0 &&
      form.imageUrl.trim().length > 0 &&
      form.location.trim().length > 0,
    [form.title, form.imageUrl, form.location],
  );

  const updateField = <K extends keyof UpsertStoreBannerInput>(
    field: K,
    value: UpsertStoreBannerInput[K],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  const submit = async () => {
    if (!canSubmit) return;
    const body: UpsertStoreBannerInput = {
      ...form,
      title: form.title.trim(),
      imageUrl: form.imageUrl.trim(),
      linkUrl: form.linkUrl.trim(),
      location: form.location.trim(),
      startsAt: form.startsAt?.trim() || undefined,
      endsAt: form.endsAt?.trim() || undefined,
    };

    setIsSubmitting(true);
    try {
      if (banner) {
        await updateBanner({ id: banner.id, data: body });
        notifications.show({ title: t("saved"), message: t("bannerUpdated"), color: "green" });
      } else {
        await createBanner(body);
        notifications.show({ title: t("saved"), message: t("bannerCreated"), color: "green" });
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

export { Utils, toDateTimeLocal };
