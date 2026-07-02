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
import { IconAlertTriangle, IconCalendarCheck, IconPencil, IconX } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import {
  formatAppointmentTimeRange,
  isEditableStatus,
} from "@/components/tables/appointments-table/utils/format";
import type { Appointment, AppointmentAdminStatus } from "@/modules/appointments";
import { appointmentsClient } from "@/modules/appointments";
import { useMirror } from "../store";

const EDITABLE_STATUSES: AppointmentAdminStatus[] = ["CONFIRMED", "COMPLETED"];

const normalizeEditableStatus = (status?: string): AppointmentAdminStatus => {
  const normalized = status?.trim().toLowerCase() ?? "";
  if (normalized.includes("complete")) return "COMPLETED";
  if (normalized.includes("confirm")) return "CONFIRMED";
  return "CONFIRMED";
};

const invalidateAppointmentQueries = (
  queryClient: ReturnType<typeof useQueryClient>,
  testRequestId?: number | null,
) => {
  void queryClient.invalidateQueries({ queryKey: ["test-request-appointments"] });
  if (testRequestId) {
    void queryClient.invalidateQueries({
      queryKey: ["test-request-appointments", testRequestId],
    });
  }
};

const AppointmentInlineModals = () => {
  const t = useTranslations("admin.bloodDrawAppointments");
  const tc = useTranslations("admin.common");
  const queryClient = useQueryClient();
  const appointmentActiveModal = useMirror("appointmentActiveModal");
  const setAppointmentActiveModal = useMirror("setAppointmentActiveModal");
  const selectedAppointment = useMirror("selectedAppointment") as Appointment | null;
  const setSelectedAppointment = useMirror("setSelectedAppointment");

  const close = () => {
    setAppointmentActiveModal(null);
    setSelectedAppointment(null);
  };

  return (
    <>
      <EditAppointmentInlineModal
        isOpen={appointmentActiveModal === "edit"}
        appointment={selectedAppointment}
        onClose={close}
        onSuccess={() => {
          invalidateAppointmentQueries(queryClient, selectedAppointment?.testRequestId);
          close();
        }}
        t={t}
        tc={tc}
      />
      <CancelAppointmentInlineModal
        isOpen={appointmentActiveModal === "cancel"}
        appointment={selectedAppointment}
        onClose={close}
        onSuccess={() => {
          invalidateAppointmentQueries(queryClient, selectedAppointment?.testRequestId);
          close();
        }}
        t={t}
        tc={tc}
      />
    </>
  );
};

type ModalCopyProps = {
  isOpen: boolean;
  appointment: Appointment | null;
  onClose: () => void;
  onSuccess: () => void;
  t: (key: string, values?: Record<string, string | number>) => string;
  tc: (key: string) => string;
};

const EditAppointmentInlineModal = ({
  isOpen,
  appointment,
  onClose,
  onSuccess,
  t,
  tc,
}: ModalCopyProps) => {
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
    label: value === "CONFIRMED" ? t("statusConfirmed") : t("statusCompleted"),
  }));

  const handleSubmit = async () => {
    if (!appointment || !isEditableStatus(appointment.status)) return;
    setIsSubmitting(true);
    try {
      await appointmentsClient.updateStatus(appointment.id, status);
      notifications.show({ color: "teal", message: t("statusUpdateSuccess") });
      onSuccess();
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

const CancelAppointmentInlineModal = ({
  isOpen,
  appointment,
  onClose,
  onSuccess,
  t,
  tc,
}: ModalCopyProps) => {
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
      await appointmentsClient.cancel(appointment.id);
      notifications.show({ color: "orange", message: t("cancelSuccess") });
      onSuccess();
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

export { AppointmentInlineModals };
