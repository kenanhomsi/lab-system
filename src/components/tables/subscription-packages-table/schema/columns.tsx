"use client";

import { Text } from "@mantine/core";
import { DateRender } from "@/components/tables/users-table/schema/columns-rendering/date-render";
import { StatusBadge } from "@/components/tables/users-table/schema/columns-rendering/status-badge";
import { DataTableColumn } from "./types";
import { SubscriptionPackageItem } from "../types";
import { ActionsRender } from "./columns-rendering/actions-render";

type TFunction = (key: string) => string;

const getSubscriptionPackageColumns = (t: TFunction, tc: TFunction): DataTableColumn<SubscriptionPackageItem>[] => {
  return [
    {
      accessor: "name",
      title: t("colName"),
      width: "16%",
      render: (row) => <Text size="sm">{row.name}</Text>,
    },
    {
      accessor: "price",
      title: t("colPrice"),
      width: "10%",
      render: (row) => <Text size="sm">{row.price}</Text>,
    },
    {
      accessor: "validityDays",
      title: t("colValidityDays"),
      width: "12%",
      render: (row) => <Text size="sm">{row.validityDays}</Text>,
    },
    {
      accessor: "targetAudience",
      title: t("colAudience"),
      width: "12%",
      render: (row) => <Text size="sm">{row.targetAudience}</Text>,
    },
    {
      accessor: "includedTests",
      title: t("colIncludedTests"),
      width: "24%",
      render: (row) => <Text size="sm">{row.includedTests || "-"}</Text>,
    },
    {
      accessor: "isActive",
      title: t("colStatus"),
      width: "10%",
      render: (row) => (
        <StatusBadge value={row.isActive} trueLabel={tc("active")} falseLabel={tc("inactive")} />
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
      width: "4%",
      render: (row) => <ActionsRender row={row} />,
    },
  ];
};

export { getSubscriptionPackageColumns };
