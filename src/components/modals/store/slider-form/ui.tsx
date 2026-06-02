"use client";

import { MutationErrorAlert } from "@/components/ui/mutation-error-alert";
import { Modal, MultiSelect, NumberInput, Select, Stack, Switch, TextInput } from "@mantine/core";
import { IconSlideshow } from "@tabler/icons-react";
import { useMemo } from "react";
import { useTranslations } from "next-intl";
import {
  STORE_FORM_MODAL_SIZE,
  STORE_GLASS_MODAL_STYLES,
  STORE_GLASS_OVERLAY_PROPS,
  StoreFormFooter,
  StoreModalHeader,
} from "../shared";
import { useMirror } from "./store";
import { SLIDER_TYPES } from "./types";

const UI = () => {
  const t = useTranslations("labStore.admin");
  const isOpen = useMirror("isOpen");
  const slider = useMirror("slider");
  const form = useMirror("form");
  const productsData = useMirror("productsData");
  const isProductsPending = useMirror("isProductsPending");
  const isSubmitting = useMirror("isSubmitting");
  const canSubmit = useMirror("canSubmit");
  const updateField = useMirror("updateField");
  const handleClose = useMirror("handleClose");
  const submit = useMirror("submit");

  const isEdit = Boolean(slider);

  const productOptions = useMemo(
    () =>
      productsData.map((p) => ({
        value: String(p.id),
        label: `${p.nameAr} (${p.nameEn})`,
      })),
    [productsData],
  );

  const typeOptions = useMemo(
    () =>
      SLIDER_TYPES.map((value) => ({
        value,
        label: t(
          value === "Custom"
            ? "sliderTypeCustom"
            : value === "Featured"
              ? "sliderTypeFeatured"
              : "sliderTypeBestSeller",
        ),
      })),
    [t],
  );

  return (
    <Modal opened={isOpen} onClose={handleClose} title={<StoreModalHeader icon={<IconSlideshow size={22} />} title={isEdit ? t("editSlider") : t("createSlider")} subtitle={t("slidersDesc")} />} centered size={STORE_FORM_MODAL_SIZE} radius="xl" padding="lg" closeOnClickOutside={!isSubmitting} closeOnEscape={!isSubmitting} overlayProps={STORE_GLASS_OVERLAY_PROPS} styles={STORE_GLASS_MODAL_STYLES}>
      <Stack gap="md">
        <MutationErrorAlert />
        <TextInput label={t("colTitle")} value={form.title} onChange={(e) => updateField("title", e.currentTarget.value)} required />
        <Select label={t("colType")} data={typeOptions} value={form.type} onChange={(v) => updateField("type", v ?? "Custom")} />
        <NumberInput label={t("displayOrder")} value={form.displayOrder} onChange={(v) => updateField("displayOrder", Number(v) || 0)} min={0} />
        <Switch label={t("active")} checked={form.isActive} onChange={(e) => updateField("isActive", e.currentTarget.checked)} />
        <MultiSelect label={t("sliderProducts")} placeholder={t("selectProducts")} data={productOptions} value={form.productIds.map(String)} onChange={(values) => updateField("productIds", values.map((v) => Number(v)))} searchable clearable disabled={isProductsPending} />
        <StoreFormFooter onCancel={handleClose} onSave={() => void submit()} isSubmitting={isSubmitting} canSubmit={canSubmit} />
      </Stack>
    </Modal>
  );
};

export { UI };
