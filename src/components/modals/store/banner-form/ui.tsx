"use client";

import { MutationErrorAlert } from "@/components/ui/mutation-error-alert";
import { Modal, NumberInput, Select, Stack, Switch, TextInput } from "@mantine/core";
import { IconLayoutBoard } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import {
  STORE_FORM_MODAL_SIZE,
  STORE_GLASS_MODAL_STYLES,
  STORE_GLASS_OVERLAY_PROPS,
  StoreFormFooter,
  StoreModalHeader,
} from "../shared";
import { useMirror } from "./store";

const UI = () => {
  const t = useTranslations("labStore.admin");
  const isOpen = useMirror("isOpen");
  const banner = useMirror("banner");
  const form = useMirror("form");
  const categories = useMirror("categories");
  const isSubmitting = useMirror("isSubmitting");
  const canSubmit = useMirror("canSubmit");
  const updateField = useMirror("updateField");
  const handleClose = useMirror("handleClose");
  const submit = useMirror("submit");

  const isEdit = Boolean(banner);
  const categoryOptions = categories.map((c) => ({ value: String(c.id), label: `${c.nameAr} (${c.nameEn})` }));

  return (
    <Modal
      opened={isOpen}
      onClose={handleClose}
      title={
        <StoreModalHeader
          icon={<IconLayoutBoard size={22} />}
          title={isEdit ? t("editBannerModalTitle") : t("createBannerModalTitle")}
          subtitle={t("bannersDesc")}
        />
      }
      centered
      size={STORE_FORM_MODAL_SIZE}
      radius="xl"
      padding="lg"
      closeOnClickOutside={!isSubmitting}
      closeOnEscape={!isSubmitting}
      overlayProps={STORE_GLASS_OVERLAY_PROPS}
      styles={STORE_GLASS_MODAL_STYLES}
    >
      <Stack gap="md">
        <MutationErrorAlert />
        <TextInput label={t("colTitle")} value={form.title} onChange={(e) => updateField("title", e.currentTarget.value)} required />
        <TextInput label={t("imageUrl")} value={form.imageUrl} onChange={(e) => updateField("imageUrl", e.currentTarget.value)} placeholder="https://" required />
        <TextInput label={t("linkUrl")} value={form.linkUrl} onChange={(e) => updateField("linkUrl", e.currentTarget.value)} placeholder="https://" />
        <TextInput label={t("colLocation")} value={form.location} onChange={(e) => updateField("location", e.currentTarget.value)} required />
        {categoryOptions.length > 0 ? (
          <Select label={t("categoryId")} placeholder={t("selectCategory")} data={categoryOptions} value={String(form.categoryId)} onChange={(v) => updateField("categoryId", Number(v) || 0)} />
        ) : (
          <NumberInput label={t("categoryId")} value={form.categoryId} onChange={(v) => updateField("categoryId", Number(v) || 0)} min={0} />
        )}
        <NumberInput label={t("displayOrder")} value={form.displayOrder} onChange={(v) => updateField("displayOrder", Number(v) || 0)} min={0} />
        <Switch label={t("active")} checked={form.isActive} onChange={(e) => updateField("isActive", e.currentTarget.checked)} />
        <TextInput label={t("startsAt")} type="datetime-local" value={form.startsAt ?? ""} onChange={(e) => updateField("startsAt", e.currentTarget.value)} />
        <TextInput label={t("endsAt")} type="datetime-local" value={form.endsAt ?? ""} onChange={(e) => updateField("endsAt", e.currentTarget.value)} />
        <StoreFormFooter onCancel={handleClose} onSave={() => void submit()} isSubmitting={isSubmitting} canSubmit={canSubmit} />
      </Stack>
    </Modal>
  );
};

export { UI };
