"use client";

import { Button, Group, Modal, Text } from "@mantine/core";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useMirror } from "../store";

const DeleteConfirmModal = () => {
  const t = useTranslations("admin.insuranceApproval");
  const deleteTargetId = useMirror("deleteTargetId");
  const setDeleteTargetId = useMirror("setDeleteTargetId");
  const removeRequest = useMirror("removeRequest");
  const isDeleting = useMirror("isDeleting");
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    setError(null);
    setDeleteTargetId(null);
  };

  const handleConfirm = async () => {
    if (deleteTargetId === null) return;
    setError(null);
    try {
      await removeRequest(deleteTargetId);
      handleClose();
    } catch {
      setError(t("deleteError"));
    }
  };

  return (
    <Modal
      opened={deleteTargetId !== null}
      onClose={handleClose}
      title={t("deleteConfirmTitle")}
      radius="lg"
      centered
    >
      <Text mb="md">{t("deleteConfirmMessage")}</Text>
      {error ? (
        <Text c="red" size="sm" mb="md">
          {error}
        </Text>
      ) : null}
      <Group justify="flex-end">
        <Button variant="default" onClick={handleClose}>
          {t("cancel")}
        </Button>
        <Button color="red" loading={isDeleting} onClick={() => void handleConfirm()}>
          {t("delete")}
        </Button>
      </Group>
    </Modal>
  );
};

export { DeleteConfirmModal };
