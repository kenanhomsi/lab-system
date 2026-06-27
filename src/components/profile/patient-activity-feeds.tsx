"use client";

import { frontendContainer } from "@/container";
import { BookBloodDrawModal } from "@/components/features/appointments";
import {
  DeleteTestRequestModal,
  EditTestRequestModal,
} from "@/components/modals/test-requests";
import { ViewTestResultModal } from "@/components/tables/test-results-table/components/view-test-result-modal";
import { getTestRequestCreatorLabel } from "@/components/tables/test-results-table/get-test-request-creator-label";
import {
  createTestResultPdfBlob,
  downloadBlob,
  getResultFileName,
  parseResultRows,
} from "@/components/tables/test-results-table/pdf-export";
import {
  parseResultData,
  stringifyPreview,
} from "@/components/tables/test-results-table/schema/columns-rendering/parse-result-data";
import type { TestResultItem, TestResultsResponse } from "@/components/tables/test-results-table/types";
import { getMedicalTestNamesLabel } from "@/components/tables/test-requests-table/get-medical-test-names-label";
import type { TestRequestItem, TestRequestsResponse } from "@/components/tables/test-requests-table/types";
import { Link } from "@/i18n/navigation";
import {
  InsuranceApprovalRequestFrontendService,
  insuranceApprovalRequestModuleNames,
  type InsuranceApprovalRequestItem,
} from "@/modules/insurance-approval-request";
import { TestRequestFrontendService, testRequestModuleNames } from "@/modules/TestRequests";
import { TestResultFrontendService, testResultModuleNames } from "@/modules/TestResults";
import {
  ActionIcon,
  Alert,
  Badge,
  Button,
  FileInput,
  Group,
  Loader,
  Modal,
  Pagination,
  Paper,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import {
  IconCalendarPlus,
  IconDownload,
  IconEdit,
  IconEye,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { StatusBadge as InsuranceStatusBadge } from "@/components/tables/my-insurance-approval-requests-table/schema/columns-rendering/status-badge";
import styles from "./styles.module.scss";

const testRequestService = frontendContainer.get<TestRequestFrontendService>(
  testRequestModuleNames.service,
);
const testResultService = frontendContainer.get<TestResultFrontendService>(
  testResultModuleNames.service,
);
const insuranceApprovalService = frontendContainer.get<InsuranceApprovalRequestFrontendService>(
  insuranceApprovalRequestModuleNames.service,
);

const PAGE_SIZE = 6;

function extractTestRequestsResponse(payload: unknown): TestRequestsResponse {
  if (
    payload !== null &&
    typeof payload === "object" &&
    "data" in payload &&
    typeof (payload as Record<string, unknown>).data === "object" &&
    (payload as Record<string, unknown>).data !== null &&
    "items" in ((payload as Record<string, unknown>).data as Record<string, unknown>)
  ) {
    return (payload as Record<string, unknown>).data as TestRequestsResponse;
  }

  if (payload !== null && typeof payload === "object" && "items" in payload) {
    return payload as TestRequestsResponse;
  }

  throw new Error("Failed to fetch test requests");
}

function extractTestResultsResponse(payload: unknown): TestResultsResponse {
  if (
    payload !== null &&
    typeof payload === "object" &&
    "data" in payload &&
    typeof (payload as Record<string, unknown>).data === "object" &&
    (payload as Record<string, unknown>).data !== null &&
    "items" in ((payload as Record<string, unknown>).data as Record<string, unknown>)
  ) {
    return (payload as Record<string, unknown>).data as TestResultsResponse;
  }

  if (payload !== null && typeof payload === "object" && "items" in payload) {
    return payload as TestResultsResponse;
  }

  throw new Error("Failed to fetch test results");
}

function normalizeStatus(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, "_").replace(/-/g, "_");
}

function getRequestStatusColor(value: string): string {
  const normalized = normalizeStatus(value);
  if (normalized === "pending") return "orange";
  if (normalized === "in_progress") return "blue";
  if (normalized === "completed" || normalized === "complete" || normalized === "ready") {
    return "teal";
  }
  if (normalized === "cancelled" || normalized === "canceled" || normalized === "rejected") {
    return "red";
  }
  return "gray";
}

function translateRequestStatus(value: string, t: (key: string) => string): string {
  const normalized = normalizeStatus(value);
  if (normalized === "pending") return t("statusPending");
  if (normalized === "in_progress") return t("statusInProgress");
  if (normalized === "completed" || normalized === "complete" || normalized === "ready") {
    return t("statusCompleted");
  }
  if (normalized === "cancelled" || normalized === "canceled") return t("statusCancelled");
  return value || "—";
}

function formatDateTime(value: string | null | undefined, locale: string): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatCompactDate(value: string | null | undefined, locale: string): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(date);
}

