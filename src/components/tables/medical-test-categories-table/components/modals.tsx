"use client";

import { MutationErrorAlert } from "@/components/ui/mutation-error-alert";
import type {
  MedicalTestCategory,
  UpsertMedicalTestCategoryInput,
} from "@/modules/medical-test-categories";
import {
  Button,
  Group,
  Modal,
  NumberInput,
  Stack,
  Switch,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useMirror } from "../store";

const toFormValues = (category: MedicalTestCategory | null): UpsertMedicalTestCategoryInput => ({
  nameAr: category?.nameAr ?? "",
  nameEn: category?.nameEn ?? "",
  description: category?.description ?? "",
  displayOrder: category?.displayOrder ?? 0,
  isActive: category?.isActive ?? true,
});

type FormProps = {
  category: MedicalTestCategory | null;
  onClose: () => void;
};

const CategoryForm = ({ category, onClose }: FormProps) => {
  const t = useTranslations("admin.medicalTestCategories");
  const tc = useTranslations("admin.common");
  const createMutation = useMirror("createMutation");
  const updateMutation = useMirror("updateMutation");
  const [form, setForm] = useState<UpsertMedicalTestCategoryInput>(() => toFormValues(category));
  const isEdit = Boolean(category);

  const canSubmit = useMemo(
    () =>
      form.nameAr.trim().length > 0 &&
      form.nameEn.trim().length > 0 &&
      Number.isFinite(form.displayOrder),
    [form],
  );

  const updateField = <K extends keyof UpsertMedicalTestCategoryInput>(
    key: K,
    value: UpsertMedicalTestCategoryInput[K],
  ) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async () => {
    if (!canSubmit) return;
    const payload: UpsertMedicalTestCategoryInput = {
      nameAr: form.nameAr.trim(),
      nameEn: form.nameEn.trim(),
      description: form.description.trim(),
      displayOrder: Number(form.displayOrder),
      isActive: form.isActive,
    };

    if (category) {
      await updateMutation.mutateAsync({ id: category.id, data: payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
    onClose();
  };

  return (
    <Stack>
      <MutationErrorAlert />
      <TextInput
        label={t("nameArLabel")}
        value={form.nameAr}
        onChange={(event) => updateField("nameAr", event.currentTarget.value)}
        required
      />
      <TextInput
        label={t("nameEnLabel")}
        value={form.nameEn}
        onChange={(event) => updateField("nameEn", event.currentTarget.value)}
        required
      />
      <Textarea
        label={t("descriptionLabel")}
        value={form.description}
        onChange={(event) => updateField("description", event.currentTarget.value)}
        minRows={3}
      />
      <NumberInput
        label={t("displayOrderLabel")}
        value={form.displayOrder}
        onChange={(value) => updateField("displayOrder", Number(value ?? 0))}
      />
      <Switch
        label={t("isActiveLabel")}
        checked={form.isActive}
        onChange={(event) => updateField("isActive", event.currentTarget.checked)}
      />
      <Group justify="flex-end">
        <Button variant="default" onClick={onClose}>
          {tc("cancel")}
        </Button>
        <Button onClick={submit} disabled={!canSubmit}>
          {isEdit ? tc("save") : tc("create")}
        </Button>
      </Group>
    </Stack>
  );
};

const Modals = () => {
  const t = useTranslations("admin.medicalTestCategories");
  const tc = useTranslations("admin.common");
  const activeModal = useMirror("activeModal");
  const setActiveModal = useMirror("setActiveModal");
  const selectedCategory = useMirror("selectedCategory");
  const deleteMutation = useMirror("deleteMutation");

  const close = () => setActiveModal(null);
  const isFormOpen = activeModal === "create" || activeModal === "edit";
  const formCategory = activeModal === "edit" ? selectedCategory : null;

  const deleteSelected = async () => {
    if (!selectedCategory) return;
    await deleteMutation.mutateAsync(selectedCategory.id);
    close();
  };

  return (
    <>
      <Modal
        opened={isFormOpen}
        onClose={close}
        title={activeModal === "edit" ? t("editModalTitle") : t("createModalTitle")}
        centered
      >
        {isFormOpen ? (
          <CategoryForm
            key={`${activeModal}-${formCategory?.id ?? "new"}`}
            category={formCategory}
            onClose={close}
          />
        ) : null}
      </Modal>

      <Modal opened={activeModal === "delete"} onClose={close} title={t("deleteModalTitle")} centered>
        <Stack>
          <MutationErrorAlert />
          <Text size="sm">
            {t("deleteConfirmMessage", {
              name: selectedCategory?.nameEn || selectedCategory?.nameAr || t("deleteFallback"),
            })}
          </Text>
          <Group justify="flex-end">
            <Button variant="default" onClick={close}>
              {tc("cancel")}
            </Button>
            <Button color="red" onClick={deleteSelected} disabled={!selectedCategory}>
              {tc("delete")}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};

export { Modals };
