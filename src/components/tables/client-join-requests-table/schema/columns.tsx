"use client";

import { Group, Stack, Text } from "@mantine/core";
import type { ClientJoinRequestItem } from "../types";
import { ActionsRender } from "./columns-rendering/actions-render";
import { DateRender } from "./columns-rendering/date-render";
import { StatusBadge } from "./columns-rendering/status-badge";
import type { DataTableColumn } from "./types";
import { dataTableSurface } from "@/components/table";

type TFunction = (key: string) => string;

const getColumns = (t: TFunction): DataTableColumn<ClientJoinRequestItem>[] => [
  {
    accessor: "managerName",
    title: t("colManager"),
    width: "18%",
    render: (row) => (
      <Stack gap={0} className={dataTableSurface.textCell}>
        <Text size="sm" fw={500} lh={1.3} style={{ textAlign: "start" }}>
          {row.managerName}
        </Text>
        <Text size="xs" c="dimmed" lh={1.3} style={{ textAlign: "start" }}>
          {row.email}
        </Text>
      </Stack>
    ),
  },
  {
    accessor: "labName",
    title: t("colLab"),
    width: "14%",
    render: (row) => (
      <Text size="sm" className={dataTableSurface.textCell}>
        {row.labName}
      </Text>
    ),
  },
  {
    accessor: "mobileNumber",
    title: t("colContact"),
    width: "12%",
    render: (row) => (
      <Text size="sm" className={dataTableSurface.textCell} dir="ltr" style={{ textAlign: "end" }}>
        {row.mobileNumber}
      </Text>
    ),
  },
  {
    accessor: "address",
    title: t("colAddress"),
    width: "18%",
    render: (row) => (
      <Text size="sm" className={dataTableSurface.textCell} lineClamp={2}>
        {row.address}
      </Text>
    ),
  },
  {
    accessor: "status",
    title: t("colStatus"),
    width: "10%",
    render: (row) => <StatusBadge value={row.status} />,
  },
  {
    accessor: "createdAt",
    title: t("colCreated"),
    width: "14%",
    render: (row) => <DateRender value={row.createdAt} />,
  },
  {
    accessor: "actions",
    title: "",
    width: "8%",
    render: (row) => (
      <Group justify="flex-end">
        <ActionsRender row={row} />
      </Group>
    ),
  },
];

export { getColumns };
