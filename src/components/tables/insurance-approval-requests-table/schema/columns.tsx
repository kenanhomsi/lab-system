"use client";

import { Anchor, Group, Text } from "@mantine/core";
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
    width: "10%",
    render: (row) => <StatusBadge value={row.status} />,
  },
  {
    accessor: "images",
    title: t("colImages"),
    width: "14%",
    render: (row) => (
      <Group gap="xs" wrap="nowrap">
        {row.insuranceCardImageUrl ? (
          <Anchor href={row.insuranceCardImageUrl} target="_blank" rel="noreferrer" size="sm">
            {t("cardImageShort")}
          </Anchor>
        ) : null}
        {row.prescriptionImageUrl ? (
          <Anchor href={row.prescriptionImageUrl} target="_blank" rel="noreferrer" size="sm">
            {t("prescriptionImageShort")}
          </Anchor>
        ) : null}
        {!row.insuranceCardImageUrl && !row.prescriptionImageUrl ? (
          <Text size="sm" c="dimmed">
            -
          </Text>
        ) : null}
      </Group>
    ),
  },
  {
    accessor: "createdAt",
    title: t("colCreated"),
    width: "10%",
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
