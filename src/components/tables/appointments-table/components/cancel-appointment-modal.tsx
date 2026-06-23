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
import { notifications } from "@mantine/notifications";
import { IconAlertTriangle, IconX } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import type { AppointmentRow } from "../types";
import { useMirror } from "../store";
import { formatAppointmentTimeRange } from "../utils/format";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  appointment: AppointmentRow | null;
};

/**
 * Confirmation modal for cancelling a blood draw appointment.
 */
const CancelAppointmentModal = ({ isOpen, onClose, appointment }: Props) => {
  const t = useTranslations("admin.bloodDrawAppointments");
  const tc = useTranslations("admin.common");
  const cancelAppointment = useMirror("cancelAppointment");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const label = useMemo(() => {
    if (!appointment) return "";
    const { dateLabel, timeLabel } = formatAppointmentTimeRange(
      appointment.startTime,
      appointment.endTime,
    );
    return t("modalCancelBody", {
      id: appointment.id,
      date: dateLabel,
      time: timeLabel,
    });
  }, [appointment, t]);

  const handleSubmit = async () => {
    if (!appointment) return;
    setIsSubmitting(true);
    try {
      await cancelAppointment(appointment.id);
      notifications.show({ color: "orange", message: t("cancelSuccess") });
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
          <ThemeIcon size={42} radius="md" variant="light" color="orange">
            <IconX size={22} />
          </ThemeIcon>
          <Stack gap={0}>
            <Title order={4}>{t("modalCancelTitle")}</Title>
            <Text size="sm" c="dimmed">
              {t("modalCancelWarning")}
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
        <Alert color="orange" radius="lg" icon={<IconAlertTriangle size={18} />}>
          <Text size="sm">{label}</Text>
        </Alert>
        <Group justify="flex-end">
          <Button variant="default" onClick={onClose} disabled={isSubmitting}>
            {tc("cancel")}
          </Button>
          <Button color="orange" onClick={handleSubmit} loading={isSubmitting}>
            {t("confirmCancel")}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export { CancelAppointmentModal };
