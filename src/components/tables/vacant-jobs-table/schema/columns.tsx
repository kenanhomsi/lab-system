"use client";

import { Badge, Text } from "@mantine/core";
import { DataTableColumn } from "./types";
import { VacantJobItem } from "../types";
import { ActionsRender } from "./columns-rendering/actions-render";
import { DateRender } from "./columns-rendering/date-render";

type TFunction = (key: string) => string;

const getVacantJobsColumns = (t: TFunction): DataTableColumn<VacantJobItem>[] => {
  return [
    {
      accessor: "sortOrder",
      title: t("colSortOrder"),
      width: "8%",
      render: (row) => <Text size="sm">{row.sortOrder}</Text>,
    },
    {
      accessor: "titleAr",
      title: t("colTitleAr"),
      width: "18%",
      render: (row) => <Text size="sm">{row.titleAr}</Text>,
    },
    {
      accessor: "titleEn",
      title: t("colTitleEn"),
      width: "18%",
      render: (row) => <Text size="sm">{row.titleEn}</Text>,
    },
    {
      accessor: "isActive",
      title: t("colIsActive"),
      width: "10%",
      render: (row) => (
        <Badge color={row.isActive ? "teal" : "gray"} variant="light" radius="sm" size="sm">
          {row.isActive ? t("statusActive") : t("statusInactive")}
        </Badge>
      ),
    },
    {
      accessor: "updatedAt",
      title: t("colUpdatedAt"),
      width: "14%",
      render: (row) => <DateRender value={row.updatedAt} />,
    },
    {
      accessor: "actions",
      title: "",
      width: "6%",
      render: (row) => <ActionsRender row={row} />,
    },
  ];
};

export { getVacantJobsColumns };
