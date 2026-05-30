"use client";
import { MutationErrorAlert } from "@/components/ui/mutation-error-alert";

import {
  Alert,
  Button,
  Divider,
  Group,
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
  IconEdit,
  IconFileDescription,
  IconFlask2,
  IconInfoCircle,
  IconUsers,
} from "@tabler/icons-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import type { MedicalTestItem } from "@/components/tables/medical-tests-table/types";
import { buildTestRequestPartyPayload, isStaffPartyUser, resolveClinicalPartyKind } from "../party-ids";
import {
  useExternalPatientsForSelectQuery,
  useMedicalTestsForSelectQuery,
} from "../use-test-request-lookups";
import { toRequestDateIso } from "@/modules/TestRequests/abstraction/request-date-iso";
import { useSyncedSessionUser } from "@/stores/use-synced-session-user";
import { useMirror } from "./store";

function toDateInputValue(raw: string): string {
  if (!raw.trim()) return "";
  if (raw.includes("T")) return raw.slice(0, 10);
  return raw.slice(0, 10);
}

function medicalTestLabel(item: MedicalTestItem, locale: string): string {
  if (locale.startsWith("ar")) {
    return item.nameAr.trim() || item.nameEn.trim() || `#${item.id}`;
  }
  return item.nameEn.trim() || item.nameAr.trim() || `#${item.id}`;
}

type TestRequestInitial = {
  id: number;
  medicalTestId?: number;
  tests?: Array<{ medicalTestId: number; medicalTestNameEn?: string | null }>;
  medicalTestNameEn?: string | null;
  requestDate: string;
  status: string;
  totalAmount: number;
  notes: string;
  metadata: string;
  doctorId: string | number | null;
  labClientId: string | null;
  directPatientId: string | number | null;
  externalPatientId?: number | null;
};

function resolveMedicalTestId(initial?: TestRequestInitial | null): number {
  if (!initial) return 0;
  if (initial.medicalTestId != null && initial.medicalTestId > 0) {
    return initial.medicalTestId;
  }
  const fromTests = initial.tests?.[0]?.medicalTestId;
  return fromTests != null && fromTests > 0 ? fromTests : 0;
}

function resolveMedicalTestLabel(
  initial: TestRequestInitial | null | undefined,
): string {
  if (!initial) return "";
  const top = initial.medicalTestNameEn?.trim();
  if (top) return top;
  const nested = initial.tests?.[0]?.medicalTestNameEn?.trim();
  if (nested) return nested;
  const id = resolveMedicalTestId(initial);
  return id > 0 ? `#${id}` : "";
}

const buildInitialForm = (initial?: TestRequestInitial | null) => ({
  id: initial ? String(initial.id) : "",
  medicalTestId: resolveMedicalTestId(initial),
  requestDate: toDateInputValue(initial?.requestDate ?? ""),
  status: initial?.status ?? "pending",
  totalAmount: initial?.totalAmount ?? 0,
  notes: initial?.notes ?? "",
  metadata: initial?.metadata ?? "",
  doctorId:
    initial?.doctorId != null && String(initial.doctorId).trim()
      ? String(initial.doctorId)
      : "",
  labClientId: initial?.labClientId ?? "",
  directPatientId:
    initial?.directPatientId != null && String(initial.directPatientId).trim()
      ? String(initial.directPatientId)
      : "",
  externalPatientId:
    initial?.externalPatientId != null &&
      Number.isFinite(Number(initial.externalPatientId))
      ? Number(initial.externalPatientId)
      : 0,
});

const UI = () => {
  const t = useTranslations("admin.testRequests");
  const props = useMirror("props") as {
    opened?: boolean;
    onClose?: () => void;
    testRequest?: TestRequestInitial | null;
  };

  const locale = useLocale();
  const opened = Boolean(props.opened);

  const submitAction = useMirror("submitAction") as (p: {
    id: string;
    medicalTestId: number;
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

  const onClose = props.onClose || (() => undefined);
  const initial = props.testRequest;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="sm" wrap="nowrap">
          <ThemeIcon size={42} radius="md" variant="light" color="blue">
            <IconEdit size={22} />
          </ThemeIcon>
          <Stack gap={0}>
            <Title order={4}>{t("editModalTitle")}</Title>
            <Text size="sm" c="dimmed">
              {t("editModalSubtitle")}
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
        body: {
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
      }}
    >
      <EditTestRequestBody
        key={initial?.id ?? "empty"}
        opened={opened}
        initial={initial}
        onClose={onClose}
        submitAction={submitAction}
        locale={locale}
      />
    </Modal>
  );
};

