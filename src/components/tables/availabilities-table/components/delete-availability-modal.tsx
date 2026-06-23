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
import { useMemo, useState } from "react";
import type { AvailabilityRow } from "../types";
import { useMirror } from "../store";
import { DAY_KEYS, formatTimeCell } from "../utils/format";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  availability: AvailabilityRow | null;
};

/**
 * Confirmation modal for deleting an availability slot.
 */
const DeleteAvailabilityModal = ({ isOpen, onClose, availability }: Props) => {
  const t = useTranslations("admin.availabilities");
  const tc = useTranslations("admin.common");
  const deleteAvailability = useMirror("deleteAvailability");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const label = useMemo(() => {
    if (!availability) return "";
    const dayKey = DAY_KEYS[Math.max(0, Math.min(6, availability.dayOfWeek))];
    return t("modalDeleteBody", {
      day: t(`days.${dayKey}`),
      start: formatTimeCell(availability.startTime),
      end: formatTimeCell(availability.endTime),
    });
  }, [availability, t]);

  const handleSubmit = async () => {
    if (!availability) return;
    setIsSubmitting(true);
    try {
      await deleteAvailability(availability.id);
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
          <Text size="sm">{label}</Text>
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

export { DeleteAvailabilityModal };
