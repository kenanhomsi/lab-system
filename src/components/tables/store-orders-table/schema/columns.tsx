"use client";

import { StoreOrderStatusBadge } from "@/components/features/store/ui";
import type { DataTableColumn } from "@/components/table/store/init";
import type { StoreOrder } from "@/modules/store";
import { Text } from "@mantine/core";
import { ActionsRender } from "./columns-rendering/actions-render";

type TFunction = (key: string) => string;

const getStoreOrdersColumns = (t: TFunction): DataTableColumn<StoreOrder>[] => [
  {
    accessor: "orderNumber",
    title: t("colOrderNumber"),
    width: "18%",
    render: (row) => (
      <Text size="sm" fw={600}>
        {row.orderNumber}
      </Text>
    ),
  },
  {
    accessor: "status",
    title: t("colStatus"),
    width: "14%",
    render: (row) => <StoreOrderStatusBadge status={row.status} />,
  },
  {
    accessor: "total",
    title: t("colTotal"),
    width: "12%",
    render: (row) => <Text size="sm">{row.total.toLocaleString()}</Text>,
  },
  {
    accessor: "orderedAt",
    title: t("colOrderedAt"),
    width: "18%",
    render: (row) => (
      <Text size="sm" c="dimmed">
        {new Date(row.orderedAt).toLocaleString()}
      </Text>
    ),
  },
  {
    accessor: "actions",
    title: t("action"),
    width: "22%",
    render: (row) => <ActionsRender row={row} />,
  },
];

export { getStoreOrdersColumns };
