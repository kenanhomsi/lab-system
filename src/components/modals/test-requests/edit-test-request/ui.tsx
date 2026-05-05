"use client";

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
import {
  IconCalendarEvent,
  IconCurrencyDollar,
  IconEdit,
  IconFileDescription,
  IconFlask2,
  IconInfoCircle,
  IconUsers,
} from "@tabler/icons-react";
import { useLocale } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import type { MedicalTestItem } from "@/components/tables/medical-tests-table/types";
import { buildTestRequestPartyPayload, isStaffPartyUser } from "../party-ids";
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
  medicalTestId: number;
  requestDate: string;
  status: string;
  totalAmount: number;
  notes: string;
  metadata: string;
  doctorId: string | null;
  labClientId: string | null;
  directPatientId: string | null;
  externalPatientId?: number | null;
};

const buildInitialForm = (initial?: TestRequestInitial | null) => ({
  id: initial ? String(initial.id) : "",
  medicalTestId: initial?.medicalTestId ?? 0,
  requestDate: toDateInputValue(initial?.requestDate ?? ""),
  status: initial?.status ?? "pending",
  totalAmount: initial?.totalAmount ?? 0,
  notes: initial?.notes ?? "",
  metadata: initial?.metadata ?? "",
  doctorId: initial?.doctorId ?? "",
  labClientId: initial?.labClientId ?? "",
  directPatientId: initial?.directPatientId ?? "",
  externalPatientId:
    initial?.externalPatientId != null &&
    Number.isFinite(Number(initial.externalPatientId))
      ? Number(initial.externalPatientId)
      : 0,
});

const UI = () => {
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
    externalPatientId: number;
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
            <Title order={4}>Edit Test Request</Title>
            <Text size="sm" c="dimmed">
              Update request information and billing details.
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
    externalPatientId: number;
  }) => Promise<unknown>;
  locale: string;
}) => {
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

  const showStaffPartyFields = Boolean(
    hasUserId && isStaffPartyUser(sessionUser?.roles),
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
            form.externalPatientId > 0 ? form.externalPatientId : 0,
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
      <Stepper
        className="mt-1"
        active={activeStep}
        onStepClick={setActiveStep}
        allowNextStepsSelect={false}
      >
        <Stepper.Step label="Step 1" description="Request details">
          <Paper withBorder radius="lg" p="md">
            <Stack gap="md">
              <Group justify="space-between" wrap="nowrap">
                <Title order={5}>Request Details</Title>
                <Text size="xs" c="dimmed">
                  Required fields are marked with *
                </Text>
              </Group>
              <Divider />
              {isUnauthenticated ? (
                <Alert color="red" title="Not signed in">
                  Sign in to update a request. Your account is loaded from the session
                  store after login.
                </Alert>
              ) : null}
              {status === "authenticated" && !isSessionLoading && !hasUserId ? (
                <Alert color="orange" title="Session user not synced">
                  Reload the page so your account info from login can attach to this form.
                </Alert>
              ) : null}
              {medicalTestsQuery.isError ? (
                <Alert color="red" title="Could not load medical tests">
                  Check your session and try again. If the problem persists, the list API
                  may have returned an unexpected shape.
                </Alert>
              ) : null}
              {!medicalTestsQuery.isPending &&
              !medicalTestsQuery.isError &&
              medicalTestOptions.length === 0 ? (
                <Text size="sm" c="dimmed">
                  No medical tests are available yet. Add tests under Medical tests before
                  editing requests.
                </Text>
              ) : null}
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" verticalSpacing="md">
                <Select
                  label="Medical test"
                  withAsterisk
                  searchable
                  allowDeselect={false}
                  clearable={false}
                  placeholder={
                    medicalTestsQuery.isPending ? "Loading tests…" : "Choose medical test"
                  }
                  description="Select the medical test reference."
                  data={medicalTestOptions}
                  leftSection={<IconFlask2 size={16} />}
                  disabled={medicalTestsQuery.isPending || medicalTestsQuery.isError}
                  value={form.medicalTestId > 0 ? String(form.medicalTestId) : null}
                  onChange={(v) =>
                    setForm({ ...form, medicalTestId: v ? Number(v) : 0 })
                  }
                />
                <TextInput
                  label="Request Date"
                  withAsterisk
                  type="date"
                  placeholder="YYYY-MM-DD"
                  description="Date associated with this request."
                  value={form.requestDate}
                  leftSection={<IconCalendarEvent size={16} />}
                  onChange={(e) =>
                    setForm({ ...form, requestDate: e.currentTarget.value })
                  }
                />
                <Select
                  label="Status"
                  data={[
                    { label: "Pending", value: "pending" },
                    { label: "In Progress", value: "in_progress" },
                    { label: "Completed", value: "completed" },
                    { label: "Cancelled", value: "cancelled" },
                  ]}
                  description="Current workflow state of the request."
                  leftSection={<IconInfoCircle size={16} />}
                  value={form.status}
                  searchable
                  allowDeselect={false}
                  onChange={(v) => setForm({ ...form, status: v ?? form.status })}
                />
                <NumberInput
                  label="Total Amount"
                  min={0}
                  decimalScale={2}
                  fixedDecimalScale
                  thousandSeparator=","
                  hideControls
                  description="Billing amount for this request."
                  value={form.totalAmount}
                  leftSection={<IconCurrencyDollar size={16} />}
                  onChange={(v) =>
                    setForm({ ...form, totalAmount: Number(v ?? 0) })
                  }
                />
                <Select
                  label="External patient"
                  searchable
                  clearable
                  placeholder={
                    externalPatientsQuery.isPending
                      ? "Loading patients…"
                      : "Choose external patient (optional)"
                  }
                  description="Linked external patient profile."
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
                {showStaffPartyFields && (
                  <>
                    <TextInput
                      label="Doctor ID"
                      placeholder="e.g. DR-001"
                      value={form.doctorId}
                      onChange={(e) =>
                        setForm({ ...form, doctorId: e.currentTarget.value })
                      }
                    />
                    <TextInput
                      label="Lab Client ID"
                      placeholder="e.g. LAB-458"
                      value={form.labClientId}
                      onChange={(e) =>
                        setForm({ ...form, labClientId: e.currentTarget.value })
                      }
                    />
                    <TextInput
                      label="Direct Patient ID"
                      placeholder="e.g. PAT-983"
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

        <Stepper.Step label="Step 2" description="Notes and metadata">
          <Paper withBorder radius="lg" p="md">
            <Stack gap="md">
              <Title order={5}>Additional Information</Title>
              <Divider />
              <Textarea
                label="Notes"
                autosize
                minRows={3}
                maxRows={8}
                placeholder="Add any clinical or billing notes..."
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.currentTarget.value })}
              />
              <TextInput
                label="Metadata"
                leftSection={<IconFileDescription size={16} />}
                placeholder='e.g. {"priority":"urgent","source":"walk-in"}'
                description="Optional JSON-like metadata for integrations."
                value={form.metadata}
                onChange={(e) =>
                  setForm({ ...form, metadata: e.currentTarget.value })
                }
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
          Cancel
        </Button>
        <Group gap="sm" wrap="nowrap">
          {activeStep > 0 && (
            <Button
              variant="default"
              onClick={() => setActiveStep((prev) => prev - 1)}
              disabled={isSubmitting}
            >
              Back
            </Button>
          )}
          {!isLastStep ? (
            <Button
              radius="md"
              onClick={() => setActiveStep(1)}
              disabled={!isStepOneValid || isSubmitting}
            >
              Next
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
              Save
            </Button>
          )}
        </Group>
      </Group>
    </Stack>
  );
};

export { UI };
