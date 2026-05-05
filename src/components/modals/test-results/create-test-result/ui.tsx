"use client";

import {
  Alert,
  Button,
  Divider,
  Group,
  Modal,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconCalendarEvent,
  IconClipboardList,
  IconFileDescription,
  IconLink,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useRef, useState } from "react";
import { normalizeMedicalTestItem } from "@/components/tables/medical-tests-table/apis/normalize-medical-tests-response";
import { frontendContainer } from "@/container";
import type { CreateTestResultFrontendParams } from "@/modules/TestResults/frontend/types";
import {
  buildResultObjectFromDescriptors,
  MedicalTestFrontendService,
  medicalTestModuleNames,
  parameterSchemaToResultFields,
  validateRequiredResultFields,
} from "@/modules/medical-tests";
import { ResultDataFromSchema } from "./result-data-from-schema";
import { useMirror } from "./store";
import {
  testRequestOptionLabel,
  useTestRequestsForSelectQuery,
} from "../use-test-requests-for-select";

const medicalTestService = frontendContainer.get<MedicalTestFrontendService>(
  medicalTestModuleNames.service,
);

const RESULT_STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "rejected", label: "Rejected" },
];

function unwrapMedicalTestPayload(payload: unknown): unknown {
  if (payload === null || payload === undefined) return payload;
  let cur: unknown = payload;
  for (let depth = 0; depth < 5; depth += 1) {
    if (!cur || typeof cur !== "object") return cur;
    const o = cur as Record<string, unknown>;
    const d = o.data;
    if (d !== undefined && d !== null && typeof d === "object") {
      cur = d;
      continue;
    }
    return cur;
  }
  return cur;
}

