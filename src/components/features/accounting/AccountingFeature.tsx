"use client";

import type {
  AccountingPayment,
  AccountingStatement,
} from "@/modules/accounting/abstraction/schemas";
import { accountingService } from "./accounting-service";
import { downloadBlob, exportAccountingPdfClient } from "./export-accounting-pdf";
import { frontendContainer } from "@/container/frontend";
import { UserFrontendService, userModuleNames } from "@/modules/user";
import { useSessionUserStore } from "@/stores/session-user-store";
import {
  ActionIcon,
  Alert,
  Badge,
  Button,
  Card,
  FileInput,
  Grid,
  Group,
  Modal,
  NumberInput,
  Select,
  SimpleGrid,
  Stack,
  Table,
  Tabs,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconDownload,
  IconEdit,
  IconPlus,
  IconTrash,
  IconUpload,
} from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";

const userService = frontendContainer.get<UserFrontendService>(
  userModuleNames.service,
);

export type AccountingFeatureMode = "admin" | "lab";

type PaymentFormState = {
  labClientId: string;
  amount: number;
  paidAt: string;
  paymentMethod: string;
  referenceNumber: string;
  notes: string;
};

function emptyPaymentForm(labClientId: string): PaymentFormState {
  return {
    labClientId,
    amount: 0,
    paidAt: new Date().toISOString(),
    paymentMethod: "Cash",
    referenceNumber: "",
    notes: "",
  };
}

function AnnouncementHeader({
  statement,
  locale,
}: {
  statement: AccountingStatement | undefined;
  locale: string;
}) {
  const settings = statement?.settings;
  if (!settings?.isActive) return null;
  const isAr = locale === "ar";
  return (
    <Alert color="cyan" variant="light" radius="md">
      <Text fw={700} size="sm">
        {isAr ? settings.announcementTextAr : settings.announcementTextEn}
      </Text>
      <Text fw={600} mt="xs">
        {isAr ? settings.titleAr : settings.titleEn}
      </Text>
      <Text size="sm" c="dimmed" mt={4}>
        {isAr ? settings.descriptionAr : settings.descriptionEn}
      </Text>
    </Alert>
  );
}

/**
 * Lab accounting dashboard: statement + payments tabs for admin and lab partner.
 */
