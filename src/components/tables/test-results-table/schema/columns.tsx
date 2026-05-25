"use client";

import { isClinicalPatientUser } from "@/components/modals/test-requests/party-ids";
import { Anchor, Badge, Group, Text } from "@mantine/core";
import { IconExternalLink } from "@tabler/icons-react";
import { getTestRequestCreatorLabel } from "../get-test-request-creator-label";
import { TestResultItem } from "../types";
import { ActionsRender } from "./columns-rendering/actions-render";
import { DateRender } from "./columns-rendering/date-render";
import { ResultDataCell } from "./columns-rendering/result-data-cell";
import { DataTableColumn } from "./types";

type TFunction = (key: string) => string;

type GetTestResultsColumnsOptions = {
  roles?: string[] | undefined;
};

const numStyle = { fontVariantNumeric: "tabular-nums" as const };

function cellText(value: unknown, whenEmpty = "-"): string {
  if (value === null || value === undefined || value === "") return whenEmpty;
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  try {
    return JSON.stringify(value);
  } catch {
    return whenEmpty;
  }
}

function statusBadgeColor(status: string): string {
  const normalized = status.trim().toLowerCase().replace(/\s+/g, "_").replace(/-/g, "_");
  if (normalized === "pending") return "orange";
  if (normalized === "in_progress") return "blue";
  if (
    normalized === "failed" ||
    normalized === "cancelled" ||
    normalized === "canceled" ||
    normalized === "rejected"
  ) {
    return "red";
  }
  if (
    normalized === "completed" ||
    normalized === "complete" ||
    normalized === "ready"
  ) {
    return "teal";
  }
  return "gray";
}

function translateStatusLabel(raw: string, t: TFunction): string {
  const normalized = raw.trim().toLowerCase().replace(/\s+/g, " ").replace(/-/g, "_");
  if (normalized === "pending") return t("statusPending");
  if (normalized === "in_progress" || normalized === "in progress") return t("statusInProgress");
  if (normalized === "completed" || normalized === "complete" || normalized === "ready") {
    return t("statusCompleted");
  }
  if (normalized === "cancelled" || normalized === "canceled") return t("statusCancelled");
  if (normalized === "failed" || normalized === "rejected") return t("statusRejected");
  return raw.trim() || "—";
}

const getTestResultsColumns = (
  t: TFunction,
  options?: GetTestResultsColumnsOptions,
): DataTableColumn<TestResultItem>[] => {
  const readOnly = isClinicalPatientUser(options?.roles);

  const columns: DataTableColumn<TestResultItem>[] = [
    {
      accessor: "id",
      title: t("colId"),
      width: "7%",
      render: (row) => (
        <Text size="sm" py={4} fw={600} style={numStyle}>
          {row.id}
        </Text>
      ),
    },
    {
      accessor: "testRequestId",
      title: t("colTestRequestId"),
      width: "8%",
      render: (row) => (
        <Text size="sm" py={4} style={numStyle}>
          {row.testRequestId}
        </Text>
      ),
    },
    {
      accessor: "testRequestCreatedByFullName",
      title: t("colRequestCreatedBy"),
      width: "14%",
      render: (row) => {
        const label = getTestRequestCreatorLabel(row);
        return (
          <Text size="sm" py={4} c={label ? undefined : "dimmed"}>
            {label || "—"}
          </Text>
        );
      },
    },
    {
      accessor: "resultDate",
      title: t("colResultDate"),
      width: "12%",
      render: (row) => <DateRender value={row.resultDate} context="result" />,
    },
    {
      accessor: "resultData",
      title: t("colResultData"),
      width: "24%",
      render: (row) => <ResultDataCell value={row.resultData} />,
    },
    {
      accessor: "pdfUrl",
      title: t("colPdfUrl"),
      width: "10%",
      render: (row) =>
        row.pdfUrl ? (
          <Anchor href={row.pdfUrl} target="_blank" rel="noreferrer" size="sm" py={4} underline="hover">
            <Group gap={6} wrap="nowrap">
              <IconExternalLink size={14} stroke={1.6} />
              PDF
            </Group>
          </Anchor>
        ) : (
          <Text size="sm" py={4} c="dimmed">
            —
          </Text>
        ),
    },
    {
      accessor: "status",
      title: t("tableStatus"),
      width: "10%",
      render: (row) => {
        const raw = cellText(row.status, "");
        const label = translateStatusLabel(raw, t);
        return (
          <Badge
            color={statusBadgeColor(raw)}
            variant="light"
            radius="sm"
            size="sm"
            tt="none"
            styles={{ label: { textTransform: "none", fontWeight: 500 } }}
          >
            {label}
          </Badge>
        );
      },
    },
    {
      accessor: "createdAt",
      title: t("colCreatedAt"),
      width: "12%",
      render: (row) => <DateRender value={row.createdAt} context="created" />,
    },
  ];

  if (!readOnly) {
    columns.push({
      accessor: "actions",
      title: "",
      width: "6%",
      render: (row) => <ActionsRender row={row} />,
    });
  }

  return columns;
};

export { getTestResultsColumns };
export type { GetTestResultsColumnsOptions };
