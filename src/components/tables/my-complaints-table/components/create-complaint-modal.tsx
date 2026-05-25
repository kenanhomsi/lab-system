"use client";

import { Button, FileInput, Modal, Stack, Text, Textarea, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useMirror } from "../store";

type FormValues = {
  title: string;
  description: string;
  attachment: File | null;
};

const CreateComplaintModal = () => {
  const t = useTranslations("myComplaints");
  const isOpen = useMirror("isCreateModalOpen");
  const setIsCreateModalOpen = useMirror("setIsCreateModalOpen");
  const createComplaint = useMirror("createComplaint");
  const isCreating = useMirror("isCreating");
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    initialValues: {
      title: "",
      description: "",
      attachment: null,
    },
    validate: {
      title: (value) => (value.trim() ? null : t("titleRequired")),
      description: (value) => (value.trim() ? null : t("descriptionRequired")),
    },
  });

  const handleClose = () => {
    setError(null);
    form.reset();
    setIsCreateModalOpen(false);
  };

  const handleSubmit = form.onSubmit(async (values) => {
    setError(null);
    try {
      await createComplaint({
        title: values.title.trim(),
        description: values.description.trim(),
        attachment: values.attachment,
      });
      handleClose();
    } catch {
      setError(t("createError"));
    }
  });

  return (
    <Modal
      opened={isOpen}
      onClose={handleClose}
      title={t("modalTitle")}
      radius="lg"
      centered
    >
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <TextInput
            label={t("titleLabel")}
            placeholder={t("titleLabel")}
            {...form.getInputProps("title")}
          />
          <Textarea
            label={t("descriptionLabel")}
            placeholder={t("descriptionLabel")}
            minRows={4}
            {...form.getInputProps("description")}
          />
          <FileInput
            label={t("attachmentLabel")}
            placeholder={t("attachmentPlaceholder")}
            accept="image/*,.pdf,.doc,.docx"
            clearable
            {...form.getInputProps("attachment")}
          />
          {error ? (
            <Text size="sm" c="red">
              {error}
            </Text>
          ) : null}
          <Button type="submit" loading={isCreating} fullWidth>
            {t("submitButton")}
          </Button>
        </Stack>
      </form>
    </Modal>
  );
};

export { CreateComplaintModal };