const EditTestRequestBody = ({
  opened,
  initial,
  onClose,
  submitAction,
  locale,
}: {
  opened: boolean;
  initial?: TestRequestInitial | null;
  onClose: () => void;
  submitAction: (p: {
    id: string;
    medicalTestId: number;
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
  locale: string;
}) => {
  const t = useTranslations("admin.testRequests");
  const tc = useTranslations("admin.common");
  const [form, setForm] = useState(() => buildInitialForm(initial));
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setForm(buildInitialForm(initial));
  }, [initial]);

  useEffect(() => {
    if (!opened) {
      setActiveStep(0);
    }
  }, [opened]);

  const medicalTestsQuery = useMedicalTestsForSelectQuery(opened);
  const externalPatientsQuery = useExternalPatientsForSelectQuery(opened);
  const { user: sessionUser, isSessionLoading, isUnauthenticated, status } =
    useSyncedSessionUser();

  const hasUserId = Boolean(sessionUser?.id?.trim());

  const medicalTestOptions = useMemo(() => {
    const items = medicalTestsQuery.data ?? [];
    const options = items.map((row) => ({
      value: String(row.id),
      label: medicalTestLabel(row, locale),
    }));

    const selectedId = form.medicalTestId;
    if (
      selectedId > 0 &&
      !options.some((option) => option.value === String(selectedId))
    ) {
      options.unshift({
        value: String(selectedId),
        label: resolveMedicalTestLabel(initial),
      });
    }

    return options;
  }, [medicalTestsQuery.data, locale, form.medicalTestId, initial]);

  const externalPatientOptions = useMemo(() => {
    const rows = externalPatientsQuery.data ?? [];
    return rows.map((p) => ({
      value: String(p.id),
      label: `${p.fullName}${p.externalId ? ` (${p.externalId})` : ""}`,
    }));
  }, [externalPatientsQuery.data]);

  const partyKind = resolveClinicalPartyKind(sessionUser?.roles);

  const showStaffPartyFields = Boolean(
    hasUserId && isStaffPartyUser(sessionUser?.roles),
  );

  const showExternalPatientField = Boolean(
    hasUserId && (partyKind === "lab" || isStaffPartyUser(sessionUser?.roles)),
  );

  const payloadOrNull = hasUserId && sessionUser
    ? (() => {
      const party = buildTestRequestPartyPayload({
        userId: sessionUser.id,
        roles: sessionUser.roles,
        formDoctorId: form.doctorId,
        formLabClientId: form.labClientId,
        formDirectPatientId: form.directPatientId,
      });
      return {
        id: form.id,
        medicalTestId: form.medicalTestId,
        requestDate: toRequestDateIso(form.requestDate),
        status: form.status,
        totalAmount: form.totalAmount,
        notes: form.notes,
        metadata: form.metadata,
        externalPatientId:
          form.externalPatientId > 0 ? form.externalPatientId : null,
        ...party,
      };
    })()
    : null;

  const isStepOneValid = Boolean(
    form.id && form.medicalTestId > 0 && form.requestDate.trim(),
  );

  const canSave = isStepOneValid && hasUserId && Boolean(payloadOrNull);

  const isLastStep = activeStep === 1;

  const handleClose = () => {
    setActiveStep(0);
    onClose();
  };

  return (
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
                <Title order={5}>{t("requestDetailsTitle")}</Title>
                <Text size="xs" c="dimmed">
                  {t("requiredFieldsHint")}
                </Text>
              </Group>
              <Divider />
              {isUnauthenticated ? (
                <Alert color="red" title={t("alertNotSignedInTitle")}>
                  {t("alertNotSignedInEdit")}
                </Alert>
              ) : null}
              {status === "authenticated" && !isSessionLoading && !hasUserId ? (
                <Alert color="orange" title={t("alertSessionTitle")}>
                  {t("alertSessionBody")}
                </Alert>
              ) : null}
              {medicalTestsQuery.isError ? (
                <Alert color="red" title={t("alertMedicalTestsTitle")}>
                  {t("alertMedicalTestsBody")}
                </Alert>
              ) : null}
              {!medicalTestsQuery.isPending &&
                !medicalTestsQuery.isError &&
                medicalTestOptions.length === 0 ? (
                <Text size="sm" c="dimmed">
                  {t("noMedicalTestsEdit")}
                </Text>
              ) : null}
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" verticalSpacing="md">
                <Select
                  label={t("fieldMedicalTest")}
                  withAsterisk
                  searchable
                  allowDeselect={false}
                  clearable={false}
                  placeholder={
                    medicalTestsQuery.isPending
                      ? t("placeholderLoadingTests")
                      : t("placeholderChooseTest")
                  }
                  description={t("fieldMedicalTestDesc")}
                  data={medicalTestOptions}
                  leftSection={<IconFlask2 size={16} />}
                  disabled={medicalTestsQuery.isPending || medicalTestsQuery.isError}
                  value={form.medicalTestId > 0 ? String(form.medicalTestId) : null}
                  onChange={(v) =>
                    setForm({ ...form, medicalTestId: v ? Number(v) : 0 })
                  }
                />
                <DatePickerInput
                  label={t("fieldRequestDate")}
                  withAsterisk
                  placeholder={t("datePlaceholder")}
                  description={t("fieldRequestDateDescEdit")}
                  value={form.requestDate ? dayjs(form.requestDate).toDate() : null}
                  leftSection={<IconCalendarEvent size={16} />}
                  onChange={(date) =>
                    setForm({ ...form, requestDate: date ? dayjs(date).format("YYYY-MM-DD") : "" })
                  }
                />
                <Select
                  label={t("fieldStatus")}
                  data={[
                    { label: t("statusPending"), value: "pending" },
                    { label: t("statusInProgress"), value: "in_progress" },
                    { label: t("statusCompleted"), value: "completed" },
                    { label: t("statusCancelled"), value: "cancelled" },
                  ]}
                  description={t("fieldStatusDesc")}
                  leftSection={<IconInfoCircle size={16} />}
                  value={form.status}
                  searchable
                  allowDeselect={false}
                  onChange={(v) => setForm({ ...form, status: v ?? form.status })}
                />
                <NumberInput
                  label={t("fieldTotalAmount")}
                  min={0}
                  decimalScale={2}
                  fixedDecimalScale
                  thousandSeparator=","
                  hideControls
                  description={t("fieldTotalAmountDescEdit")}
                  value={form.totalAmount}
                  leftSection={<IconCurrencyDollar size={16} />}
                  onChange={(v) =>
                    setForm({ ...form, totalAmount: Number(v ?? 0) })
                  }
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
                    disabled={
                      externalPatientsQuery.isPending || externalPatientsQuery.isError
                    }
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
            </Stack>
          </Paper>
        </Stepper.Step>

        <Stepper.Step label={t("step2Label")} description={t("step2NotesMeta")}>
          <Paper withBorder radius="lg" p="md">
            <Stack gap="md">
              <MutationErrorAlert />
              <Title order={5}>{t("additionalInfoTitle")}</Title>
              <Divider />
              <Textarea
                label={t("fieldNotes")}
                autosize
                minRows={3}
                maxRows={8}
                placeholder={t("notesPlaceholder")}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.currentTarget.value })}
              />
              <Select
                label={t("fieldMetadata")}
                leftSection={<IconFileDescription size={16} />}
                placeholder={t("metadataPlaceholder")}
                description={t("metadataDesc")}
                data={[
                  { value: "home", label: t("dropOffHome") },
                  { value: "lab", label: t("dropOffLab") }
                ]}
                value={form.metadata}
                onChange={(v) =>
                  setForm({ ...form, metadata: v || "" })
                }
                clearable
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
              disabled={!isStepOneValid || isSubmitting}
            >
              {tc("next")}
            </Button>
          ) : (
            <Button
              radius="md"
              loading={isSubmitting}
              disabled={!canSave}
              onClick={async () => {
                if (!payloadOrNull) return;
                setIsSubmitting(true);
                try {
                  await submitAction(payloadOrNull);
                  handleClose();
                } finally {
                  setIsSubmitting(false);
                }
              }}
            >
              {tc("save")}
            </Button>
          )}
        </Group>
      </Group>
    </Stack>
  );
};

export { UI };
