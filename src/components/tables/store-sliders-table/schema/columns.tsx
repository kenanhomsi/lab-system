"use client";

import { Badge, Text } from "@mantine/core";
import type { DataTableColumn } from "@/components/table/store/init";
import type { StoreSlider } from "@/modules/store";
import { ActionsRender } from "./columns-rendering/actions-render";

type SliderRow = StoreSlider & { isActive?: boolean };

type TFunction = (key: string) => string;

const getStoreSlidersColumns = (t: TFunction): DataTableColumn<SliderRow>[] => [
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
    accessor: "title",
    title: t("colTitle"),
    width: "22%",
    render: (row) => (
      <Text size="sm" fw={500} lineClamp={1}>
        {row.title}
      </Text>
    ),
  },
  {
    accessor: "type",
    title: t("colType"),
    width: "14%",
    render: (row) => <Text size="sm">{row.type}</Text>,
  },
  {
    accessor: "displayOrder",
    title: t("colDisplayOrder"),
    width: "10%",
    render: (row) => <Text size="sm">{row.displayOrder}</Text>,
  },
  {
    accessor: "products",
    title: t("colProductCount"),
    width: "12%",
    render: (row) => <Text size="sm">{row.products.length}</Text>,
  },
  {
    accessor: "isActive",
    title: t("colActive"),
    width: "10%",
    render: (row) => {
      const active = row.isActive ?? true;
      return (
        <Badge color={active ? "teal" : "gray"} variant="light" radius="sm" size="sm">
          {active ? t("yes") : t("no")}
        </Badge>
      );
    },
  },
  {
    accessor: "actions",
    title: "",
    width: "8%",
    render: (row) => <ActionsRender row={row} />,
  },
];

export { getStoreSlidersColumns };
