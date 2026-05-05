"use client";

import { Anchor, Badge, Group, Text } from "@mantine/core";
import { IconExternalLink } from "@tabler/icons-react";
import { TestResultItem } from "../types";
import { ActionsRender } from "./columns-rendering/actions-render";
import { DateRender } from "./columns-rendering/date-render";
import { ResultDataCell } from "./columns-rendering/result-data-cell";
import { DataTableColumn } from "./types";

type TFunction = (key: string) => string;

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
  const normalized = status.trim().toLowerCase();
  if (normalized === "pending") return "orange";
  if (normalized === "failed" || normalized === "cancelled" || normalized === "canceled") return "red";
  if (
    normalized === "completed" ||
    normalized === "complete" ||
    normalized === "ready"
  ) {
    return "teal";
  }
  return "gray";
}

const getTestResultsColumns = (t: TFunction): DataTableColumn<TestResultItem>[] => {
  return [
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
      width: "9%",
      render: (row) => (
        <Text size="sm" py={4} style={numStyle}>
          {row.testRequestId}
        </Text>
      ),
    },
    {
      accessor: "resultDate",
      title: t("colResultDate"),
      width: "12%",
      render: (row) => <DateRender value={row.resultDate} />,
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
        const label = cellText(row.status, "");
        return (
          <Badge
            color={statusBadgeColor(label)}
            variant="light"
            radius="sm"
            size="sm"
            tt="none"
            styles={{ label: { textTransform: "none" } }}
          >
            {label || "—"}
          </Badge>
        );
      },
    },
    {
      accessor: "createdAt",
      title: t("colCreatedAt"),
      width: "12%",
      render: (row) => <DateRender value={row.createdAt} />,
    },
    { accessor: "actions", title: "", width: "6%", render: (row) => <ActionsRender row={row} /> },
  ];
};

export { getTestResultsColumns };
