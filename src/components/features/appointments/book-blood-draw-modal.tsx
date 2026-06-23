"use client";

import {
  appointmentsClient,
  appointmentSlotKey,
  findAppointmentSlotByKey,
  formatAppointmentSlotLabel,
} from "@/modules/appointments";
import { useSyncedSessionUser } from "@/stores/use-synced-session-user";
import {
  Alert,
  Badge,
  Button,
  Group,
  Modal,
  NumberInput,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { notifications } from "@mantine/notifications";
import { IconCalendarEvent, IconCalendarPlus, IconClock, IconMapPin } from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import type { TestRequestItem } from "@/components/tables/test-requests-table/types";

type BookBloodDrawModalProps = {
  opened: boolean;
  onClose: () => void;
  testRequest: TestRequestItem | null;
};

export function BookBloodDrawModal({
  opened,
  onClose,
  testRequest,
}: BookBloodDrawModalProps) {
  const t = useTranslations("appointmentsFeature");
  const queryClient = useQueryClient();
  const { user } = useSyncedSessionUser();
  const [appointmentDate, setAppointmentDate] = useState("");
  const [selectedSlotKey, setSelectedSlotKey] = useState<string | null>(null);
  const [locationType, setLocationType] = useState("lab");
  const [latitude, setLatitude] = useState<number | "">("");
  const [longitude, setLongitude] = useState<number | "">("");
  const [notes, setNotes] = useState("");

  const slotsQuery = useQuery({
    queryKey: ["appointment-day-availability", appointmentDate],
    queryFn: () =>
      appointmentsClient.getDayAvailability({
        date: appointmentDate,
      }),
    enabled: opened && Boolean(appointmentDate),
  });

  const appointmentsQuery = useQuery({
    queryKey: ["appointments", testRequest?.id],
    queryFn: async () => {
      const rows = await appointmentsClient.findAll({ testRequestId: testRequest?.id });
      return rows.filter((row) => Number(row.testRequestId) === Number(testRequest?.id));
    },
    enabled: opened && Boolean(testRequest?.id),
  });

  const slotOptions = useMemo(
    () =>
      (slotsQuery.data ?? []).map((slot) => ({
        value: appointmentSlotKey(slot),
        label: formatAppointmentSlotLabel(slot, t),
      })),
    [slotsQuery.data, t],
  );

  const selectedSlot = findAppointmentSlotByKey(slotsQuery.data ?? [], selectedSlotKey);

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!testRequest || !user?.id || !selectedSlot) {
        throw new Error(t("missingBookingData"));
      }
      return appointmentsClient.create({
        availabilityId: selectedSlot.availabilityId,
        testRequestId: Number(testRequest.id),
        userId: user.id,
        patientLocationType: locationType,
        patientLatitude: latitude === "" ? null : Number(latitude),
        patientLongitude: longitude === "" ? null : Number(longitude),
        notes,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
      });
    },
    onSuccess: async () => {
      notifications.show({ color: "teal", message: t("bookingSuccess") });
      setAppointmentDate("");
      setSelectedSlotKey(null);
      setLatitude("");
      setLongitude("");
      setNotes("");
      await queryClient.invalidateQueries({ queryKey: ["appointments"] });
      onClose();
    },
  });

  const cancelMutation = useMutation({
    mutationFn: (id: number) => appointmentsClient.cancel(id),
    onSuccess: async () => {
      notifications.show({ color: "orange", message: t("cancelSuccess") });
      await queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });

  return (
    <Modal opened={opened} onClose={onClose} centered size={760} radius="xl" padding="lg">
      <Stack gap="lg">
        <Group gap="sm" wrap="nowrap">
          <ThemeIcon size={42} radius="md" variant="light" color="teal">
            <IconCalendarPlus size={22} />
          </ThemeIcon>
          <Stack gap={0}>
            <Title order={4}>{t("bookTitle")}</Title>
            <Text size="sm" c="dimmed">
              {t("bookSubtitle", { id: testRequest?.id ?? "-" })}
            </Text>
          </Stack>
        </Group>

        {createMutation.isError ? (
          <Alert color="red" title={t("bookingFailed")}>
            {createMutation.error instanceof Error
              ? createMutation.error.message
              : t("bookingFailed")}
          </Alert>
        ) : null}

        <Paper withBorder radius="lg" p="md">
          <Stack gap="md">
            <DatePickerInput
              label={t("appointmentDate")}
              withAsterisk
              placeholder={t("selectAppointmentDate")}
              description={t("appointmentDateDesc")}
              value={appointmentDate ? dayjs(appointmentDate).toDate() : null}
              minDate={new Date()}
              leftSection={<IconCalendarEvent size={16} />}
              onChange={(date) => {
                setAppointmentDate(date ? dayjs(date).format("YYYY-MM-DD") : "");
                setSelectedSlotKey(null);
              }}
            />
            <Select
              label={t("availableSlot")}
              placeholder={
                !appointmentDate
                  ? t("selectAppointmentDate")
                  : slotsQuery.isPending
                    ? t("loadingSlots")
                    : t("selectSlot")
              }
              data={slotOptions}
              value={selectedSlotKey}
              onChange={setSelectedSlotKey}
              disabled={!appointmentDate || slotsQuery.isPending || slotsQuery.isError}
              searchable
              leftSection={<IconClock size={16} />}
            />
            {slotsQuery.isError ? <Alert color="red">{t("slotsLoadError")}</Alert> : null}
            {appointmentDate &&
            !slotsQuery.isPending &&
            !slotsQuery.isError &&
            slotOptions.length === 0 ? (
              <Text c="dimmed" size="sm">
                {t("noSlots")}
              </Text>
            ) : null}
            <SimpleGrid cols={{ base: 1, sm: 3 }}>
              <Select
                label={t("locationType")}
                data={[
                  { value: "lab", label: t("locationLab") },
                  { value: "home", label: t("locationHome") },
                  { value: "work", label: t("locationWork") },
                ]}
                value={locationType}
                onChange={(value) => setLocationType(value || "lab")}
                leftSection={<IconMapPin size={16} />}
              />
              <NumberInput
                label={t("latitude")}
                value={latitude}
                onChange={(value) => setLatitude(typeof value === "number" ? value : "")}
                decimalScale={6}
              />
              <NumberInput
                label={t("longitude")}
                value={longitude}
                onChange={(value) => setLongitude(typeof value === "number" ? value : "")}
                decimalScale={6}
              />
            </SimpleGrid>
            <Textarea
              label={t("notes")}
              minRows={3}
              value={notes}
              onChange={(event) => setNotes(event.currentTarget.value)}
            />
            <Group justify="flex-end">
              <Button variant="default" onClick={onClose}>
                {t("close")}
              </Button>
              <Button
                loading={createMutation.isPending}
                disabled={!appointmentDate || !selectedSlotKey || !testRequest?.id || !user?.id}
                onClick={() => createMutation.mutate()}
              >
                {t("confirmBooking")}
              </Button>
            </Group>
          </Stack>
        </Paper>

        <Paper withBorder radius="lg" p="md">
          <Stack gap="sm">
            <Title order={5}>{t("existingAppointments")}</Title>
            {appointmentsQuery.isPending ? <Text c="dimmed">{t("loadingAppointments")}</Text> : null}
            {appointmentsQuery.isError ? <Alert color="red">{t("appointmentsLoadError")}</Alert> : null}
            {!appointmentsQuery.isPending && !appointmentsQuery.data?.length ? (
              <Text c="dimmed" size="sm">
                {t("noAppointments")}
              </Text>
            ) : null}
            {(appointmentsQuery.data ?? []).map((appointment) => (
              <Group key={appointment.id} justify="space-between" wrap="nowrap">
                <Stack gap={2}>
                  <Text fw={700} size="sm">
                    {appointment.startTime} - {appointment.endTime}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {appointment.createdAt ? dayjs(appointment.createdAt).format("YYYY-MM-DD HH:mm") : "-"}
                  </Text>
                </Stack>
                <Group gap="xs" wrap="nowrap">
                  <Badge variant="light">{appointment.status}</Badge>
                  <Button
                    size="xs"
                    color="red"
                    variant="light"
                    loading={cancelMutation.isPending}
                    onClick={() => cancelMutation.mutate(appointment.id)}
                  >
                    {t("cancelAppointment")}
                  </Button>
                </Group>
              </Group>
            ))}
          </Stack>
        </Paper>
      </Stack>
    </Modal>
  );
}
