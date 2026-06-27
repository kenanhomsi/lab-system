"use client";

import { Badge, Text } from "@mantine/core";
import { DataTableColumn } from "./types";
import { MedicalTestItem } from "../types";
import { ActionsRender } from "./columns-rendering/actions-render";
import { DateRender } from "./columns-rendering/date-render";

type TFunction = (key: string) => string;

const getCategoryLabel = (row: MedicalTestItem, locale: string): string => {
  if (locale === "ar") return row.categoryNameAr || row.categoryNameEn || row.category;
  return row.categoryNameEn || row.categoryNameAr || row.category;
};

const getMedicalTestsColumns = (t: TFunction, locale: string): DataTableColumn<MedicalTestItem>[] => {
  return [
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
      accessor: "category",
      title: t("colCategory"),
      width: "13%",
      render: (row) => {
        const category = getCategoryLabel(row, locale);
        return (
          <Text size="sm" c={category ? undefined : "dimmed"}>
            {category || "-"}
          </Text>
        );
      },
    },
    {
      accessor: "sampleType",
      title: t("colSampleType"),
      width: "13%",
      render: (row) => (
        <Text size="sm" c={row.sampleType ? undefined : "dimmed"}>
          {row.sampleType || "-"}
        </Text>
      ),
    },
    {
      accessor: "price",
      title: t("colPrice"),
      width: "8%",
      render: (row) => <Text size="sm">{row.price}</Text>,
    },
    {
      accessor: "status",
      title: t("tableStatus"),
      width: "10%",
      render: (row) => (
        <Badge
          color={row.status.toLowerCase() === "active" ? "teal" : "gray"}
          variant="light"
          radius="sm"
          size="sm"
        >
          {row.status}
        </Badge>
      ),
    },
    {
      accessor: "createdAt",
      title: t("colCreatedAt"),
      width: "12%",
      render: (row) => <DateRender value={row.createdAt} />,
    },
    {
      accessor: "actions",
      title: "",
      width: "6%",
      render: (row) => <ActionsRender row={row} />,
    },
  ];
};

export { getMedicalTestsColumns };
