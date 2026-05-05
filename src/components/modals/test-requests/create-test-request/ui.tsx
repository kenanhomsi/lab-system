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
  IconFileDescription,
  IconFlask2,
  IconPlus,
  IconUsers,
} from "@tabler/icons-react";
import { useLocale } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { useMirror } from "./store";
import type { MedicalTestItem } from "@/components/tables/medical-tests-table/types";
import { buildTestRequestPartyPayload, isStaffPartyUser } from "../party-ids";
import {
  useExternalPatientsForSelectQuery,
  useMedicalTestsForSelectQuery,
} from "../use-test-request-lookups";
import { toRequestDateIso } from "@/modules/TestRequests/abstraction/request-date-iso";
import { useSyncedSessionUser } from "@/stores/use-synced-session-user";

const INITIAL_FORM = {
  medicalTestId: 0,
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

const UI = () => {
  const props = useMirror("props") as { opened?: boolean; onClose?: () => void };
  const locale = useLocale();

  const submitAction = useMirror("submitAction") as (p: {
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

  const opened = Boolean(props.opened);

  const [form, setForm] = useState(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const onClose = props.onClose || (() => undefined);

  const medicalTestsQuery = useMedicalTestsForSelectQuery(opened);
  const externalPatientsQuery = useExternalPatientsForSelectQuery(opened);
  const { user: sessionUser, isSessionLoading, isUnauthenticated, status } =
    useSyncedSessionUser();

  useEffect(() => {
    if (!opened) {
      setActiveStep(0);
      setForm({ ...INITIAL_FORM });
    }
  }, [opened]);

  useEffect(() => {
    const items = medicalTestsQuery.data;
    if (!items?.length) return;
    setForm((prev) => {
      if (prev.medicalTestId <= 0) return prev;
      const p = priceForMedicalTestId(prev.medicalTestId, items);
      return prev.totalAmount === p ? prev : { ...prev, totalAmount: p };
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

  const showStaffPartyFields = Boolean(
    hasUserId && isStaffPartyUser(sessionUser?.roles),
  );

  /** Step 1: only form fields — profile is required on submit, not to move to step 2. */
  const isStepOneValid =
    Boolean(form.requestDate.trim()) && form.medicalTestId > 0;

  const canSubmitCreate = isStepOneValid && hasUserId;

  const isLastStep = activeStep === 1;

  const handleClose = () => {
    setActiveStep(0);
    onClose();
  };

  const buildPayload = (): {
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
      medicalTestId: form.medicalTestId,
      requestDate: toRequestDateIso(form.requestDate),
      status: "pending",
      totalAmount: form.totalAmount,
      notes: form.notes,
      metadata: form.metadata,
      externalPatientId: form.externalPatientId > 0 ? form.externalPatientId : 0,
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
            <Title order={4}>Create Test Request</Title>
            <Text size="sm" c="dimmed">
              Add a new lab test request with billing details.
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
                    Sign in to create a request. Your account is loaded from the session store after login.
                  </Alert>
                ) : null}
                {status === "authenticated" && !isSessionLoading && !hasUserId ? (
                  <Alert color="orange" title="Session user not synced">
                    Reload the page so your account info from login can attach to this form.
                  </Alert>
                ) : null}
                {medicalTestsQuery.isError ? (
                  <Alert color="red" title="Could not load medical tests">
                    Check your session and try again. If the problem persists, the list API may have
                    returned an unexpected shape.
                  </Alert>
                ) : null}
                {!medicalTestsQuery.isPending &&
                !medicalTestsQuery.isError &&
                medicalTestOptions.length === 0 ? (
                  <Text size="sm" c="dimmed">
                    No medical tests are available yet. Add tests under Medical tests before creating a
                    request.
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
                      onChange={(v) => {
                        const nextId = v ? Number(v) : 0;
                        const items = medicalTestsQuery.data ?? [];
                        setForm({
                          ...form,
                          medicalTestId: nextId,
                          totalAmount: priceForMedicalTestId(nextId, items),
                        });
                      }}
                    />
                    <TextInput
                      label="Request Date"
                      withAsterisk
                      type="date"
                      placeholder="YYYY-MM-DD"
                      description="Date when this request is created."
                      value={form.requestDate}
                      leftSection={<IconCalendarEvent size={16} />}
                      onChange={(e) =>
                        setForm({ ...form, requestDate: e.currentTarget.value })
                      }
                    />
                    <NumberInput
                      label="Total Amount"
                      min={0}
                      decimalScale={2}
                      fixedDecimalScale
                      thousandSeparator=","
                      description="Set automatically from the selected medical test price. Admins can change status and amounts when editing the request."
                      value={form.totalAmount}
                      readOnly
                      leftSection={<IconCurrencyDollar size={16} />}
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
                disabled={!canSubmitCreate}
                onClick={async () => {
                  const payload = buildPayload();
                  if (!payload) return;
                  setIsSubmitting(true);
                  try {
                    await submitAction(payload);
                    handleClose();
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
              >
                Create
              </Button>
            )}
          </Group>
        </Group>
      </Stack>
    </Modal>
  );
};

export { UI };
