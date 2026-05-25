"use client";
import { MutationErrorAlert } from "@/components/ui/mutation-error-alert";

import { Button, Group, Modal, Stack, TextInput, Textarea } from "@mantine/core";
import { useTranslations } from "next-intl";
import { useMirror } from "./store";

const UI = () => {
  const t = useTranslations("admin.medicalTests");
  const tc = useTranslations("admin.common");
  const isOpen = useMirror("isOpen");
  const onClose = useMirror("onClose");
  const nameAr = useMirror("nameAr");
  const setNameAr = useMirror("setNameAr");
  const nameEn = useMirror("nameEn");
  const setNameEn = useMirror("setNameEn");
  const description = useMirror("description");
  const setDescription = useMirror("setDescription");
  const isSubmitting = useMirror("isSubmitting");
  const createMutation = useMirror("createMutation");

  const handleSubmit = async () => {
    if (!nameAr.trim() || !nameEn.trim()) return;

    try {
      await createMutation.mutateAsync({
        nameAr,
        nameEn,
        description,
      });
      onClose();
      setNameAr("");
      setNameEn("");
      setDescription("");
    } catch (error) {
      console.error("Failed to create medical test:", error);
    }
  };

  return (
    <Modal size="xl" opened={isOpen} onClose={onClose} title={t("modalCreateTitle")} centered>
      <Stack>
          <MutationErrorAlert />
        <TextInput
          label={t("nameArLabel")}
          value={nameAr}
          onChange={(e) => setNameAr(e.currentTarget.value)}
          placeholder={t("nameArPlaceholder")}
          required
        />
        <TextInput
          label={t("nameEnLabel")}
          value={nameEn}
          onChange={(e) => setNameEn(e.currentTarget.value)}
          placeholder={t("nameEnPlaceholder")}
          required
        />
        <Textarea
          label={t("fieldDescription")}
          value={description}
          onChange={(e) => setDescription(e.currentTarget.value)}
          placeholder={t("fieldDescriptionPlaceholder")}
          minRows={3}
        />
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={onClose}>
            {tc("cancel")}
          </Button>
          <Button onClick={handleSubmit} loading={isSubmitting || createMutation.isPending}>
            {tc("create")}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export { UI };
