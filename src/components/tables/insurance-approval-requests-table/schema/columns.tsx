"use client";

import { Text } from "@mantine/core";
import type { InsuranceApprovalItem } from "../types";
import { ActionsRender } from "./columns-rendering/actions-render";
import { DateRender } from "./columns-rendering/date-render";
import { StatusBadge } from "./columns-rendering/status-badge";
import type { DataTableColumn } from "./types";

type TFunction = (key: string) => string;

const getColumns = (t: TFunction): DataTableColumn<InsuranceApprovalItem>[] => [
  {
    accessor: "patientName",
    title: t("colPatientName"),
    width: "16%",
    render: (row) => <Text size="sm">{row.patientName}</Text>,
  },
  {
    accessor: "insuredName",
    title: t("colInsuredName"),
    width: "16%",
    render: (row) => <Text size="sm">{row.insuredName}</Text>,
  },
  {
    accessor: "insuranceNumber",
    title: t("colInsuranceNumber"),
    width: "14%",
    render: (row) => <Text size="sm">{row.insuranceNumber}</Text>,
  },
  {
    accessor: "mobileNumber",
    title: t("colMobile"),
    width: "12%",
    render: (row) => <Text size="sm">{row.mobileNumber}</Text>,
  },
  {
    accessor: "status",
    title: t("colStatus"),
    width: "12%",
    render: (row) => <StatusBadge value={row.status} />,
  },
  {
    accessor: "createdAt",
    title: t("colCreated"),
    width: "12%",
    render: (row) => <DateRender value={row.createdAt} />,
  },
  {
    accessor: "actions",
    title: t("colActions"),
    width: "8%",
    render: (row) => <ActionsRender row={row} />,
  },
];

export { getColumns };
