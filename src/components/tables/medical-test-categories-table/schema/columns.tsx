"use client";

import { Badge, Text } from "@mantine/core";
import type { DataTableColumn } from "@/components/table/store/init";
import type { MedicalTestCategory } from "@/modules/medical-test-categories";
import { ActionsRender } from "./columns-rendering/actions-render";

type TFunction = (key: string) => string;

const formatDate = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value || "-";
  return date.toLocaleDateString();
};

const getMedicalTestCategoryColumns = (t: TFunction): DataTableColumn<MedicalTestCategory>[] => [
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
    width: "16%",
    render: (row) => <Text size="sm">{row.nameAr}</Text>,
  },
  {
    accessor: "nameEn",
    title: t("colNameEn"),
    width: "16%",
    render: (row) => <Text size="sm">{row.nameEn}</Text>,
  },
  {
    accessor: "description",
    title: t("colDescription"),
    width: "22%",
    render: (row) => (
      <Text size="sm" c={row.description ? undefined : "dimmed"} lineClamp={2}>
        {row.description || "-"}
      </Text>
    ),
  },
  {
    accessor: "displayOrder",
    title: t("colDisplayOrder"),
    width: "9%",
    render: (row) => <Text size="sm">{row.displayOrder}</Text>,
  },
  {
    accessor: "isActive",
    title: t("colActive"),
    width: "9%",
    render: (row) => (
      <Badge color={row.isActive ? "teal" : "gray"} variant="light" radius="sm" size="sm">
        {row.isActive ? t("yes") : t("no")}
      </Badge>
    ),
  },
  {
    accessor: "updatedAt",
    title: t("colUpdatedAt"),
    width: "12%",
    render: (row) => <Text size="sm">{formatDate(row.updatedAt || row.createdAt)}</Text>,
  },
  {
    accessor: "actions",
    title: "",
    width: "8%",
    render: (row) => <ActionsRender row={row} />,
  },
];

export { getMedicalTestCategoryColumns };
