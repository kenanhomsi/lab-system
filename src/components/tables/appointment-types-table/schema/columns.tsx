"use client";

import { Text } from "@mantine/core";
import { DateRender } from "@/components/tables/users-table/schema/columns-rendering/date-render";
import { StatusBadge } from "@/components/tables/users-table/schema/columns-rendering/status-badge";
import { DataTableColumn } from "./types";
import { AppointmentTypeItem } from "../types";
import { ActionsRender } from "./columns-rendering/actions-render";

type Translate = (key: string) => string;

const getAppointmentTypeColumns = (
  t: Translate,
): DataTableColumn<AppointmentTypeItem>[] => {
  return [
    {
      accessor: "name",
      title: t("columnName"),
      width: "36%",
      render: (row) => <Text size="sm">{row.name}</Text>,
    },
    {
      accessor: "isActive",
      title: t("columnStatus"),
      width: "20%",
      render: (row) => (
        <StatusBadge
          value={row.isActive}
          trueLabel={t("active")}
          falseLabel={t("inactive")}
        />
      ),
    },
    {
      accessor: "createdAt",
      title: t("columnCreatedAt"),
      width: "36%",
      render: (row) => <DateRender value={row.createdAt} />,
    },
    {
      accessor: "actions",
      title: t("columnActions"),
      width: "8%",
      render: (row) => <ActionsRender row={row} />,
    },
  ];
};

export { getAppointmentTypeColumns };
