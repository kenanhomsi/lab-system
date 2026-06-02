"use client";

import type { PropsWithChildren } from "react";
import { useMemo } from "react";
import { notifications } from "@mantine/notifications";
import { useTranslations } from "next-intl";
import type { UpsertStoreProductInput } from "@/modules/store/abstraction/schemas";
import { useMirror, useMirrorRegistry } from "./store";

const Utils = ({ children }: PropsWithChildren) => {
  const t = useTranslations("labStore.admin");
  const product = useMirror("product");
  const onClose = useMirror("onClose");
  const form = useMirror("form");
  const setForm = useMirror("setForm");
  const isSubmitting = useMirror("isSubmitting");
  const setIsSubmitting = useMirror("setIsSubmitting");
  const createProduct = useMirror("createProduct");
  const updateProduct = useMirror("updateProduct");

  const canAdvanceStep = useMemo(
    () =>
      form.nameAr.trim().length > 0 &&
      form.nameEn.trim().length > 0 &&
      form.categoryId > 0 &&
      form.saleUnit.trim().length > 0,
    [form.nameAr, form.nameEn, form.categoryId, form.saleUnit],
  );

  const canSubmit = canAdvanceStep;

  const updateField = <K extends keyof UpsertStoreProductInput>(
    field: K,
    value: UpsertStoreProductInput[K],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  const submit = async () => {
    if (!canSubmit) return;
    const body: UpsertStoreProductInput = {
      ...form,
      nameAr: form.nameAr.trim(),
      nameEn: form.nameEn.trim(),
      description: form.description.trim(),
      imageUrl: form.imageUrl.trim(),
      saleUnit: form.saleUnit.trim(),
      topBadge: form.topBadge.trim(),
    };

    setIsSubmitting(true);
    try {
      if (product) {
        await updateProduct({ id: product.id, data: body });
        notifications.show({ title: t("saved"), message: t("productUpdated"), color: "green" });
      } else {
        await createProduct(body);
        notifications.show({ title: t("saved"), message: t("productCreated"), color: "green" });
      }
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  useMirrorRegistry("canSubmit", canSubmit);
  useMirrorRegistry("canAdvanceStep", canAdvanceStep);
  useMirrorRegistry("handleClose", handleClose);
  useMirrorRegistry("updateField", updateField);
  useMirrorRegistry("submit", submit);

  return <>{children}</>;
};

export { Utils };
