"use client";
import { MutationErrorAlert } from "@/components/ui/mutation-error-alert";

import {
  Alert,
  Button,
  Checkbox,
  Divider,
  Group,
  Box,
  Modal,
  NumberInput,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Stepper,
  Text,
  TextInput,
  Textarea,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import dayjs from "dayjs";
import {
  IconCalendarEvent,
  IconCurrencyDollar,
  IconFlask2,
  IconMapPin,
  IconPlus,
  IconUsers,
} from "@tabler/icons-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { useMirror } from "./store";
import type { MedicalTestItem } from "@/components/tables/medical-tests-table/types";
import { buildTestRequestPartyPayload, isStaffPartyUser, resolveClinicalPartyKind } from "../party-ids";
import {
  useExternalPatientsForSelectQuery,
  useMedicalTestsForSelectQuery,
} from "../use-test-request-lookups";
import { toRequestDateIso } from "@/modules/TestRequests/abstraction/request-date-iso";
import { useSyncedSessionUser } from "@/stores/use-synced-session-user";
import {
  appointmentsClient,
  appointmentSlotKey,
  findAppointmentSlotByKey,
  formatAppointmentSlotLabel,
} from "@/modules/appointments";
import { useQuery } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { OsmLocationPickerDynamic } from "@/components/maps/osm-location-picker-dynamic";

const INITIAL_FORM = {
  medicalTestIds: [] as number[],
  requestDate: "",
  status: "pending",
  totalAmount: 0,
  notes: "",
  metadata: "",
  doctorId: "",
  labClientId: "",
  directPatientId: "",
  externalPatientId: 0,
};

function extractCreatedTestRequestId(payload: unknown): number | null {
  const visit = (value: unknown): number | null => {
    if (!value || typeof value !== "object") return null;
    if (Array.isArray(value)) {
      for (const item of value) {
        const id = visit(item);
        if (id) return id;
      }
      return null;
    }
    const record = value as Record<string, unknown>;
    const rawId = record.id;
    if (typeof rawId === "number" && Number.isFinite(rawId)) return rawId;
    if (typeof rawId === "string" && rawId.trim() && Number.isFinite(Number(rawId))) {
      return Number(rawId);
    }
    return visit(record.data) ?? visit(record.items) ?? visit(record.results);
  };

  return visit(payload);
}

function medicalTestLabel(item: MedicalTestItem, locale: string): string {
  if (locale.startsWith("ar")) {
    return item.nameAr.trim() || item.nameEn.trim() || `#${item.id}`;
  }
  return item.nameEn.trim() || item.nameAr.trim() || `#${item.id}`;
}

function priceForMedicalTestId(id: number, items: MedicalTestItem[]): number {
  if (id <= 0) return 0;
  const row = items.find((t) => t.id === id);
  return row && Number.isFinite(row.price) ? row.price : 0;
}

function totalPriceForMedicalTestIds(ids: number[], items: MedicalTestItem[]): number {
  return ids.reduce((sum, id) => sum + priceForMedicalTestId(id, items), 0);
}

const CreateTestRequestForm = () => {
  const t = useTranslations("admin.testRequests");
  const tc = useTranslations("admin.common");
  const ta = useTranslations("appointmentsFeature");
  const props = useMirror("props") as { opened?: boolean; onClose?: () => void };
  const locale = useLocale();

  const submitAction = useMirror("submitAction") as (p: {
    medicalTestIds: number[];
    requestDate: string;
    status: string;
    totalAmount: number;
    notes: string;
    metadata: string;
    doctorId: string | null;
    labClientId: string | null;
    directPatientId: string | null;
    externalPatientId: number | null;
  }) => Promise<unknown>;

  const opened = Boolean(props.opened);

  const [form, setForm] = useState(INITIAL_FORM);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [selectedSlotKey, setSelectedSlotKey] = useState<string | null>(null);
  const [locationType, setLocationType] = useState("lab");
  const [latitude, setLatitude] = useState<number | "">("");
  const [longitude, setLongitude] = useState<number | "">("");
  const [appointmentNotes, setAppointmentNotes] = useState("");
  const [createdTestRequestId, setCreatedTestRequestId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const onClose = props.onClose || (() => undefined);

  const medicalTestsQuery = useMedicalTestsForSelectQuery(opened);
  const externalPatientsQuery = useExternalPatientsForSelectQuery(opened);
  const { user: sessionUser, isSessionLoading, isUnauthenticated, status } =
    useSyncedSessionUser();
  const slotsQuery = useQuery({
    queryKey: ["appointment-day-availability", appointmentDate],
    queryFn: () =>
      appointmentsClient.getDayAvailability({
        date: appointmentDate,
      }),
    enabled: opened && Boolean(appointmentDate),
  });

  useEffect(() => {
    if (!opened) {
      setActiveStep(0);
      setForm({ ...INITIAL_FORM });
      setAppointmentDate("");
      setSelectedSlotKey(null);
      setLocationType("lab");
      setLatitude("");
      setLongitude("");
      setAppointmentNotes("");
      setCreatedTestRequestId(null);
    }
  }, [opened]);

  useEffect(() => {
    const items = medicalTestsQuery.data;
    if (!items?.length) return;
    setForm((prev) => {
      if (prev.medicalTestIds.length === 0) return prev;
      const total = totalPriceForMedicalTestIds(prev.medicalTestIds, items);
      return prev.totalAmount === total ? prev : { ...prev, totalAmount: total };
    });
  }, [medicalTestsQuery.data]);

  const medicalTestOptions = useMemo(() => {
    const items = medicalTestsQuery.data ?? [];
    return items.map((row) => ({
      value: String(row.id),
      label: medicalTestLabel(row, locale),
    }));
  }, [medicalTestsQuery.data, locale]);

  const externalPatientOptions = useMemo(() => {
    const rows = externalPatientsQuery.data ?? [];
    return rows.map((p) => ({
      value: String(p.id),
      label: `${p.fullName}${p.externalId ? ` (${p.externalId})` : ""}`,
    }));
  }, [externalPatientsQuery.data]);

  const hasUserId = Boolean(sessionUser?.id?.trim());
  const partyKind = resolveClinicalPartyKind(sessionUser?.roles);

  const showStaffPartyFields = Boolean(
    hasUserId && isStaffPartyUser(sessionUser?.roles),
  );

  const showExternalPatientField = Boolean(
    hasUserId && (partyKind === "lab" || isStaffPartyUser(sessionUser?.roles)),
  );

  const isRequestDetailsValid =
    Boolean(form.requestDate.trim()) && form.medicalTestIds.length > 0;

  const selectedSlot = findAppointmentSlotByKey(slotsQuery.data ?? [], selectedSlotKey);
  const isHomeCollection = locationType === "home";
  const selectedLocation = useMemo(
    () =>
      latitude !== "" && longitude !== ""
        ? { lat: Number(latitude), lng: Number(longitude) }
        : null,
    [latitude, longitude],
  );
  const isAppointmentStepValid =
    Boolean(appointmentDate.trim()) &&
    Boolean(selectedSlot && sessionUser?.id?.trim()) &&
    (!isHomeCollection || Boolean(selectedLocation));
  const canSubmitCreate =
    isAppointmentStepValid && hasUserId && (Boolean(createdTestRequestId) || isRequestDetailsValid);

  const isLastStep = activeStep === 1;

  const handleClose = () => {
    setActiveStep(0);
    onClose();
  };

  const buildPayload = (): {
    medicalTestIds: number[];
    requestDate: string;
    status: string;
    totalAmount: number;
    notes: string;
    metadata: string;
    doctorId: string | null;
    labClientId: string | null;
    directPatientId: string | null;
    externalPatientId: number | null;
  } | null => {
    if (!sessionUser) return null;
    const userId = sessionUser.id.trim();
    if (!userId) return null;
    const party = buildTestRequestPartyPayload({
      userId,
      roles: sessionUser.roles,
      formDoctorId: form.doctorId,
      formLabClientId: form.labClientId,
      formDirectPatientId: form.directPatientId,
    });
    return {
      medicalTestIds: form.medicalTestIds,
      requestDate: toRequestDateIso(form.requestDate),
      status: "pending",
      totalAmount: form.totalAmount,
      notes: form.notes,
      metadata: locationType,
      externalPatientId: form.externalPatientId > 0 ? form.externalPatientId : null,
      ...party,
    };
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={
        <Group gap="sm" wrap="nowrap">
          <ThemeIcon size={42} radius="md" variant="light" color="blue">
            <IconPlus size={22} />
          </ThemeIcon>
          <Stack gap={0}>
            <Title order={4}>{t("createModalTitle")}</Title>
            <Text size="sm" c="dimmed">
              {t("createModalSubtitle")}
            </Text>
          </Stack>
        </Group>
      }
      centered
      size={760}
      radius="xl"
      padding="lg"
      overlayProps={{ blur: 10, backgroundOpacity: 0.2 }}
      styles={{
        content: {
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          background: "light-dark(rgba(255,255,255,0.82), rgba(18,18,23,0.78))",
          border: "1px solid light-dark(rgba(0,0,0,0.08), rgba(255,255,255,0.09))",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
      }}
    >
      <Stack gap="lg">
        <MutationErrorAlert />
        <Stepper
          className="mt-1"
          active={activeStep}
          onStepClick={setActiveStep}
          allowNextStepsSelect={false}
        >
          <Stepper.Step label={t("step1Label")} description={t("step1RequestDetails")}>
            <Paper withBorder radius="lg" p="md">
              <Stack gap="md">
                <MutationErrorAlert />
                <Group justify="space-between" wrap="nowrap">
                  <Title order={5}>{ta("collectionDetails")}</Title>
                  <Text size="xs" c="dimmed">
                    {t("requiredFieldsHint")}
                  </Text>
                </Group>
                <Divider />
                {isUnauthenticated ? (
                  <Alert color="red" title={t("alertNotSignedInTitle")}>
                    {t("alertNotSignedInCreate")}
                  </Alert>
                ) : null}
                {status === "authenticated" && !isSessionLoading && !hasUserId ? (
                  <Alert color="orange" title={t("alertSessionTitle")}>
                    {t("alertSessionBody")}
                  </Alert>
                ) : null}
                <DatePickerInput
                  label={ta("appointmentDate")}
                  withAsterisk
                  placeholder={ta("selectAppointmentDate")}
                  description={ta("appointmentDateDesc")}
                  value={appointmentDate ? dayjs(appointmentDate).toDate() : null}
                  minDate={new Date()}
                  leftSection={<IconCalendarEvent size={16} />}
                  onChange={(date) => {
                    setAppointmentDate(date ? dayjs(date).format("YYYY-MM-DD") : "");
                    setSelectedSlotKey(null);
                  }}
                />
                <Select
                  label={ta("availableSlot")}
                  placeholder={
                    !appointmentDate
                      ? ta("selectAppointmentDate")
                      : slotsQuery.isPending
                        ? ta("loadingSlots")
                        : ta("selectSlot")
                  }
                  data={(slotsQuery.data ?? []).map((slot) => ({
                    value: appointmentSlotKey(slot),
                    label: formatAppointmentSlotLabel(slot, ta),
                  }))}
                  value={selectedSlotKey}
                  onChange={setSelectedSlotKey}
                  disabled={!appointmentDate || slotsQuery.isPending || slotsQuery.isError}
                  searchable
                  withAsterisk
                  leftSection={<IconCalendarEvent size={16} />}
                />
                {slotsQuery.isError ? (
                  <Alert color="red">{ta("slotsLoadError")}</Alert>
                ) : null}
                {appointmentDate &&
                !slotsQuery.isPending &&
                !slotsQuery.isError &&
                (slotsQuery.data ?? []).length === 0 ? (
                  <Text size="sm" c="dimmed">
                    {ta("noSlots")}
                  </Text>
                ) : null}
                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" verticalSpacing="md">
                  <Select
                    label={ta("locationType")}
                    data={[
                      { value: "lab", label: ta("locationLab") },
                      { value: "home", label: ta("locationHome") },
                      { value: "work", label: ta("locationWork") },
                    ]}
                    value={locationType}
                    onChange={(value) => {
                      const nextValue = value || "lab";
                      setLocationType(nextValue);
                      if (nextValue !== "home") {
                        setLatitude("");
                        setLongitude("");
                      }
                    }}
                    withAsterisk
                    leftSection={<IconMapPin size={16} />}
                  />
                  <Textarea
                    label={ta("notes")}
                    autosize
                    minRows={2}
                    placeholder={ta("collectionNotesPlaceholder")}
                    value={appointmentNotes}
                    onChange={(event) => setAppointmentNotes(event.currentTarget.value)}
                  />
                </SimpleGrid>
                {isHomeCollection ? (
                  <Stack gap="sm">
                    <Stack gap={2}>
                      <Text size="sm" fw={600}>
                        {ta("collectionMapLabel")}
                        <Text span c="red">
                          {" "}
                          *
                        </Text>
                      </Text>
                      <Text size="xs" c="dimmed">
                        {ta("collectionMapDescription")}
                      </Text>
                    </Stack>
                    <OsmLocationPickerDynamic
                      value={selectedLocation}
                      onChange={(next) => {
                        setLatitude(next.lat);
                        setLongitude(next.lng);
                      }}
                    />
                    {selectedLocation ? (
                      <Text size="xs" c="dimmed">
                        {ta("selectedCoordinates", {
                          lat: selectedLocation.lat.toFixed(5),
                          lng: selectedLocation.lng.toFixed(5),
                        })}
                      </Text>
                    ) : (
                      <Text size="xs" c="red">
                        {ta("mapRequired")}
                      </Text>
                    )}
                  </Stack>
                ) : null}
                {createdTestRequestId ? (
                  <Alert color="yellow">{ta("retryAppointmentHint")}</Alert>
                ) : null}
              </Stack>
            </Paper>
          </Stepper.Step>

          <Stepper.Step label={t("step2Label")} description={t("step2NotesMeta")}>
            <Paper withBorder radius="lg" p="md">
              <Stack gap="md">
                <MutationErrorAlert />
                <Group justify="space-between" wrap="nowrap">
                  <Title order={5}>{t("requestDetailsTitle")}</Title>
                  <Text size="xs" c="dimmed">
                    {t("requiredFieldsHint")}
                  </Text>
                </Group>
                <Divider />
                {medicalTestsQuery.isError ? (
                  <Alert color="red" title={t("alertMedicalTestsTitle")}>
                    {t("alertMedicalTestsBody")}
                  </Alert>
                ) : null}
                {!medicalTestsQuery.isPending &&
                  !medicalTestsQuery.isError &&
                  medicalTestOptions.length === 0 ? (
                  <Text size="sm" c="dimmed">
                    {t("noMedicalTestsCreate")}
                  </Text>
                ) : null}
                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" verticalSpacing="md">
                  <Box style={{ gridColumn: "1 / -1" }}>
                    <Stack gap={4}>
                      <Group gap={6} wrap="nowrap">
                        <ThemeIcon size={28} radius="md" variant="light" color="blue">
                          <IconFlask2 size={16} />
                        </ThemeIcon>
                        <Text size="sm" fw={500}>
                          {t("fieldMedicalTest")}
                          <Text span c="red">
                            {" "}
                            *
                          </Text>
                        </Text>
                      </Group>
                      <Text size="xs" c="dimmed">
                        {t("fieldMedicalTestDesc")}
                      </Text>
                      <Paper withBorder radius="md" p="sm">
                        <Checkbox.Group
                          value={form.medicalTestIds.map(String)}
                          onChange={(values) => {
                            const nextIds = values.map(Number);
                            const items = medicalTestsQuery.data ?? [];
                            setForm({
                              ...form,
                              medicalTestIds: nextIds,
                              totalAmount: totalPriceForMedicalTestIds(nextIds, items),
                            });
                          }}
                        >
                          <Stack gap="sm">
                            {medicalTestOptions.map((opt) => (
                              <Checkbox
                                key={opt.value}
                                value={opt.value}
                                label={opt.label}
                                disabled={
                                  medicalTestsQuery.isPending || medicalTestsQuery.isError
                                }
                              />
                            ))}
                          </Stack>
                        </Checkbox.Group>
                      </Paper>
                    </Stack>
                  </Box>
                  <DatePickerInput
                    label={t("fieldRequestDate")}
                    withAsterisk
                    placeholder={t("datePlaceholder")}
                    description={t("fieldRequestDateDescCreate")}
                    value={form.requestDate ? dayjs(form.requestDate).toDate() : null}
                    leftSection={<IconCalendarEvent size={16} />}
                    onChange={(date) =>
                      setForm({ ...form, requestDate: date ? dayjs(date).format("YYYY-MM-DD") : "" })
                    }
                  />
                  <NumberInput
                    label={t("fieldTotalAmount")}
                    min={0}
                    decimalScale={2}
                    fixedDecimalScale
                    thousandSeparator=","
                    description={t("fieldTotalAmountDescCreate")}
                    value={form.totalAmount}
                    readOnly
                    leftSection={<IconCurrencyDollar size={16} />}
                  />
                  {showExternalPatientField && (
                    <Select
                      label={t("fieldExternalPatient")}
                      searchable
                      clearable
                      placeholder={
                        externalPatientsQuery.isPending
                          ? t("placeholderLoadingPatients")
                          : t("placeholderExternalPatient")
                      }
                      description={t("fieldExternalPatientDesc")}
                      data={externalPatientOptions}
                      leftSection={<IconUsers size={16} />}
                      disabled={externalPatientsQuery.isPending || externalPatientsQuery.isError}
                      value={
                        form.externalPatientId > 0
                          ? String(form.externalPatientId)
                          : null
                      }
                      onChange={(v) =>
                        setForm({
                          ...form,
                          externalPatientId: v ? Number(v) : 0,
                        })
                      }
                    />
                  )}
                  {showStaffPartyFields && (
                    <>
                      <TextInput
                        label={t("fieldDoctorId")}
                        placeholder={t("placeholderDoctorId")}
                        value={form.doctorId}
                        onChange={(e) =>
                          setForm({ ...form, doctorId: e.currentTarget.value })
                        }
                      />
                      <TextInput
                        label={t("fieldLabClientId")}
                        placeholder={t("placeholderLabClientId")}
                        value={form.labClientId}
                        onChange={(e) =>
                          setForm({ ...form, labClientId: e.currentTarget.value })
                        }
                      />
                      <TextInput
                        label={t("fieldDirectPatientId")}
                        placeholder={t("placeholderDirectPatientId")}
                        value={form.directPatientId}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            directPatientId: e.currentTarget.value,
                          })
                        }
                      />
                    </>
                  )}
                </SimpleGrid>
                <Textarea
                  label={t("fieldNotes")}
                  autosize
                  minRows={3}
                  maxRows={8}
                  placeholder={t("notesPlaceholder")}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.currentTarget.value })}
                />
              </Stack>
            </Paper>
          </Stepper.Step>
        </Stepper>

        <Group justify="space-between" wrap="nowrap">
          <Button
            variant="subtle"
            color="gray"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            {tc("cancel")}
          </Button>
          <Group gap="sm" wrap="nowrap">
            {activeStep > 0 && (
              <Button
                variant="default"
                onClick={() => setActiveStep((prev) => prev - 1)}
                disabled={isSubmitting}
              >
                {tc("back")}
              </Button>
            )}
            {!isLastStep ? (
              <Button
                radius="md"
                onClick={() => setActiveStep(1)}
                disabled={!isAppointmentStepValid || isSubmitting}
              >
                {tc("next")}
              </Button>
            ) : (
              <Button
                radius="md"
                loading={isSubmitting}
                disabled={!canSubmitCreate}
                onClick={async () => {
                  const payload = createdTestRequestId ? null : buildPayload();
                  if (!createdTestRequestId && !payload) return;
                  if (!selectedSlot || !sessionUser?.id) return;
                  let savedRequestIdForRetry = createdTestRequestId;
                  setIsSubmitting(true);
                  try {
                    let testRequestId = createdTestRequestId;
                    if (!testRequestId && payload) {
                      const result = await submitAction(payload);
                      testRequestId = extractCreatedTestRequestId(result);
                      if (!testRequestId) {
                        throw new Error(ta("missingBookingData"));
                      }
                      savedRequestIdForRetry = testRequestId;
                      setCreatedTestRequestId(testRequestId);
                    }
                    if (!testRequestId) {
                      throw new Error(ta("missingBookingData"));
                    }
                    await appointmentsClient.create({
                      availabilityId: selectedSlot.availabilityId,
                      testRequestId,
                      userId: sessionUser.id,
                      patientLocationType: locationType,
                      patientLatitude: isHomeCollection && selectedLocation ? selectedLocation.lat : null,
                      patientLongitude: isHomeCollection && selectedLocation ? selectedLocation.lng : null,
                      notes: appointmentNotes,
                      startTime: selectedSlot.startTime,
                      endTime: selectedSlot.endTime,
                    });
                    handleClose();
                  } catch (error) {
                    notifications.show({
                      color: "red",
                      title: ta("bookingFailed"),
                      message:
                        savedRequestIdForRetry
                          ? ta("retryAppointmentHint")
                          : error instanceof Error
                            ? error.message
                            : ta("bookingFailed"),
                    });
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
              >
                {tc("create")}
              </Button>
            )}
          </Group>
        </Group>
      </Stack>
    </Modal >
  );
};

export { CreateTestRequestForm };
