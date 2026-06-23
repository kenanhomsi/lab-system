"use client";

import { Badge, Text } from "@mantine/core";
import type { AvailabilityRow } from "../types";
import type { DataTableColumn } from "./types";
import { ActionsRender } from "./columns-rendering";
import { DAY_KEYS, formatTimeCell } from "../utils/format";

type Translate = (key: string) => string;

/**
 * Creates availabilities table column definitions.
 */
const getAvailabilityColumns = (t: Translate): DataTableColumn<AvailabilityRow>[] => [
  {
    accessor: "dayOfWeek",
    title: t("columnDay"),
    width: "16%",
    render: (row) => {
      const key = DAY_KEYS[Math.max(0, Math.min(6, row.dayOfWeek))];
      return (
        <Badge variant="light" color="teal" radius="md">
          {t(`days.${key}`)}
        </Badge>
      );
    },
  },
  {
    accessor: "startTime",
    title: t("columnStartTime"),
    width: "14%",
    render: (row) => <Text size="sm">{formatTimeCell(row.startTime)}</Text>,
  },
  {
    accessor: "endTime",
    title: t("columnEndTime"),
    width: "14%",
    render: (row) => <Text size="sm">{formatTimeCell(row.endTime)}</Text>,
  },
  {
    accessor: "slotDuration",
    title: t("columnSlotDuration"),
    width: "14%",
    render: (row) => (
      <Text size="sm">
        {row.slotDuration} {t("minutesShort")}
      </Text>
    ),
  },
  {
    accessor: "userId",
    title: t("columnScope"),
    width: "20%",
    render: (row) =>
      row.userId ? (
        <TooltipUserId value={row.userId} />
      ) : (
        <Badge variant="dot" color="gray" size="sm">
          {t("scopeAll")}
        </Badge>
      ),
  },
  {
    accessor: "isActive",
    title: t("columnStatus"),
    width: "12%",
    render: (row) => (
      <Badge variant="light" color={row.isActive ? "teal" : "gray"}>
        {row.isActive ? t("active") : t("inactive")}
      </Badge>
    ),
  },
  {
    accessor: "actions",
    title: t("columnActions"),
    width: "10%",
    render: (row) => <ActionsRender row={row} />,
  },
];

/**
 * Shows a truncated user id with full value on hover.
 */
const TooltipUserId = ({ value }: { value: string }) => (
  <Text size="xs" c="dimmed" lineClamp={1} title={value} ff="monospace">
    {value.slice(0, 8)}…
  </Text>
);

export { getAvailabilityColumns };
