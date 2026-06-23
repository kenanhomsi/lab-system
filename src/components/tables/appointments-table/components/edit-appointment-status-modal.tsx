"use client";

import {
  Alert,
  Button,
  Group,
  Modal,
  Select,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCalendarCheck, IconPencil } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import type { AppointmentAdminStatus } from "@/modules/appointments";
import type { AppointmentRow } from "../types";
import { useMirror } from "../store";
import { formatAppointmentTimeRange } from "../utils/format";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  appointment: AppointmentRow | null;
};

const EDITABLE_STATUSES: AppointmentAdminStatus[] = ["CONFIRMED", "COMPLETED"];

const normalizeEditableStatus = (status?: string): AppointmentAdminStatus => {
  const normalized = status?.trim().toLowerCase() ?? "";
  if (normalized.includes("complete")) return "COMPLETED";
  if (normalized.includes("confirm")) return "CONFIRMED";
  return "CONFIRMED";
};

/**
 * Modal for updating a blood draw appointment status (accept or mark done).
 */
const EditAppointmentStatusModal = ({ isOpen, onClose, appointment }: Props) => {
  const t = useTranslations("admin.bloodDrawAppointments");
  const tc = useTranslations("admin.common");
  const updateAppointmentStatus = useMirror("updateAppointmentStatus");
  const [status, setStatus] = useState<AppointmentAdminStatus>("CONFIRMED");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!appointment) return;
    setStatus(normalizeEditableStatus(appointment.status));
  }, [appointment]);

  const label = useMemo(() => {
    if (!appointment) return "";
    const { dateLabel, timeLabel } = formatAppointmentTimeRange(
      appointment.startTime,
      appointment.endTime,
    );
    return t("modalEditBody", {
      id: appointment.id,
      date: dateLabel,
      time: timeLabel,
    });
  }, [appointment, t]);

  const statusOptions = EDITABLE_STATUSES.map((value) => ({
    value,
    label:
      value === "CONFIRMED"
        ? t("statusConfirmed")
        : t("statusCompleted"),
  }));

  const handleSubmit = async () => {
    if (!appointment) return;
    setIsSubmitting(true);
    try {
      await updateAppointmentStatus({ id: appointment.id, status });
      notifications.show({ color: "teal", message: t("statusUpdateSuccess") });
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
          <ThemeIcon size={42} radius="md" variant="light" color="blue">
            <IconPencil size={22} />
          </ThemeIcon>
          <Stack gap={0}>
            <Title order={4}>{t("modalEditTitle")}</Title>
            <Text size="sm" c="dimmed">
              {t("modalEditSubtitle")}
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
        <Alert color="blue" radius="lg" icon={<IconCalendarCheck size={18} />}>
          <Text size="sm">{label}</Text>
        </Alert>
        <Select
          label={t("statusLabel")}
          data={statusOptions}
          value={status}
          onChange={(value) => setStatus((value as AppointmentAdminStatus) ?? "CONFIRMED")}
          allowDeselect={false}
        />
        <Group justify="flex-end">
          <Button variant="default" onClick={onClose} disabled={isSubmitting}>
            {tc("cancel")}
          </Button>
          <Button color="blue" onClick={handleSubmit} loading={isSubmitting}>
            {t("saveStatus")}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export { EditAppointmentStatusModal };