export function AccountingFeature({ mode }: { mode: AccountingFeatureMode }) {
  const t = useTranslations("labPages");
  const ta = useTranslations("admin.accounting");
  const locale = useLocale();
  const queryClient = useQueryClient();
  const sessionUser = useSessionUserStore((s) => s.user);
  const isAdmin = mode === "admin";

  const [activeTab, setActiveTab] = useState<string | null>("statement");
  const [fromDate, setFromDate] = useState<string | null>(
    dayjs().subtract(30, "day").format("YYYY-MM-DD"),
  );
  const [toDate, setToDate] = useState<string | null>(
    dayjs().format("YYYY-MM-DD"),
  );
  const [labClientId, setLabClientId] = useState("");
  const [paymentsPage, setPaymentsPage] = useState(1);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadNotes, setUploadNotes] = useState("");
  const [paymentModalOpen, { open: openPaymentModal, close: closePaymentModal }] =
    useDisclosure(false);
  const [editingPayment, setEditingPayment] = useState<AccountingPayment | null>(
    null,
  );
  const [paymentForm, setPaymentForm] = useState<PaymentFormState>(
    emptyPaymentForm(""),
  );

  const effectiveLabId = isAdmin ? labClientId : (sessionUser?.id ?? "");

  const fromIso = fromDate
    ? dayjs(fromDate).startOf("day").toISOString()
    : undefined;
  const toIso = toDate ? dayjs(toDate).endOf("day").toISOString() : undefined;

  const labPartnersQuery = useQuery({
    queryKey: ["lab-partners-for-accounting"],
    queryFn: async () => {
      const res = await userService.findAll({
        query: { Role: "LabPartner", PageSize: "100" },
      });
      return res?.data?.items ?? [];
    },
    enabled: isAdmin,
  });

  const labOptions = useMemo(
    () =>
      (labPartnersQuery.data ?? []).map((u) => ({
        value: u.id,
        label: u.fullName || u.email || u.id,
      })),
    [labPartnersQuery.data],
  );

  const statementQuery = useQuery({
    queryKey: ["accounting-statement", effectiveLabId, fromIso, toIso],
    queryFn: () =>
      accountingService.getStatement({
        labClientId: effectiveLabId,
        from: fromIso,
        to: toIso,
      }),
    enabled: Boolean(effectiveLabId.trim()),
  });

  const paymentsQuery = useQuery({
    queryKey: [
      "accounting-payments",
      effectiveLabId,
      fromIso,
      toIso,
      paymentsPage,
    ],
    queryFn: () =>
      accountingService.listPayments({
        labClientId: effectiveLabId || undefined,
        from: fromIso,
        to: toIso,
        page: paymentsPage,
        pageSize: 20,
      }),
    enabled: Boolean(effectiveLabId.trim()) && activeTab === "payments",
  });

  const savePaymentMutation = useMutation({
    mutationFn: async () => {
      if (editingPayment) {
        return accountingService.updatePayment({
          id: editingPayment.id,
          ...paymentForm,
        });
      }
      return accountingService.createPayment(paymentForm);
    },
    onSuccess: () => {
      notifications.show({
        color: "green",
        message: ta("paymentSaved"),
      });
      closePaymentModal();
      setEditingPayment(null);
      void queryClient.invalidateQueries({ queryKey: ["accounting-payments"] });
      void queryClient.invalidateQueries({ queryKey: ["accounting-statement"] });
    },
    onError: () => {
      notifications.show({ color: "red", message: t("loadError") });
    },
  });

  const deletePaymentMutation = useMutation({
    mutationFn: (id: number) => accountingService.deletePayment(id),
    onSuccess: () => {
      notifications.show({ color: "green", message: ta("paymentDeleted") });
      void queryClient.invalidateQueries({ queryKey: ["accounting-payments"] });
      void queryClient.invalidateQueries({ queryKey: ["accounting-statement"] });
    },
  });

  const uploadPdfMutation = useMutation({
    mutationFn: async () => {
      if (!uploadFile || !effectiveLabId || !fromIso || !toIso) {
        throw new Error("Missing upload fields");
      }
      return accountingService.uploadStatementPdf({
        labClientId: effectiveLabId,
        from: fromIso,
        to: toIso,
        file: uploadFile,
        notes: uploadNotes,
      });
    },
    onSuccess: () => {
      notifications.show({ color: "green", message: ta("pdfUploaded") });
      setUploadFile(null);
      setUploadNotes("");
      void queryClient.invalidateQueries({ queryKey: ["accounting-statement"] });
    },
    onError: () => {
      notifications.show({ color: "red", message: t("loadError") });
    },
  });

  const handleDownloadServerPdf = async () => {
    if (!effectiveLabId) return;
    try {
      const blob = await accountingService.downloadStatementPdf({
        labClientId: effectiveLabId,
        from: fromIso,
        to: toIso,
      });
      downloadBlob(blob, "account-statement.pdf");
    } catch {
      notifications.show({ color: "red", message: t("loadError") });
    }
  };

  const handleExportClientPdf = async () => {
    if (!statementQuery.data) return;
    try {
      await exportAccountingPdfClient({
        statement: statementQuery.data,
        locale,
        currency: t("currency"),
      });
    } catch {
      notifications.show({ color: "red", message: t("loadError") });
    }
  };

  const openCreatePayment = () => {
    setEditingPayment(null);
    setPaymentForm(emptyPaymentForm(effectiveLabId));
    openPaymentModal();
  };

  const openEditPayment = (payment: AccountingPayment) => {
    setEditingPayment(payment);
    setPaymentForm({
      labClientId: payment.labClientId,
      amount: payment.amount,
      paidAt: payment.paidAt,
      paymentMethod: payment.paymentMethod,
      referenceNumber: payment.referenceNumber,
      notes: payment.notes,
    });
    openPaymentModal();
  };

  const statement = statementQuery.data;
  const isAr = locale === "ar";

  return (
    <Stack gap="lg" p={{ base: "sm", md: "md" }}>
      <div>
        <Group gap="sm">
          <Badge variant="light" color="teal">
            {t("accountingBadge")}
          </Badge>
        </Group>
        <Text fw={700} fz={26} mt="xs">
          {t("accounting")}
        </Text>
        <Text c="dimmed" size="sm">
          {t("accountingDesc")}
        </Text>
      </div>

      <AnnouncementHeader statement={statement} locale={locale} />

      <Card withBorder radius="md" padding="md">
        <Grid gap="md">
          {isAdmin && (
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Select
                label={ta("labPartner")}
                placeholder={ta("selectLabPartner")}
                data={labOptions}
                value={labClientId || null}
                onChange={(v) => setLabClientId(v ?? "")}
                searchable
              />
            </Grid.Col>
          )}
          <Grid.Col span={{ base: 12, md: isAdmin ? 4 : 6 }}>
            <DateInput
              label={t("from")}
              value={fromDate}
              onChange={setFromDate}
              maxDate={toDate ?? undefined}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: isAdmin ? 4 : 6 }}>
            <DateInput
              label={t("to")}
              value={toDate}
              onChange={setToDate}
              minDate={fromDate ?? undefined}
            />
          </Grid.Col>
        </Grid>
      </Card>

      {!effectiveLabId && isAdmin && (
        <Alert color="yellow">{ta("selectLabPartner")}</Alert>
      )}

      {statement && (
        <SimpleGrid cols={{ base: 1, sm: 3 }}>
          <Card withBorder padding="md">
            <Text size="xs" c="dimmed">
              {ta("labName")}
            </Text>
            <Text fw={700}>{statement.labName}</Text>
          </Card>
          <Card withBorder padding="md">
            <Text size="xs" c="dimmed">
              {ta("outstandingBalance")}
            </Text>
            <Text fw={700} c="orange">
              {statement.labOutstandingBalance.toLocaleString()} {t("currency")}
            </Text>
          </Card>
          <Card withBorder padding="md">
            <Text size="xs" c="dimmed">
              {t("balanceDue")}
            </Text>
            <Text fw={700} c="red">
              {statement.totals.remainingAmount.toLocaleString()} {t("currency")}
            </Text>
          </Card>
        </SimpleGrid>
      )}

      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="statement">{ta("statementTab")}</Tabs.Tab>
          <Tabs.Tab value="payments">{t("payments")}</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="statement" pt="md">
          <Stack gap="md">
            <Group>
              <Button
                leftSection={<IconDownload size={16} />}
                variant="light"
                onClick={() => void handleDownloadServerPdf()}
                disabled={!effectiveLabId}
              >
                {t("downloadPDF")}
              </Button>
              <Button
                leftSection={<IconDownload size={16} />}
                variant="outline"
                onClick={() => void handleExportClientPdf()}
                disabled={!statement}
              >
                {ta("exportClientPdf")}
              </Button>
            </Group>

            <Group align="flex-end" wrap="wrap">
              <FileInput
                label={t("uploadPDF")}
                placeholder={ta("choosePdf")}
                accept="application/pdf"
                value={uploadFile}
                onChange={setUploadFile}
                flex={1}
                miw={200}
              />
              <TextInput
                label={ta("uploadNotes")}
                value={uploadNotes}
                onChange={(e) => setUploadNotes(e.currentTarget.value)}
                flex={1}
                miw={200}
              />
              <Button
                leftSection={<IconUpload size={16} />}
                loading={uploadPdfMutation.isPending}
                onClick={() => uploadPdfMutation.mutate()}
                disabled={!uploadFile || !effectiveLabId}
              >
                {t("uploadPDF")}
              </Button>
            </Group>

            {statementQuery.isLoading && <Text>{ta("loading")}</Text>}
            {statementQuery.isError && (
              <Alert color="red">{t("loadError")}</Alert>
            )}

            {statement && (
              <>
                <Table.ScrollContainer minWidth={600}>
                  <Table striped highlightOnHover withTableBorder>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>{t("patient")}</Table.Th>
                        <Table.Th>{ta("testName")}</Table.Th>
                        <Table.Th>{t("price")}</Table.Th>
                        <Table.Th>{t("payments")}</Table.Th>
                        <Table.Th>{ta("requestDate")}</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {statement.rows.length === 0 ? (
                        <Table.Tr>
                          <Table.Td colSpan={5}>
                            <Text ta="center" c="dimmed">
                              {t("noEntries")}
                            </Text>
                          </Table.Td>
                        </Table.Tr>
                      ) : (
                        statement.rows.map((row) => (
                          <Table.Tr key={`${row.testRequestId}-${row.requestDate}`}>
                            <Table.Td>{row.patientName}</Table.Td>
                            <Table.Td>
                              {isAr ? row.testNameAr : row.testNameEn}
                            </Table.Td>
                            <Table.Td>
                              {row.testPrice.toLocaleString()} {t("currency")}
                            </Table.Td>
                            <Table.Td>
                              {row.paymentsApplied.toLocaleString()} {t("currency")}
                            </Table.Td>
                            <Table.Td>
                              {dayjs(row.requestDate).format("YYYY-MM-DD")}
                            </Table.Td>
                          </Table.Tr>
                        ))
                      )}
                    </Table.Tbody>
                  </Table>
                </Table.ScrollContainer>

                <Card withBorder padding="md" bg="gray.0">
                  <Group justify="space-between">
                    <Text>{t("totalTests")}</Text>
                    <Text fw={700}>
                      {statement.totals.totalTestsAmount.toLocaleString()}{" "}
                      {t("currency")}
                    </Text>
                  </Group>
                  <Group justify="space-between" mt="xs">
                    <Text>{t("totalPayments")}</Text>
                    <Text fw={700}>
                      {statement.totals.totalPayments.toLocaleString()}{" "}
                      {t("currency")}
                    </Text>
                  </Group>
                  <Group justify="space-between" mt="xs">
                    <Text>{ta("remaining")}</Text>
                    <Text fw={700} c="red">
                      {statement.totals.remainingAmount.toLocaleString()}{" "}
                      {t("currency")}
                    </Text>
                  </Group>
                </Card>

                <SimpleGrid cols={{ base: 2, sm: 4 }}>
                  <Card withBorder padding="sm">
                    <Text size="xs" c="dimmed">
                      {ta("testsCount")}
                    </Text>
                    <Text fw={600}>{statement.analysis.testsCount}</Text>
                  </Card>
                  <Card withBorder padding="sm">
                    <Text size="xs" c="dimmed">
                      {ta("patientsCount")}
                    </Text>
                    <Text fw={600}>
                      {statement.analysis.distinctPatientsCount}
                    </Text>
                  </Card>
                  <Card withBorder padding="sm">
                    <Text size="xs" c="dimmed">
                      {ta("avgTestPrice")}
                    </Text>
                    <Text fw={600}>
                      {statement.analysis.averageTestPrice.toFixed(0)}
                    </Text>
                  </Card>
                  <Card withBorder padding="sm">
                    <Text size="xs" c="dimmed">
                      {ta("coverage")}
                    </Text>
                    <Text fw={600}>
                      {statement.analysis.paymentCoveragePercentage}%
                    </Text>
                  </Card>
                </SimpleGrid>
              </>
            )}
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="payments" pt="md">
          <Stack gap="md">
            <Group justify="flex-end">
              <Button
                leftSection={<IconPlus size={16} />}
                onClick={openCreatePayment}
                disabled={!effectiveLabId}
              >
                {ta("newPayment")}
              </Button>
            </Group>

            {paymentsQuery.isLoading && <Text>{ta("loading")}</Text>}

            {paymentsQuery.data && (
              <>
                <Table.ScrollContainer minWidth={700}>
                  <Table striped highlightOnHover withTableBorder>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>{t("date")}</Table.Th>
                        <Table.Th>{ta("amount")}</Table.Th>
                        <Table.Th>{ta("paymentMethod")}</Table.Th>
                        <Table.Th>{ta("referenceNumber")}</Table.Th>
                        <Table.Th>{ta("notes")}</Table.Th>
                        <Table.Th>{ta("actions")}</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {paymentsQuery.data.items.length === 0 ? (
                        <Table.Tr>
                          <Table.Td colSpan={6}>
                            <Text ta="center" c="dimmed">
                              {ta("noPayments")}
                            </Text>
                          </Table.Td>
                        </Table.Tr>
                      ) : (
                        paymentsQuery.data.items.map((payment) => (
                          <Table.Tr key={payment.id}>
                            <Table.Td>
                              {dayjs(payment.paidAt).format("YYYY-MM-DD")}
                            </Table.Td>
                            <Table.Td>
                              {payment.amount.toLocaleString()} {t("currency")}
                            </Table.Td>
                            <Table.Td>{payment.paymentMethod}</Table.Td>
                            <Table.Td>{payment.referenceNumber}</Table.Td>
                            <Table.Td>{payment.notes}</Table.Td>
                            <Table.Td>
                              <Group gap={4}>
                                <ActionIcon
                                  variant="subtle"
                                  onClick={() => openEditPayment(payment)}
                                >
                                  <IconEdit size={16} />
                                </ActionIcon>
                                <ActionIcon
                                  variant="subtle"
                                  color="red"
                                  onClick={() =>
                                    deletePaymentMutation.mutate(payment.id)
                                  }
                                >
                                  <IconTrash size={16} />
                                </ActionIcon>
                              </Group>
                            </Table.Td>
                          </Table.Tr>
                        ))
                      )}
                    </Table.Tbody>
                  </Table>
                </Table.ScrollContainer>

                <Group justify="center">
                  <Button
                    variant="default"
                    disabled={!paymentsQuery.data.hasPreviousPage}
                    onClick={() => setPaymentsPage((p) => Math.max(1, p - 1))}
                  >
                    {ta("prevPage")}
                  </Button>
                  <Text size="sm">
                    {paymentsPage} / {paymentsQuery.data.totalPages || 1}
                  </Text>
                  <Button
                    variant="default"
                    disabled={!paymentsQuery.data.hasNextPage}
                    onClick={() => setPaymentsPage((p) => p + 1)}
                  >
                    {ta("nextPage")}
                  </Button>
                </Group>
              </>
            )}
          </Stack>
        </Tabs.Panel>
      </Tabs>

      <Modal
        opened={paymentModalOpen}
        onClose={closePaymentModal}
        title={editingPayment ? ta("editPayment") : ta("newPayment")}
      >
        <Stack gap="md">
          {isAdmin && (
            <Select
              label={ta("labPartner")}
              data={labOptions}
              value={paymentForm.labClientId || null}
              onChange={(v) =>
                setPaymentForm((f) => ({ ...f, labClientId: v ?? "" }))
              }
            />
          )}
          <DateInput
            label={t("date")}
            value={dayjs(paymentForm.paidAt).format("YYYY-MM-DD")}
            onChange={(d) =>
              setPaymentForm((f) => ({
                ...f,
                paidAt: d ? dayjs(d).toISOString() : f.paidAt,
              }))
            }
          />
          <NumberInput
            label={ta("amount")}
            min={0}
            value={paymentForm.amount}
            onChange={(v) =>
              setPaymentForm((f) => ({ ...f, amount: Number(v) || 0 }))
            }
          />
          <TextInput
            label={ta("paymentMethod")}
            value={paymentForm.paymentMethod}
            onChange={(e) => {
              const paymentMethod = e.currentTarget.value;
              setPaymentForm((f) => ({ ...f, paymentMethod }));
            }}
          />
          <TextInput
            label={ta("referenceNumber")}
            value={paymentForm.referenceNumber}
            onChange={(e) => {
              const referenceNumber = e.currentTarget.value;
              setPaymentForm((f) => ({ ...f, referenceNumber }));
            }}
          />
          <Textarea
            label={ta("notes")}
            value={paymentForm.notes}
            onChange={(e) => {
              const notes = e.currentTarget.value;
              setPaymentForm((f) => ({ ...f, notes }));
            }}
          />
          <Button
            loading={savePaymentMutation.isPending}
            onClick={() => savePaymentMutation.mutate()}
          >
            {ta("savePayment")}
          </Button>
        </Stack>
      </Modal>
    </Stack>
  );
}
