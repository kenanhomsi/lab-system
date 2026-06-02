"use client";

import { specialAccountService } from "./special-service";
import { StatementPdfDocument } from "@/lib/pdf/statement-pdf";
import {
  Button,
  Card,
  Group,
  SimpleGrid,
  Stack,
  Table,
  Text,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { notifications } from "@mantine/notifications";
import { IconDownload } from "@tabler/icons-react";
import { pdf } from "@react-pdf/renderer";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { useState } from "react";

/**
 * Special account statement with payments, expenses, balance, and PDF export.
 */
export function SpecialAccountStatementView() {
  const t = useTranslations("specialPages");
  const [fromDate, setFromDate] = useState<string | null>(
    dayjs().subtract(30, "day").format("YYYY-MM-DD"),
  );
  const [toDate, setToDate] = useState<string | null>(dayjs().format("YYYY-MM-DD"));

  const from = fromDate ? dayjs(fromDate).format("YYYY-MM-DD") : undefined;
  const to = toDate ? dayjs(toDate).format("YYYY-MM-DD") : undefined;

  const statementQuery = useQuery({
    queryKey: ["special-statement", from, to],
    queryFn: () => specialAccountService.getStatement({ from, to }),
  });

  const data = statementQuery.data;

  const handleExportPdf = async () => {
    if (!data) return;
    try {
      const blob = await pdf(
        StatementPdfDocument({
          dateFrom: from ?? "",
          dateTo: to ?? "",
          payments: data.payments.map((p) => ({
            date: p.date,
            amount: String(p.amount),
            description: p.description,
          })),
          expenses: data.expenses.map((e) => ({
            date: e.date,
            amount: String(e.amount),
            expenseType: e.expenseType,
          })),
          totalPayments: String(data.totalPayments),
          totalExpenses: String(data.totalExpenses),
          balance: String(data.balance),
        }),
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "special-statement.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      notifications.show({ color: "red", message: t("loading") });
    }
  };

  return (
    <Stack gap="lg">
      <Text fw={700} fz={26}>
        {t("accountStatement")}
      </Text>

      <Group align="flex-end">
        <DateInput label={t("from")} value={fromDate} onChange={setFromDate} />
        <DateInput label={t("to")} value={toDate} onChange={setToDate} />
        <Button
          leftSection={<IconDownload size={16} />}
          variant="light"
          onClick={() => void handleExportPdf()}
          disabled={!data}
        >
          {t("exportPDF")}
        </Button>
      </Group>

      {data && (
        <SimpleGrid cols={{ base: 1, sm: 3 }}>
          <Card withBorder padding="md">
            <Text size="xs" c="dimmed">
              {t("totalPayments")}
            </Text>
            <Text fw={700}>{data.totalPayments.toLocaleString()}</Text>
          </Card>
          <Card withBorder padding="md">
            <Text size="xs" c="dimmed">
              {t("totalExpenses")}
            </Text>
            <Text fw={700}>{data.totalExpenses.toLocaleString()}</Text>
          </Card>
          <Card withBorder padding="md">
            <Text size="xs" c="dimmed">
              {t("balance")}
            </Text>
            <Text fw={700} c={data.balance >= 0 ? "teal" : "red"}>
              {data.balance.toLocaleString()}
            </Text>
          </Card>
        </SimpleGrid>
      )}

      {statementQuery.isLoading && <Text>{t("loading")}</Text>}

      {data && (
        <>
          <Text fw={600}>{t("payments")}</Text>
          <Table.ScrollContainer minWidth={500}>
            <Table withTableBorder striped>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>{t("date")}</Table.Th>
                  <Table.Th>{t("amount")}</Table.Th>
                  <Table.Th>{t("description")}</Table.Th>
                  <Table.Th>{t("note")}</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {data.payments.length === 0 ? (
                  <Table.Tr>
                    <Table.Td colSpan={4}>
                      <Text c="dimmed">{t("noPaymentsInRange")}</Text>
                    </Table.Td>
                  </Table.Tr>
                ) : (
                  data.payments.map((p) => (
                    <Table.Tr key={p.id}>
                      <Table.Td>{p.date}</Table.Td>
                      <Table.Td>{p.amount}</Table.Td>
                      <Table.Td>{p.description}</Table.Td>
                      <Table.Td>{p.note}</Table.Td>
                    </Table.Tr>
                  ))
                )}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>

          <Text fw={600} mt="md">
            {t("expenses")}
          </Text>
          <Table.ScrollContainer minWidth={500}>
            <Table withTableBorder striped>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>{t("date")}</Table.Th>
                  <Table.Th>{t("amount")}</Table.Th>
                  <Table.Th>{t("expenseType")}</Table.Th>
                  <Table.Th>{t("note")}</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {data.expenses.length === 0 ? (
                  <Table.Tr>
                    <Table.Td colSpan={4}>
                      <Text c="dimmed">{t("noExpensesInRange")}</Text>
                    </Table.Td>
                  </Table.Tr>
                ) : (
                  data.expenses.map((e) => (
                    <Table.Tr key={e.id}>
                      <Table.Td>{e.date}</Table.Td>
                      <Table.Td>{e.amount}</Table.Td>
                      <Table.Td>{e.expenseType}</Table.Td>
                      <Table.Td>{e.note}</Table.Td>
                    </Table.Tr>
                  ))
                )}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        </>
      )}
    </Stack>
  );
}
