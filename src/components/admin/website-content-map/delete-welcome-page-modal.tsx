"use client";

import { Alert, Button, Group, Modal, Stack, Text } from "@mantine/core";
import { IconAlertTriangle } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import type { WelcomePageItem } from "@/types/welcome-page";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  item: WelcomePageItem | null;
  onDelete: (id: number) => Promise<void>;
};

export function DeleteWelcomePageModal({ isOpen, onClose, item, onDelete }: Props) {
  const t = useTranslations("admin.settings.welcomePages");
  const tc = useTranslations("admin.common");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!item) return;
    setIsSubmitting(true);
    try {
      await onDelete(item.id);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal opened={isOpen} onClose={onClose} title={t("modalDeleteTitle")} centered>
      <Stack gap="md">
        <Alert color="red" icon={<IconAlertTriangle size={18} />}>
          <Text size="sm">{t("modalDeleteBody", { name: item?.name ?? "" })}</Text>
        </Alert>
        <Group justify="flex-end">
          <Button variant="default" onClick={onClose} disabled={isSubmitting}>{tc("cancel")}</Button>
          <Button color="red" onClick={handleSubmit} loading={isSubmitting}>{tc("delete")}</Button>
        </Group>
      </Stack>
    </Modal>
  );
}
