"use client";

import { Badge, Text } from "@mantine/core";
import type { DataTableColumn } from "@/components/table/store/init";
import type { StoreCoupon } from "@/modules/store";
import { ActionsRender } from "./columns-rendering/actions-render";

type TFunction = (key: string) => string;

const getStoreCouponsColumns = (t: TFunction): DataTableColumn<StoreCoupon>[] => [
  {
    accessor: "id",
    title: t("colId"),
    width: "6%",
    render: (row) => (
      <Text size="sm" c="dimmed" fw={600}>
        {row.id}
      </Text>
    ),
  },
  {
    accessor: "code",
    title: t("colCode"),
    width: "16%",
    render: (row) => (
      <Text size="sm" fw={600} ff="monospace">
        {row.code}
      </Text>
    ),
  },
  {
    accessor: "discountType",
    title: t("colDiscountType"),
    width: "14%",
    render: (row) => <Text size="sm">{row.discountType}</Text>,
  },
  {
    accessor: "amount",
    title: t("colAmount"),
    width: "10%",
    render: (row) => <Text size="sm">{row.amount}</Text>,
  },
  {
    accessor: "minimumSubtotal",
    title: t("colMinimumSubtotal"),
    width: "14%",
    render: (row) => <Text size="sm">{row.minimumSubtotal.toLocaleString()}</Text>,
  },
  {
    accessor: "isActive",
    title: t("colActive"),
    width: "10%",
    render: (row) => (
      <Badge color={row.isActive ? "teal" : "gray"} variant="light" radius="sm" size="sm">
        {row.isActive ? t("yes") : t("no")}
      </Badge>
    ),
  },
  {
    accessor: "actions",
    title: "",
    width: "8%",
    render: (row) => <ActionsRender row={row} />,
  },
];

export { getStoreCouponsColumns };
