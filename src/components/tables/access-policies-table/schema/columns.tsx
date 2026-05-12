"use client";

import { Badge, Text } from "@mantine/core";
import { DataTableColumn } from "./types";
import { AccessPolicyTableItem } from "../types";
import { ActionsRender } from "./columns-rendering/actions-render";

type Translate = (key: string) => string;

function truncate(value: string, max: number): string {
  if (value.length <= max) return value;
  return `${value.slice(0, max)}…`;
}

const getAccessPolicyColumns = (
  t: Translate,
): DataTableColumn<AccessPolicyTableItem>[] => {
  return [
    {
      accessor: "resource",
      title: t("columnResource"),
      width: "14%",
      render: (row) => <Text size="sm">{truncate(row.resource || "—", 32)}</Text>,
    },
    {
      accessor: "action",
      title: t("columnAction"),
      width: "12%",
      render: (row) => <Text size="sm">{truncate(row.action || "—", 24)}</Text>,
    },
    {
      accessor: "effect",
      title: t("columnEffect"),
      width: "9%",
      render: (row) => (
        <Badge size="sm" variant="light" color={row.effect === "Allow" ? "green" : "red"}>
          {row.effect || "—"}
        </Badge>
      ),
    },
    {
      accessor: "subjectType",
      title: t("columnSubject"),
      width: "18%",
      render: (row) => (
        <Text size="sm">
          {row.subjectType}: {truncate(row.subjectKey || "—", 20)}
        </Text>
      ),
    },
    {
      accessor: "priority",
      title: t("columnPriority"),
      width: "8%",
      render: (row) => <Text size="sm">{row.priority ?? 0}</Text>,
    },
    {
      accessor: "isEnabled",
      title: t("columnEnabled"),
      width: "10%",
      render: (row) => (
        <Badge size="sm" variant="dot" color={row.isEnabled ? "teal" : "gray"}>
          {row.isEnabled ? t("enabledYes") : t("enabledNo")}
        </Badge>
      ),
    },
    {
      accessor: "description",
      title: t("columnDescription"),
      width: "17%",
      render: (row) => (
        <Text size="sm" c="dimmed">
          {truncate(row.description || "—", 48)}
        </Text>
      ),
    },
    {
      accessor: "actions",
      title: t("columnActions"),
      width: "10%",
      render: (row) => <ActionsRender row={row} />,
    },
  ];
};

export { getAccessPolicyColumns };
