"use client";

import type { PropsWithChildren } from "react";
import { useMemo } from "react";
import { notifications } from "@mantine/notifications";
import { useTranslations } from "next-intl";
import type { UpsertStoreCouponInput } from "@/modules/store/abstraction/schemas";
import { useMirror, useMirrorRegistry } from "./store";

const Utils = ({ children }: PropsWithChildren) => {
  const t = useTranslations("labStore.admin");
  const coupon = useMirror("coupon");
  const onClose = useMirror("onClose");
  const form = useMirror("form");
  const setForm = useMirror("setForm");
  const isSubmitting = useMirror("isSubmitting");
  const setIsSubmitting = useMirror("setIsSubmitting");
  const createCoupon = useMirror("createCoupon");
  const updateCoupon = useMirror("updateCoupon");

  const canSubmit = useMemo(() => form.code.trim().length > 0, [form.code]);

  const updateField = <K extends keyof UpsertStoreCouponInput>(
    field: K,
    value: UpsertStoreCouponInput[K],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  const submit = async () => {
    if (!canSubmit) return;
    const body: UpsertStoreCouponInput = {
      ...form,
      code: form.code.trim(),
    };

    setIsSubmitting(true);
    try {
      if (coupon) {
        await updateCoupon({ id: coupon.id, data: body });
        notifications.show({ title: t("saved"), message: t("couponUpdated"), color: "green" });
      } else {
        await createCoupon(body);
        notifications.show({ title: t("saved"), message: t("couponCreated"), color: "green" });
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
