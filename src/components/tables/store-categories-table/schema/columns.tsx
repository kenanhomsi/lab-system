"use client";

import { Avatar, Badge, Group, Text } from "@mantine/core";
import type { DataTableColumn } from "@/components/table/store/init";
import type { StoreCategory } from "@/modules/store";
import { ActionsRender } from "./columns-rendering/actions-render";

type TFunction = (key: string) => string;

const getStoreCategoriesColumns = (t: TFunction): DataTableColumn<StoreCategory>[] => [
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
    accessor: "nameAr",
    title: t("colNameAr"),
    width: "18%",
    render: (row) => (
      <Group gap="sm" wrap="nowrap">
        {row.imageUrl ? (
          <Avatar src={row.imageUrl} size={32} radius="md" />
        ) : (
          <Avatar size={32} radius="md" color="teal">
            {row.nameAr.charAt(0) || "?"}
          </Avatar>
        )}
        <Text size="sm" fw={500} lineClamp={1}>
          {row.nameAr}
        </Text>
      </Group>
    ),
  },
  {
    accessor: "nameEn",
    title: t("colNameEn"),
    width: "16%",
    render: (row) => (
      <Text size="sm" c="dimmed" lineClamp={1}>
        {row.nameEn}
      </Text>
    ),
  },
  {
    accessor: "displayOrder",
    title: t("colDisplayOrder"),
    width: "8%",
    render: (row) => <Text size="sm">{row.displayOrder}</Text>,
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

export { getStoreCategoriesColumns };
