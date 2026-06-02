"use client";

import { MutationErrorAlert } from "@/components/ui/mutation-error-alert";
import { Modal, NumberInput, Select, Stack, Switch, TextInput } from "@mantine/core";
import { IconDiscount } from "@tabler/icons-react";
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
import { DISCOUNT_TYPES } from "./types";

const UI = () => {
  const t = useTranslations("labStore.admin");
  const isOpen = useMirror("isOpen");
  const coupon = useMirror("coupon");
  const form = useMirror("form");
  const isSubmitting = useMirror("isSubmitting");
  const canSubmit = useMirror("canSubmit");
  const updateField = useMirror("updateField");
  const handleClose = useMirror("handleClose");
  const submit = useMirror("submit");

  const isEdit = Boolean(coupon);
  const discountTypeOptions = useMemo(
    () =>
      DISCOUNT_TYPES.map((value) => ({
        value,
        label: t(value === "Percentage" ? "discountTypePercentage" : "discountTypeFixed"),
      })),
    [t],
  );

  return (
    <Modal opened={isOpen} onClose={handleClose} title={<StoreModalHeader icon={<IconDiscount size={22} />} title={isEdit ? t("editCoupon") : t("createCoupon")} subtitle={t("couponsDesc")} />} centered size={STORE_FORM_MODAL_SIZE} radius="xl" padding="lg" closeOnClickOutside={!isSubmitting} closeOnEscape={!isSubmitting} overlayProps={STORE_GLASS_OVERLAY_PROPS} styles={STORE_GLASS_MODAL_STYLES}>
      <Stack gap="md">
        <MutationErrorAlert />
        <TextInput label={t("colCode")} value={form.code} onChange={(e) => updateField("code", e.currentTarget.value)} required />
        <Select label={t("colDiscountType")} data={discountTypeOptions} value={form.discountType} onChange={(v) => updateField("discountType", v ?? "Percentage")} />
        <NumberInput label={t("colAmount")} value={form.amount} onChange={(v) => updateField("amount", Number(v) || 0)} min={0} />
        <NumberInput label={t("colMinimumSubtotal")} value={form.minimumSubtotal} onChange={(v) => updateField("minimumSubtotal", Number(v) || 0)} min={0} />
        <NumberInput label={t("maximumDiscountAmount")} value={form.maximumDiscountAmount} onChange={(v) => updateField("maximumDiscountAmount", Number(v) || 0)} min={0} />
        <TextInput label={t("startsAt")} type="datetime-local" value={form.startsAt ? form.startsAt.slice(0, 16) : ""} onChange={(e) => updateField("startsAt", e.currentTarget.value)} />
        <TextInput label={t("expiresAt")} type="datetime-local" value={form.expiresAt ? form.expiresAt.slice(0, 16) : ""} onChange={(e) => updateField("expiresAt", e.currentTarget.value)} />
        <Switch label={t("active")} checked={form.isActive} onChange={(e) => updateField("isActive", e.currentTarget.checked)} />
        <StoreFormFooter onCancel={handleClose} onSave={() => void submit()} isSubmitting={isSubmitting} canSubmit={canSubmit} />
      </Stack>
    </Modal>
  );
};

export { UI };