function isoToDatetimeLocal(iso: string): string {
  const trimmed = iso.trim();
  if (!trimmed) return "";
  const d = new Date(trimmed);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function datetimeLocalToIso(local: string): string {
  const trimmed = local.trim();
  if (!trimmed) return new Date().toISOString();
  const ms = Date.parse(trimmed);
  if (Number.isNaN(ms)) return new Date().toISOString();
  return new Date(ms).toISOString();
}

/** Form mounted only while `Modal` `opened`; holds queries, schema-driven payload, submit. */
function CreateTestResultFormBody(props: {
  onCloseParent: () => void;
  submitAction: (p: CreateTestResultFrontendParams) => Promise<unknown>;
  isSubmitting: boolean;
}) {
  const { onCloseParent, submitAction, isSubmitting } = props;

  const snapshotResultValuesRef = useRef<Record<string, unknown>>({});
  const handleResultSnapshot = useCallback((row: Record<string, unknown>) => {
    snapshotResultValuesRef.current = row;
  }, []);

  const [form, setForm] = useState<CreateTestResultFrontendParams>(() => {
    const iso = new Date().toISOString();
    return {
      testRequestId: 0,
      resultDate: iso,
      status: "pending",
      resultData: "{}",
      pdfUrl: "",
    };
  });

  const [resultDateLocal, setResultDateLocal] = useState(() =>
    isoToDatetimeLocal(new Date().toISOString()),
  );

  const testRequestsQuery = useTestRequestsForSelectQuery(true);

  const rows = useMemo(
    () => (Array.isArray(testRequestsQuery.data) ? testRequestsQuery.data : []),
    [testRequestsQuery.data],
  );

  const testRequestSelectData = useMemo(
    () =>
      rows.map((row) => ({
        value: String(row.id),
        label: testRequestOptionLabel(row),
      })),
    [rows],
  );

  const selectedRequest = useMemo(
    () => rows.find((r) => r.id === form.testRequestId),
    [rows, form.testRequestId],
  );

  const medicalTestId = selectedRequest?.medicalTestId ?? 0;

  const medicalTestQuery = useQuery({
    queryKey: ["create-test-result", "medical-test", medicalTestId],
    queryFn: async () => {
      const rawUnknown: unknown = await medicalTestService.findOne({
        id: String(medicalTestId),
      });
      const inner = unwrapMedicalTestPayload(rawUnknown);
      return normalizeMedicalTestItem(inner);
    },
    enabled: medicalTestId > 0,
    staleTime: 60_000,
  });

  const schemaFields = useMemo(
    () => parameterSchemaToResultFields(medicalTestQuery.data?.parameterSchema),
    [medicalTestQuery.data?.parameterSchema],
  );

  const schemaLoading = Boolean(medicalTestId > 0 && medicalTestQuery.isPending);
  const schemaError = Boolean(medicalTestId > 0 && medicalTestQuery.isError);

  const resultEditorKey =
    selectedRequest !== undefined
      ? `${selectedRequest.id}-${
          medicalTestQuery.isError
            ? "error"
            : medicalTestQuery.isPending || !medicalTestQuery.data
              ? "pending"
              : String(medicalTestQuery.data.id)
        }`
      : "none";

  const handleClose = () => {
    if (isSubmitting) return;
    onCloseParent();
  };

  const canSubmit =
    form.testRequestId > 0 &&
    !medicalTestQuery.isPending &&
    !(medicalTestQuery.isError && medicalTestId > 0);

  return (
    <Stack gap="lg">
      <Paper withBorder radius="lg" p="md">
        <Stack gap="md">
          <Group justify="space-between" wrap="nowrap">
            <Title order={5}>Request & report</Title>
            <Text size="xs" c="dimmed">
              Required fields are marked with *
            </Text>
          </Group>
          <Divider />
          {testRequestsQuery.isError ? (
            <Alert color="red" title="Could not load test requests">
              Check your session and connection, then reopen this dialog.
            </Alert>
          ) : null}
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" verticalSpacing="md">
            <Select
              label="Test request"
              withAsterisk
              searchable
              clearable={false}
              placeholder={
                testRequestsQuery.isPending ? "Loading requests…" : "Choose test request"
              }
              description="Patient and test appear in each option; the stored id is the request record."
              data={testRequestSelectData}
              leftSection={<IconClipboardList size={16} />}
              disabled={testRequestsQuery.isPending || testRequestsQuery.isError}
              value={form.testRequestId > 0 ? String(form.testRequestId) : null}
              onChange={(v) =>
                setForm({
                  ...form,
                  testRequestId: v ? Number(v) : 0,
                })
              }
            />
            <TextInput
              label="Result date & time"
              withAsterisk
              type="datetime-local"
              description="Captured as ISO 8601 when you submit."
              value={resultDateLocal}
              leftSection={<IconCalendarEvent size={16} />}
              onChange={(e) => {
                const nextLocal = e.currentTarget.value;
                setResultDateLocal(nextLocal);
                setForm({
                  ...form,
                  resultDate: datetimeLocalToIso(nextLocal),
                });
              }}
            />
            <Select
              label="Status"
              withAsterisk
              allowDeselect={false}
              data={RESULT_STATUS_OPTIONS}
              value={form.status}
              onChange={(v) =>
                setForm({ ...form, status: typeof v === "string" ? v : "pending" })
              }
            />
            <TextInput
              label="PDF URL"
              placeholder="https://..."
              description="Optional link to generated report PDF."
              value={form.pdfUrl}
              leftSection={<IconLink size={16} />}
              onChange={(e) => setForm({ ...form, pdfUrl: e.currentTarget.value })}
            />
          </SimpleGrid>
        </Stack>
      </Paper>

      <Paper withBorder radius="lg" p="md">
        <Stack gap="md">
          <Group justify="space-between" wrap="nowrap">
            <Title order={5}>Result values</Title>
            {medicalTestQuery.data ? (
              <Text size="xs" c="dimmed" lineClamp={1}>
                Schema from: {medicalTestQuery.data.nameEn}
              </Text>
            ) : null}
          </Group>
          <Divider />
          {!selectedRequest ? (
            <Text size="sm" c="dimmed">
              Select a test request to load parameter fields.
            </Text>
          ) : (
            <ResultDataFromSchema
              key={resultEditorKey}
              parameterSchema={medicalTestQuery.data?.parameterSchema}
              schemaLoading={schemaLoading}
              schemaError={schemaError}
              onValuesChange={handleResultSnapshot}
            />
          )}
        </Stack>
      </Paper>

      <Group justify="space-between" wrap="nowrap">
        <Button variant="subtle" color="gray" onClick={handleClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          radius="md"
          loading={isSubmitting}
          disabled={!canSubmit}
          leftSection={<IconFileDescription size={18} />}
          onClick={async () => {
            if (form.testRequestId <= 0) {
              notifications.show({
                title: "Missing request",
                message: "Choose a test request.",
                color: "red",
              });
              return;
            }
            if (!selectedRequest || medicalTestId <= 0) {
              notifications.show({
                title: "Invalid selection",
                message: "The selected row has no linked medical test.",
                color: "red",
              });
              return;
            }
            if (medicalTestQuery.isError) {
              notifications.show({
                title: "Schema unavailable",
                message: "Load the linked medical test before saving.",
                color: "red",
              });
              return;
            }

            const resultValuesSnapshot = snapshotResultValuesRef.current;
            const requiredErr = validateRequiredResultFields(schemaFields, resultValuesSnapshot);
            if (requiredErr) {
              notifications.show({
                title: "Check result fields",
                message: requiredErr,
                color: "red",
              });
              return;
            }

            const payloadObject =
              schemaFields.length === 0
                ? ({} as Record<string, unknown>)
                : buildResultObjectFromDescriptors(schemaFields, resultValuesSnapshot);
            const resultData =
              schemaFields.length === 0 ? "{}" : JSON.stringify(payloadObject);
            const resultDate = datetimeLocalToIso(resultDateLocal);

            try {
              await submitAction({
                ...form,
                resultDate,
                resultData,
              });
              handleClose();
            } catch (e) {
              const message =
                e instanceof Error ? e.message : "Something went wrong while creating.";
              notifications.show({
                title: "Create failed",
                message,
                color: "red",
              });
            }
          }}
        >
          Create
        </Button>
      </Group>
    </Stack>
  );
}

/** Outer shell mounts the form body only while the modal is open so local state resets naturally. */
const UI = () => {
  const props = useMirror("props") as { opened?: boolean; onClose?: () => void };
  const submitAction = useMirror("submitAction") as (
    p: CreateTestResultFrontendParams,
  ) => Promise<unknown>;
  const isSubmitting = useMirror("isSubmitting") as boolean;

  const opened = Boolean(props.opened);
  const onClose = props.onClose ?? (() => undefined);

  const handleCloseShell = () => {
    if (isSubmitting) return;
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleCloseShell}
      title={
        <Group gap="sm" wrap="nowrap">
          <ThemeIcon size={42} radius="md" variant="light" color="blue">
            <IconClipboardList size={22} />
          </ThemeIcon>
          <Stack gap={0}>
            <Title order={4}>Create test result</Title>
            <Text size="sm" c="dimmed">
              Link a lab result to an existing request. Values follow the linked test schema.
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
      {opened ? (
        <CreateTestResultFormBody
          key="create-test-result-body"
          onCloseParent={onClose}
          submitAction={submitAction}
          isSubmitting={isSubmitting}
        />
      ) : null}
    </Modal>
  );
};

export { UI };
