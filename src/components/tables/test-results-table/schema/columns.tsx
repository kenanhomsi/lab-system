"use client";

import { isClinicalPatientUser } from "@/components/modals/test-requests/party-ids";
import { Anchor, Badge, Checkbox, Group, Text } from "@mantine/core";
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
  selectedIds?: number[] | undefined;
  visibleRows?: TestResultItem[] | undefined;
  onSelectedIdsChange?: ((ids: number[]) => void) | undefined;
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
  const selectedIds = options?.selectedIds ?? [];
  const visibleRows = options?.visibleRows ?? [];
  const visibleIds = visibleRows.map((row) => row.id);
  const selectedVisibleIds = visibleIds.filter((id) => selectedIds.includes(id));
  const allVisibleSelected = visibleIds.length > 0 && selectedVisibleIds.length === visibleIds.length;
  const someVisibleSelected = selectedVisibleIds.length > 0 && !allVisibleSelected;
  const onSelectedIdsChange = options?.onSelectedIdsChange;

  const toggleRowSelection = (rowId: number, checked: boolean) => {
    if (!onSelectedIdsChange) return;
    if (checked) {
      onSelectedIdsChange(Array.from(new Set([...selectedIds, rowId])));
      return;
    }
    onSelectedIdsChange(selectedIds.filter((id) => id !== rowId));
  };

  const toggleVisibleSelection = (checked: boolean) => {
    if (!onSelectedIdsChange) return;
    if (checked) {
      onSelectedIdsChange(Array.from(new Set([...selectedIds, ...visibleIds])));
      return;
    }
    onSelectedIdsChange(selectedIds.filter((id) => !visibleIds.includes(id)));
  };

  const columns: DataTableColumn<TestResultItem>[] = [
    {
      accessor: "select",
      title: (
        <Checkbox
          size="xs"
          aria-label={t("selectAllRows")}
          checked={allVisibleSelected}
          indeterminate={someVisibleSelected}
          disabled={visibleIds.length === 0}
          onChange={(event) => toggleVisibleSelection(event.currentTarget.checked)}
          onClick={(event) => event.stopPropagation()}
        />
      ),
      width: "4%",
      render: (row) => (
        <Checkbox
          size="xs"
          aria-label={t("selectRow")}
          checked={selectedIds.includes(row.id)}
          onChange={(event) => toggleRowSelection(row.id, event.currentTarget.checked)}
          onClick={(event) => event.stopPropagation()}
        />
      ),
    },
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

  columns.push({
    accessor: "actions",
    title: "",
    width: readOnly ? "6%" : "9%",
    render: (row) => <ActionsRender row={row} canManage={!readOnly} />,
  });

  return columns;
};

export { getTestResultsColumns };
export type { GetTestResultsColumnsOptions };
