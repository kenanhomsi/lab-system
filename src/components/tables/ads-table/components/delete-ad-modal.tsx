"use client";

import {
  Alert,
  Button,
  Group,
  Modal,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { IconAlertTriangle, IconTrash } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import type { AdItem } from "../types";
import { useMirror } from "../store";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  ad: AdItem | null;
};

/**
 * Confirmation modal for deleting an ad.
 */
const DeleteAdModal = ({ isOpen, onClose, ad }: Props) => {
  const t = useTranslations("admin.settings.ads");
  const tc = useTranslations("admin.common");
  const deleteAd = useMirror("deleteAd");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!ad) return;
    setIsSubmitting(true);
    try {
      await deleteAd(ad.id);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={
        <Group gap="sm" wrap="nowrap">
          <ThemeIcon size={42} radius="md" variant="light" color="red">
            <IconTrash size={22} />
          </ThemeIcon>
          <Stack gap={0}>
            <Title order={4}>{t("modalDeleteTitle")}</Title>
            <Text size="sm" c="dimmed">
              {t("modalDeleteWarning")}
            </Text>
          </Stack>
        </Group>
      }
      centered
      size="md"
      radius="lg"
      padding="lg"
      closeOnClickOutside={!isSubmitting}
      closeOnEscape={!isSubmitting}
      overlayProps={{ blur: 10, backgroundOpacity: 0.2 }}
    >
      <Stack gap="lg">
        <Alert color="red" radius="lg" icon={<IconAlertTriangle size={18} />}>
          <Text size="sm">{t("modalDeleteBody", { name: ad?.name ?? "" })}</Text>
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
};

export { DeleteAdModal };