function buildResultPreview(value: TestResultItem["resultData"]): string[] {
  const parsed = parseResultData(value);
  if (parsed.kind === "object") {
    return parsed.entries
      .slice(0, 3)
      .map(([key, entryValue]) => `${key}: ${stringifyPreview(entryValue)}`);
  }
  if (parsed.kind === "json") {
    return [stringifyPreview(parsed.value)];
  }
  if (parsed.kind === "text") {
    return [parsed.text];
  }
  return [];
}

function formatRequestMetadata(
  value: string | null | undefined,
  t: (key: string) => string,
): string {
  const normalized = value?.trim().toLowerCase();
  if (!normalized) return "—";
  if (normalized === "home") return t("dropOffHome");
  if (normalized === "lab") return t("dropOffLab");
  return value ?? "—";
}

/** Renders a loading skeleton set that matches the profile feed cards. */
function ActivitySkeletonList() {
  return (
    <SimpleGrid cols={{ base: 1, xl: 2 }} spacing="md">
      {Array.from({ length: 4 }).map((_, index) => (
        <Paper key={index} withBorder radius="xl" p="lg" className={styles.activityCard}>
          <Stack gap="md">
            <Skeleton height={18} radius="sm" />
            <Skeleton height={12} width="70%" radius="sm" />
            <Skeleton height={72} radius="lg" />
            <Skeleton height={34} radius="xl" />
          </Stack>
        </Paper>
      ))}
    </SimpleGrid>
  );
}

/** Renders a lightweight empty state inside the patient profile feeds. */
function EmptyFeedState({
  title,
  description,
  ctaLabel,
  ctaHref,
}: {
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <Paper withBorder radius="xl" p="xl" className={styles.emptyState}>
      <Stack gap="sm" align="center">
        <Text fw={700}>{title}</Text>
        <Text size="sm" c="dimmed" ta="center" maw={420}>
          {description}
        </Text>
        {ctaLabel && ctaHref ? (
          <Button component={Link} href={ctaHref} variant="light" color="teal" radius="xl">
            {ctaLabel}
          </Button>
        ) : null}
      </Stack>
    </Paper>
  );
}

/** Displays the insurance approval detail modal for the card feed layout. */
function InsuranceApprovalDetailModal({
  opened,
  requestId,
  onClose,
}: {
  opened: boolean;
  requestId: number | null;
  onClose: () => void;
}) {
  const t = useTranslations("myInsuranceApproval");

  const { data, isPending, isError } = useQuery({
    queryKey: ["my-insurance-approval-detail", requestId],
    queryFn: () => insuranceApprovalService.findMineOne(String(requestId)),
    enabled: opened && requestId !== null,
  });

  return (
    <Modal opened={opened} onClose={onClose} title={t("detailTitle")} radius="lg" centered size="lg">
      {isPending ? (
        <Group justify="center" py="xl">
          <Loader size="sm" />
        </Group>
      ) : isError ? (
        <Alert color="red">{t("detailNotFound")}</Alert>
      ) : data ? (
        <Stack gap="sm">
          <Group justify="space-between" wrap="nowrap">
            <Text fw={600}>{t("colStatus")}</Text>
            <InsuranceStatusBadge value={data.status} />
          </Group>
          <Text>
            <Text span fw={600}>
              {t("colInsuredName")}:{" "}
            </Text>
            {data.insuredName}
          </Text>
          <Text>
            <Text span fw={600}>
              {t("colInsuranceNumber")}:{" "}
            </Text>
            {data.insuranceNumber}
          </Text>
          <Text>
            <Text span fw={600}>
              {t("colMobile")}:{" "}
            </Text>
            {data.mobileNumber}
          </Text>
          {data.notes ? (
            <Text>
              <Text span fw={600}>
                {t("notes")}:{" "}
              </Text>
              {data.notes}
            </Text>
          ) : null}
          {data.rejectionReason ? (
            <Text c="red">
              <Text span fw={600}>
                {t("rejectionReason")}:{" "}
              </Text>
              {data.rejectionReason}
            </Text>
          ) : null}
          {data.insuranceCardImageUrl ? (
            <Button
              component="a"
              href={data.insuranceCardImageUrl}
              target="_blank"
              rel="noreferrer"
              variant="light"
              radius="xl"
            >
              {t("viewCardImage")}
            </Button>
          ) : null}
          {data.prescriptionImageUrl ? (
            <Button
              component="a"
              href={data.prescriptionImageUrl}
              target="_blank"
              rel="noreferrer"
              variant="light"
              radius="xl"
            >
              {t("viewPrescriptionImage")}
            </Button>
          ) : null}
        </Stack>
      ) : (
        <Text c="dimmed">{t("detailNotFound")}</Text>
      )}
    </Modal>
  );
}

