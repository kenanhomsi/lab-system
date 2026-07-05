"use client";

import {
  Anchor,
  Badge,
  Box,
  Button,
  Group,
  Loader,
  Paper,
  Stack,
  Text,
  Title,
  Tooltip,
  ActionIcon,
} from "@mantine/core";
import {
  IconCalendarPlus,
  IconClock,
  IconExternalLink,
  IconMapPin,
  IconPaperclip,
  IconPencil,
  IconUser,
  IconX,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import {
  appointmentStatusColor,
  formatAppointmentTimeRange,
  isEditableStatus,
} from "@/components/tables/appointments-table/utils/format";
import type { Appointment } from "@/modules/appointments";
import { appointmentsClient, locationLabelKey } from "@/modules/appointments";
import { useSyncedSessionUser } from "@/stores/use-synced-session-user";
import { useMirror } from "../store";
import type { TestRequestItem } from "../types";

type ExpandedAppointmentsRowProps = {
  testRequestId: string;
};

const statusLabelKey = (status: string): string => {
  const normalized = status.trim().toLowerCase();
  const map: Record<string, string> = {
    scheduled: "statusScheduled",
    confirmed: "statusConfirmed",
    completed: "statusCompleted",
    pending: "statusPending",
    cancelled: "statusCancelled",
    canceled: "statusCancelled",
  };
  return map[normalized] ?? "statusUnknown";
};

const genderLabelKey = (gender: string): string => {
  const normalized = gender.trim().toLowerCase();
  const map: Record<string, string> = {
    male: "genderMale",
    female: "genderFemale",
    other: "genderOther",
  };
  return map[normalized] ?? gender;
};

const AppointmentCard = ({
  appointment,
  onEdit,
  onCancel,
}: {
  appointment: Appointment;
  onEdit: (appointment: Appointment) => void;
  onCancel: (appointment: Appointment) => void;
}) => {
  const t = useTranslations("admin.testRequests");
  const ta = useTranslations("admin.bloodDrawAppointments");
  const { dateLabel, timeLabel } = formatAppointmentTimeRange(
    appointment.startTime,
    appointment.endTime,
  );
  const statusKey = statusLabelKey(appointment.status || "");
  const locationKey = locationLabelKey(appointment.patientLocationType || "");
  const canManage = isEditableStatus(appointment.status);
  const prescriptionUrl = appointment.attachmentUrl?.trim() || null;

  return (
    <Paper withBorder radius="md" p="md" bg="var(--mantine-color-gray-0)">
      <Stack gap="sm">
        <Group justify="space-between" align="flex-start" wrap="wrap">
          <Group gap="sm" wrap="wrap">
            <Text size="sm" fw={700}>
              {t("detailAppointmentId")} #{appointment.id}
            </Text>
            <Badge
              color={appointmentStatusColor(appointment.status)}
              variant="light"
              radius="sm"
              size="sm"
            >
              {ta(statusKey)}
            </Badge>
            {appointment.patientLocationType ? (
              <Badge variant="outline" color="gray" radius="sm" size="sm" leftSection={<IconMapPin size={12} />}>
                {ta(locationKey)}
              </Badge>
            ) : null}
          </Group>
          {canManage ? (
            <Group gap={4} wrap="nowrap">
              <Tooltip label={ta("editStatus")} withArrow position="top">
                <ActionIcon
                  variant="subtle"
                  color="blue"
                  radius="md"
                  size="md"
                  onClick={(event) => {
                    event.stopPropagation();
                    onEdit(appointment);
                  }}
                >
                  <IconPencil size={15} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label={ta("cancel")} withArrow position="top">
                <ActionIcon
                  variant="subtle"
                  color="orange"
                  radius="md"
                  size="md"
                  onClick={(event) => {
                    event.stopPropagation();
                    onCancel(appointment);
                  }}
                >
                  <IconX size={15} />
                </ActionIcon>
              </Tooltip>
            </Group>
          ) : null}
        </Group>

        <Group gap="lg" wrap="wrap">
          <Group gap={6}>
            <IconClock size={15} />
            <Text size="sm">
              {dateLabel} · {timeLabel}
            </Text>
          </Group>
          {appointment.gender || appointment.age != null ? (
            <Group gap={6}>
              <IconUser size={15} />
              <Text size="sm">
                {[
                  appointment.gender ? ta(genderLabelKey(appointment.gender)) : null,
                  appointment.age != null ? `${appointment.age}y` : null,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </Text>
            </Group>
          ) : null}
        </Group>

        {appointment.notes?.trim() ? (
          <Text size="sm" c="dimmed">
            {appointment.notes}
          </Text>
        ) : null}

        {prescriptionUrl ? (
          <Anchor href={prescriptionUrl} target="_blank" rel="noreferrer" size="sm">
            <Group gap={6}>
              <IconPaperclip size={14} />
              <Text size="sm">{t("openPrescription")}</Text>
              <IconExternalLink size={12} />
            </Group>
          </Anchor>
        ) : null}
      </Stack>
    </Paper>
  );
};

const ExpandedAppointmentsRow = ({ testRequestId }: ExpandedAppointmentsRowProps) => {
  const t = useTranslations("admin.testRequests");
  const ta = useTranslations("appointmentsFeature");
  const { user } = useSyncedSessionUser();
  const testRequestsData = useMirror("testRequestsData");
  const setSelectedTestRequest = useMirror("setSelectedTestRequest");
  const setActiveModal = useMirror("setActiveModal");
  const setSelectedAppointment = useMirror("setSelectedAppointment");
  const setAppointmentActiveModal = useMirror("setAppointmentActiveModal");

  const numericId = Number(testRequestId);
  const testRequest =
    testRequestsData?.items?.find((item: TestRequestItem) => Number(item.id) === numericId) ??
    null;

  const roles = user?.roles?.map((role) => role.toLowerCase()) ?? [];
  const canBookAppointment =
    roles.includes("admin") ||
    roles.includes("doctor") ||
    roles.includes("patient") ||
    roles.includes("secretary");

  const appointmentsQuery = useQuery({
    queryKey: ["test-request-appointments", numericId],
    queryFn: async () => {
      const rows = await appointmentsClient.findAll({ testRequestId: numericId });
      return rows.filter((row) => Number(row.testRequestId) === numericId);
    },
    enabled: Number.isFinite(numericId) && numericId > 0,
  });

  const appointments = appointmentsQuery.data ?? [];

  const openBookModal = () => {
    if (!testRequest) return;
    setSelectedTestRequest(testRequest);
    setActiveModal("appointment");
  };

  const openEditModal = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setAppointmentActiveModal("edit");
  };

  const openCancelModal = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setAppointmentActiveModal("cancel");
  };

  return (
    <Box px="md" py="sm" bg="var(--mantine-color-body)">
      <Stack gap="md">
        <Group justify="space-between" align="center" wrap="wrap">
          <Title order={6}>{t("detailAppointmentSection")}</Title>
          {canBookAppointment ? (
            <Button
              size="xs"
              variant="light"
              color="teal"
              leftSection={<IconCalendarPlus size={14} />}
              onClick={(event) => {
                event.stopPropagation();
                openBookModal();
              }}
              disabled={!testRequest}
            >
              {ta("bookAction")}
            </Button>
          ) : null}
        </Group>

        {appointmentsQuery.isPending ? (
          <Group justify="center" py="md">
            <Loader size="sm" />
          </Group>
        ) : appointments.length === 0 ? (
          <Text size="sm" c="dimmed">
            {t("detailNoAppointment")}
          </Text>
        ) : (
          <Stack gap="sm">
            {appointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onEdit={openEditModal}
                onCancel={openCancelModal}
              />
            ))}
          </Stack>
        )}
      </Stack>
    </Box>
  );
};

export { ExpandedAppointmentsRow };
