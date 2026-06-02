"use client";

import { MutationErrorAlert } from "@/components/ui/mutation-error-alert";
import {
  Modal,
  NumberInput,
  Select,
  Stack,
  Switch,
  Textarea,
  TextInput,
} from "@mantine/core";
import { IconCategory } from "@tabler/icons-react";
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
  const category = useMirror("category");
  const form = useMirror("form");
  const categories = useMirror("categories");
  const isSubmitting = useMirror("isSubmitting");
  const canSubmit = useMirror("canSubmit");
  const updateField = useMirror("updateField");
  const handleClose = useMirror("handleClose");
  const submit = useMirror("submit");

  const isEdit = Boolean(category);
  const parentOptions = categories
    .filter((c) => !isEdit || c.id !== category?.id)
    .map((c) => ({ value: String(c.id), label: `${c.nameAr} (${c.nameEn})` }));

  return (
    <Modal
      opened={isOpen}
      onClose={handleClose}
      title={
        <StoreModalHeader
          icon={<IconCategory size={22} />}
          title={isEdit ? t("editCategoryModalTitle") : t("createCategoryModalTitle")}
          subtitle={isEdit ? t("editCategoryModalSubtitle") : t("createCategoryModalSubtitle")}
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
        <TextInput
          label={t("nameAr")}
          value={form.nameAr}
          onChange={(e) => updateField("nameAr", e.currentTarget.value)}
          required
        />
        <TextInput
          label={t("nameEn")}
          value={form.nameEn}
          onChange={(e) => updateField("nameEn", e.currentTarget.value)}
          required
        />
        <Textarea
          label={t("description")}
          value={form.description}
          onChange={(e) => updateField("description", e.currentTarget.value)}
          minRows={2}
        />
        <TextInput
          label={t("imageUrl")}
          value={form.imageUrl}
          onChange={(e) => updateField("imageUrl", e.currentTarget.value)}
          placeholder="https://"
        />
        <Select
          label={t("parentCategory")}
          placeholder={t("noParent")}
          clearable
          data={parentOptions}
          value={form.parentCategoryId != null ? String(form.parentCategoryId) : null}
          onChange={(v) => updateField("parentCategoryId", v ? Number(v) : null)}
        />
        <NumberInput
          label={t("displayOrder")}
          value={form.displayOrder}
          onChange={(v) => updateField("displayOrder", Number(v) || 0)}
          min={0}
        />
        <Switch
          label={t("active")}
          checked={form.isActive}
          onChange={(e) => updateField("isActive", e.currentTarget.checked)}
        />
        <StoreFormFooter
          onCancel={handleClose}
          onSave={() => void submit()}
          isSubmitting={isSubmitting}
          canSubmit={canSubmit}
        />
      </Stack>
    </Modal>
  );
};

export { UI };