/** Collects a new insurance approval request from the patient profile feed. */
function InsuranceApprovalCreateModal({
  opened,
  onClose,
}: {
  opened: boolean;
  onClose: () => void;
}) {
  const t = useTranslations("myInsuranceApproval");
  const tInsurance = useTranslations("insurance");
  const queryClient = useQueryClient();

  const form = useForm<{
    insuredName: string;
    insuranceNumber: string;
    mobileNumber: string;
    insuranceCardImage: File | null;
    prescriptionImage: File | null;
  }>({
    initialValues: {
      insuredName: "",
      insuranceNumber: "",
      mobileNumber: "",
      insuranceCardImage: null,
      prescriptionImage: null,
    },
    validate: {
      insuredName: (value) => (value.trim() ? null : t("insuredNameRequired")),
      insuranceNumber: (value) => (value.trim() ? null : t("insuranceNumberRequired")),
      mobileNumber: (value) => (value.trim() ? null : t("mobileRequired")),
      insuranceCardImage: (value) => (value ? null : t("cardImageRequired")),
      prescriptionImage: (value) => (value ? null : t("prescriptionImageRequired")),
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const values = form.values;
      if (!values.insuranceCardImage || !values.prescriptionImage) return;

      return insuranceApprovalService.create({
        insuredName: values.insuredName.trim(),
        insuranceNumber: values.insuranceNumber.trim(),
        mobileNumber: values.mobileNumber.trim(),
        insuranceCardImage: values.insuranceCardImage,
        prescriptionImage: values.prescriptionImage,
      });
    },
    onSuccess: async (response) => {
      notifications.show({
        title: t("createSuccessTitle"),
        message: response?.message ?? t("createSuccessMessage"),
        color: "green",
      });
      await queryClient.invalidateQueries({ queryKey: ["my-insurance-approval-requests"] });
      form.reset();
      onClose();
    },
    onError: () => {
      notifications.show({
        title: t("createError"),
        message: t("createError"),
        color: "red",
      });
    },
  });

  const handleClose = () => {
    if (createMutation.isPending) return;
    form.reset();
    onClose();
  };

  return (
    <Modal opened={opened} onClose={handleClose} title={t("modalTitle")} radius="lg" centered size="lg">
      <form
        onSubmit={form.onSubmit(async () => {
          await createMutation.mutateAsync();
        })}
      >
        <Stack gap="md">
          <TextInput
            label={tInsurance("insuredName")}
            placeholder={tInsurance("insuredNamePlaceholder")}
            {...form.getInputProps("insuredName")}
          />
          <TextInput
            label={tInsurance("insuranceNumber")}
            placeholder={tInsurance("insuranceNumberPlaceholder")}
            {...form.getInputProps("insuranceNumber")}
          />
          <TextInput
            label={tInsurance("mobile")}
            placeholder={tInsurance("mobilePlaceholder")}
            {...form.getInputProps("mobileNumber")}
          />
          <FileInput
            label={tInsurance("cardImage")}
            description={tInsurance("cardImageHint")}
            placeholder={t("selectFile")}
            accept="image/*"
            clearable
            {...form.getInputProps("insuranceCardImage")}
          />
          <FileInput
            label={tInsurance("prescriptionImage")}
            description={tInsurance("prescriptionImageHint")}
            placeholder={t("selectFile")}
            accept="image/*"
            clearable
            {...form.getInputProps("prescriptionImage")}
          />
          <Group justify="flex-end">
            <Button variant="default" onClick={handleClose}>
              {t("cancel")}
            </Button>
            <Button type="submit" loading={createMutation.isPending}>
              {tInsurance("submit")}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}

/** Shows recent patient test requests as cards with inline actions. */
function PatientTestRequestsFeed() {
  const tProfile = useTranslations("dashboard.profile");
  const tTable = useTranslations("table");
  const tRequests = useTranslations("admin.testRequests");
  const tAppointments = useTranslations("appointmentsFeature");
  const tPricing = useTranslations("priceCalculator");
  const tc = useTranslations("admin.common");
  const locale = useLocale();
  const [page, setPage] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState<TestRequestItem | null>(null);
  const [activeModal, setActiveModal] = useState<"edit" | "delete" | "appointment" | null>(null);

  const { data, isPending, isError } = useQuery({
    queryKey: ["test-requests", "profile-feed", page],
    queryFn: async () => {
      const payload = await testRequestService.findAll({
        query: {
          Page: String(page),
          PageSize: String(PAGE_SIZE),
          SortBy: "createdAt",
          SortDesc: "true",
        },
      });
      return extractTestRequestsResponse(payload);
    },
  });

  const openModal = (
    modal: "edit" | "delete" | "appointment",
    row: TestRequestItem,
  ) => {
    setSelectedRequest(row);
    setActiveModal(modal);
  };

  return (
    <Stack gap="md">
      <Group justify="space-between" align="center" wrap="wrap" gap="sm">
        <Badge variant="light" color="teal" radius="xl">
          {data?.totalCount ?? 0}
        </Badge>
        <Button
          component={Link}
          href="/tests"
          leftSection={<IconPlus size={16} />}
          variant="light"
          color="teal"
          radius="xl"
        >
          {tProfile("orderTestRequest")}
        </Button>
      </Group>

      {isPending ? <ActivitySkeletonList /> : null}
      {isError ? <Alert color="red">{tTable("emptyHint")}</Alert> : null}
      {!isPending && !isError && !data?.items.length ? (
        <EmptyFeedState
          title={tTable("emptyTitle")}
          description={tProfile("testRequestsDesc")}
          ctaLabel={tProfile("orderTestRequest")}
          ctaHref="/tests"
        />
      ) : null}

      {!isPending && !isError && data?.items.length ? (
        <>
          <SimpleGrid cols={{ base: 1, xl: 2 }} spacing="md">
            {data.items.map((row) => (
              <Paper key={row.id} withBorder radius="xl" p="lg" className={styles.activityCard}>
                <Stack gap="md">
                  <Group justify="space-between" align="flex-start" gap="sm" wrap="nowrap">
                    <Stack gap={4}>
                      <Text fw={700} size="lg">
                        {getMedicalTestNamesLabel(row) || `#${row.id}`}
                      </Text>
                      <Text size="sm" c="dimmed">
                        #{row.id} • {formatDateTime(row.requestDate, locale)}
                      </Text>
                    </Stack>
                    <Badge color={getRequestStatusColor(row.status)} variant="light" radius="sm">
                      {translateRequestStatus(row.status, tRequests)}
                    </Badge>
                  </Group>

                  <SimpleGrid cols={2} spacing="sm">
                    <Stack gap={2}>
                      <Text size="xs" tt="uppercase" c="dimmed">
                        {tRequests("colTotalAmount")}
                      </Text>
                      <Text fw={700}>
                        {new Intl.NumberFormat(locale).format(row.totalAmount)} {tPricing("currency")}
                      </Text>
                    </Stack>
                    <Stack gap={2}>
                      <Text size="xs" tt="uppercase" c="dimmed">
                        {tRequests("colCreatedAt")}
                      </Text>
                      <Text fw={500}>{formatDateTime(row.createdAt, locale)}</Text>
                    </Stack>
                  </SimpleGrid>

                  <Paper withBorder radius="lg" p="md" className={styles.activityPreview}>
                    <Stack gap="xs">
                      <Text size="xs" tt="uppercase" c="dimmed">
                        {tRequests("colNotes")}
                      </Text>
                      <Text size="sm" lineClamp={3}>
                        {row.notes?.trim() || "—"}
                      </Text>
                      <Text size="xs" tt="uppercase" c="dimmed" mt="xs">
                        {tRequests("fieldMetadata")}
                      </Text>
                      <Text size="sm">
                        {formatRequestMetadata(row.metadata, tRequests)}
                      </Text>
                    </Stack>
                  </Paper>

                  <Group justify="space-between" align="center" wrap="wrap" gap="sm">
                    <Text size="sm" c="dimmed">
                      {tAppointments("bookAction")}
                    </Text>
                    <Group gap="xs" className={styles.activityActions}>
                      <Tooltip label={tAppointments("bookAction")} withArrow>
                        <ActionIcon
                          variant="light"
                          color="teal"
                          radius="xl"
                          onClick={() => openModal("appointment", row)}
                        >
                          <IconCalendarPlus size={16} />
                        </ActionIcon>
                      </Tooltip>
                      <Tooltip label={tc("edit")} withArrow>
                        <ActionIcon
                          variant="light"
                          color="blue"
                          radius="xl"
                          onClick={() => openModal("edit", row)}
                        >
                          <IconEdit size={16} />
                        </ActionIcon>
                      </Tooltip>
                      <Tooltip label={tc("delete")} withArrow>
                        <ActionIcon
                          variant="light"
                          color="red"
                          radius="xl"
                          onClick={() => openModal("delete", row)}
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Tooltip>
                    </Group>
                  </Group>
                </Stack>
              </Paper>
            ))}
          </SimpleGrid>

          {data.totalPages > 1 ? (
            <Group justify="center">
              <Pagination value={page} onChange={setPage} total={data.totalPages} radius="xl" />
            </Group>
          ) : null}
        </>
      ) : null}

      <EditTestRequestModal
        opened={activeModal === "edit"}
        onClose={() => setActiveModal(null)}
        testRequest={selectedRequest}
      />
      <DeleteTestRequestModal
        opened={activeModal === "delete"}
        onClose={() => setActiveModal(null)}
        testRequest={selectedRequest}
      />
      <BookBloodDrawModal
        opened={activeModal === "appointment"}
        onClose={() => setActiveModal(null)}
        testRequest={selectedRequest}
      />
    </Stack>
  );
}

/** Shows patient test results as compact cards with preview and file actions. */
function PatientTestResultsFeed() {
  const tProfile = useTranslations("dashboard.profile");
  const tTable = useTranslations("table");
  const tResults = useTranslations("admin.testResults");
  const tc = useTranslations("admin.common");
  const locale = useLocale();
  const [page, setPage] = useState(1);
  const [selectedResult, setSelectedResult] = useState<TestResultItem | null>(null);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  const { data, isPending, isError } = useQuery({
    queryKey: ["test-results", "profile-feed", page],
    queryFn: async () => {
      const query: Record<string, string> = {
        Page: String(page),
        PageSize: String(PAGE_SIZE),
        SortBy: "createdAt",
        SortDesc: "true",
      };
      const payload = await testResultService.findAll({
        query,
      });
      return extractTestResultsResponse(payload);
    },
  });

  const handleDownload = async (row: TestResultItem) => {
    setDownloadingId(row.id);
    try {
      const rows = parseResultRows(row.resultData).rows;
      const blob = await createTestResultPdfBlob(row);
      downloadBlob(blob, getResultFileName(row, rows));
    } catch {
      notifications.show({
        color: "red",
        message: tResults("downloadPdfFailed"),
      });
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <Stack gap="md">
      <Group justify="space-between" align="center" wrap="wrap" gap="sm">
        <Badge variant="light" color="teal" radius="xl">
          {data?.totalCount ?? 0}
        </Badge>
        <Button component={Link} href="/tests" variant="subtle" color="teal" radius="xl">
          {tProfile("orderTestRequest")}
        </Button>
      </Group>

      {isPending ? <ActivitySkeletonList /> : null}
      {isError ? <Alert color="red">{tTable("emptyHint")}</Alert> : null}
      {!isPending && !isError && !data?.items.length ? (
        <EmptyFeedState title={tTable("emptyTitle")} description={tProfile("testResultsDesc")} />
      ) : null}

      {!isPending && !isError && data?.items.length ? (
        <>
          <SimpleGrid cols={{ base: 1, xl: 2 }} spacing="md">
            {data.items.map((row) => {
              const preview = buildResultPreview(row.resultData);

              return (
                <Paper key={row.id} withBorder radius="xl" p="lg" className={styles.activityCard}>
                  <Stack gap="md">
                    <Group justify="space-between" align="flex-start" gap="sm" wrap="nowrap">
                      <Stack gap={4}>
                        <Text fw={700} size="lg">
                          {tResults("testRequestIdLabel", { id: row.testRequestId })}
                        </Text>
                        <Text size="sm" c="dimmed">
                          {getTestRequestCreatorLabel(row) || "—"}
                        </Text>
                      </Stack>
                      <Badge color={getRequestStatusColor(row.status)} variant="light" radius="sm">
                        {translateRequestStatus(row.status, tResults)}
                      </Badge>
                    </Group>

                    <SimpleGrid cols={2} spacing="sm">
                      <Stack gap={2}>
                        <Text size="xs" tt="uppercase" c="dimmed">
                          {tResults("colResultDate")}
                        </Text>
                        <Text fw={500}>{formatDateTime(row.resultDate, locale)}</Text>
                      </Stack>
                      <Stack gap={2}>
                        <Text size="xs" tt="uppercase" c="dimmed">
                          {tResults("colCreatedAt")}
                        </Text>
                        <Text fw={500}>{formatDateTime(row.createdAt, locale)}</Text>
                      </Stack>
                    </SimpleGrid>

                    <Paper withBorder radius="lg" p="md" className={styles.activityPreview}>
                      <Stack gap="xs">
                        <Group justify="space-between" align="center" wrap="nowrap">
                          <Text size="xs" tt="uppercase" c="dimmed">
                            {tResults("colResultData")}
                          </Text>
                          {row.pdfUrl ? (
                            <Badge variant="light" color="blue" radius="sm">
                              PDF
                            </Badge>
                          ) : null}
                        </Group>
                        {preview.length > 0 ? (
                          preview.map((entry) => (
                            <Text key={entry} size="sm" lineClamp={1}>
                              {entry}
                            </Text>
                          ))
                        ) : (
                          <Text size="sm" c="dimmed">
                            —
                          </Text>
                        )}
                      </Stack>
                    </Paper>

                    <Group justify="flex-end" wrap="wrap" gap="xs">
                      <Button
                        variant="default"
                        radius="xl"
                        leftSection={<IconEye size={16} />}
                        onClick={() => setSelectedResult(row)}
                      >
                        {tc("open")}
                      </Button>
                      <Button
                        variant="light"
                        color="teal"
                        radius="xl"
                        leftSection={<IconDownload size={16} />}
                        loading={downloadingId === row.id}
                        onClick={() => void handleDownload(row)}
                      >
                        {tResults("downloadPdf")}
                      </Button>
                    </Group>
                  </Stack>
                </Paper>
              );
            })}
          </SimpleGrid>

          {data.totalPages > 1 ? (
            <Group justify="center">
              <Pagination value={page} onChange={setPage} total={data.totalPages} radius="xl" />
            </Group>
          ) : null}
        </>
      ) : null}

      {selectedResult ? (
        <ViewTestResultModal
          opened={Boolean(selectedResult)}
          onClose={() => setSelectedResult(null)}
          testResult={selectedResult}
        />
      ) : null}
    </Stack>
  );
}

/** Shows patient insurance approval requests as cards with detail and delete actions. */
function PatientInsuranceApprovalsFeed() {
  const tProfile = useTranslations("dashboard.profile");
  const tTable = useTranslations("table");
  const tInsurance = useTranslations("myInsuranceApproval");
  const tc = useTranslations("admin.common");
  const locale = useLocale();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [detailId, setDetailId] = useState<number | null>(null);

  const { data, isPending, isError } = useQuery({
    queryKey: ["my-insurance-approval-requests", "profile-feed", page],
    queryFn: () =>
      insuranceApprovalService.findMine({
        query: {
          page: String(page),
          pageSize: String(PAGE_SIZE),
        },
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => insuranceApprovalService.remove(String(id)),
    onSuccess: async () => {
      notifications.show({
        title: tInsurance("deleteSuccessTitle"),
        message: tInsurance("deleteSuccessMessage"),
        color: "green",
      });
      await queryClient.invalidateQueries({ queryKey: ["my-insurance-approval-requests"] });
    },
    onError: () => {
      notifications.show({
        title: tInsurance("deleteConfirmTitle"),
        message: tInsurance("deleteError"),
        color: "red",
      });
    },
  });

  const confirmDelete = (row: InsuranceApprovalRequestItem) => {
    modals.openConfirmModal({
      title: tInsurance("deleteConfirmTitle"),
      centered: true,
      children: <Text size="sm">{tInsurance("deleteConfirmMessage")}</Text>,
      labels: {
        confirm: tInsurance("delete"),
        cancel: tInsurance("cancel"),
      },
      confirmProps: { color: "red", loading: deleteMutation.isPending },
      onConfirm: async () => {
        await deleteMutation.mutateAsync(row.id);
      },
    });
  };

  return (
    <Stack gap="md">
      <Group justify="space-between" align="center" wrap="wrap" gap="sm">
        <Badge variant="light" color="teal" radius="xl">
          {data?.totalCount ?? 0}
        </Badge>
        <Button
          onClick={() => setCreateOpen(true)}
          leftSection={<IconPlus size={16} />}
          variant="light"
          color="teal"
          radius="xl"
        >
          {tInsurance("newRequest")}
        </Button>
      </Group>

      {isPending ? <ActivitySkeletonList /> : null}
      {isError ? <Alert color="red">{tTable("emptyHint")}</Alert> : null}
      {!isPending && !isError && !data?.items.length ? (
        <EmptyFeedState title={tTable("emptyTitle")} description={tProfile("insuranceApprovalsDesc")} />
      ) : null}

      {!isPending && !isError && data?.items.length ? (
        <>
          <SimpleGrid cols={{ base: 1, xl: 2 }} spacing="md">
            {data.items.map((row) => (
              <Paper key={row.id} withBorder radius="xl" p="lg" className={styles.activityCard}>
                <Stack gap="md">
                  <Group justify="space-between" align="flex-start" gap="sm" wrap="nowrap">
                    <Stack gap={4}>
                      <Text fw={700} size="lg">
                        {row.insuredName}
                      </Text>
                      <Text size="sm" c="dimmed">
                        #{row.id} • {formatCompactDate(row.createdAt, locale)}
                      </Text>
                    </Stack>
                    <InsuranceStatusBadge value={row.status} />
                  </Group>

                  <SimpleGrid cols={2} spacing="sm">
                    <Stack gap={2}>
                      <Text size="xs" tt="uppercase" c="dimmed">
                        {tInsurance("colInsuranceNumber")}
                      </Text>
                      <Text fw={500}>{row.insuranceNumber || "—"}</Text>
                    </Stack>
                    <Stack gap={2}>
                      <Text size="xs" tt="uppercase" c="dimmed">
                        {tInsurance("colMobile")}
                      </Text>
                      <Text fw={500}>{row.mobileNumber || "—"}</Text>
                    </Stack>
                  </SimpleGrid>

                  <Paper withBorder radius="lg" p="md" className={styles.activityPreview}>
                    <Stack gap="xs">
                      <Text size="xs" tt="uppercase" c="dimmed">
                        {tProfile("updated")}
                      </Text>
                      <Text size="sm">
                        {formatDateTime(row.updatedAt || row.createdAt, locale)}
                      </Text>
                      {row.notes ? (
                        <>
                          <Text size="xs" tt="uppercase" c="dimmed" mt="xs">
                            {tInsurance("notes")}
                          </Text>
                          <Text size="sm" lineClamp={2}>
                            {row.notes}
                          </Text>
                        </>
                      ) : null}
                    </Stack>
                  </Paper>

                  <Group justify="flex-end" wrap="wrap" gap="xs">
                    <Button
                      variant="default"
                      radius="xl"
                      leftSection={<IconEye size={16} />}
                      onClick={() => setDetailId(row.id)}
                    >
                      {tInsurance("viewDetails")}
                    </Button>
                    <Button
                      variant="light"
                      color="red"
                      radius="xl"
                      leftSection={<IconTrash size={16} />}
                      onClick={() => confirmDelete(row)}
                    >
                      {tc("delete")}
                    </Button>
                  </Group>
                </Stack>
              </Paper>
            ))}
          </SimpleGrid>

          {data.totalPages > 1 ? (
            <Group justify="center">
              <Pagination value={page} onChange={setPage} total={data.totalPages} radius="xl" />
            </Group>
          ) : null}
        </>
      ) : null}

      <InsuranceApprovalCreateModal opened={createOpen} onClose={() => setCreateOpen(false)} />
      <InsuranceApprovalDetailModal
        opened={detailId !== null}
        requestId={detailId}
        onClose={() => setDetailId(null)}
      />
    </Stack>
  );
}

export {
  PatientInsuranceApprovalsFeed,
  PatientTestRequestsFeed,
  PatientTestResultsFeed,
};
