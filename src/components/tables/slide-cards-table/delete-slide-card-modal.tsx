"use client";

import { Alert, Button, Group, Modal, Stack } from "@mantine/core";
import { IconAlertTriangle } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import type { SlideCardItem } from "@/types/slide-card";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  card: SlideCardItem | null;
  onDelete: (id: number) => Promise<void>;
};

/**
 * Confirm deletion of a slide card.
 */
export function DeleteSlideCardModal({ isOpen, onClose, card, onDelete }: Props) {
  const t = useTranslations("admin.settings.slideCards");
  const tc = useTranslations("admin.common");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!card) return;
    setIsSubmitting(true);
    try {
      await onDelete(card.id);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal opened={isOpen} onClose={onClose} title={t("modalDeleteTitle")} centered>
      <Stack gap="md">
        <Alert color="red" icon={<IconAlertTriangle size={18} />}>
          {t("modalDeleteBody", { name: card?.title ?? "" })}
        </Alert>
        <Group justify="flex-end">
          <Button variant="default" onClick={onClose} disabled={isSubmitting}>
            {tc("cancel")}
          </Button>
          <Button color="red" onClick={handleSubmit} loading={isSubmitting}>
            {tc("delete")}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
