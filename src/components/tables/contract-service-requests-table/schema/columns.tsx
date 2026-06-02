"use client";

import { Group, Stack, Text } from "@mantine/core";
import type { ContractServiceRequestItem } from "../types";
import { ActionsRender } from "./columns-rendering/actions-render";
import { DateRender } from "./columns-rendering/date-render";
import { StatusBadge } from "./columns-rendering/status-badge";
import type { DataTableColumn } from "./types";
import { dataTableSurface } from "@/components/table";

type TFunction = (key: string) => string;

function contractTypeLabel(t: TFunction, value: string): string {
  if (value === "Individual") return t("contractTypeIndividual");
  if (value === "Organization") return t("contractTypeOrganization");
  return value;
}

function durationLabel(t: TFunction, value: string): string {
  if (value === "ThreeMonths") return t("durationThreeMonths");
  if (value === "SixMonths") return t("durationSixMonths");
  if (value === "OneYear") return t("durationOneYear");
  return value;
}

const getColumns = (t: TFunction): DataTableColumn<ContractServiceRequestItem>[] => [
  {
    accessor: "responsibleName",
    title: t("colResponsible"),
    width: "16%",
    render: (row) => (
      <Stack gap={0} className={dataTableSurface.textCell}>
        <Text size="sm" fw={500} lh={1.3} style={{ textAlign: "start" }}>
          {row.responsibleName}
        </Text>
        <Text size="xs" c="dimmed" lh={1.3} style={{ textAlign: "start" }}>
          {row.email}
        </Text>
      </Stack>
    ),
  },
  {
    accessor: "organizationName",
    title: t("colOrganization"),
    width: "14%",
    render: (row) => (
      <Text size="sm" className={dataTableSurface.textCell}>
        {row.organizationName}
      </Text>
    ),
  },
  {
    accessor: "contractType",
    title: t("colContractType"),
    width: "10%",
    render: (row) => (
      <Text size="sm" className={dataTableSurface.textCell}>
        {contractTypeLabel(t, row.contractType)}
      </Text>
    ),
  },
  {
    accessor: "contractDuration",
    title: t("colDuration"),
    width: "10%",
    render: (row) => (
      <Text size="sm" className={dataTableSurface.textCell}>
        {durationLabel(t, row.contractDuration)}
      </Text>
    ),
  },
  {
    accessor: "expectedSubscribersCount",
    title: t("colSubscribers"),
    width: "8%",
    render: (row) => (
      <Text size="sm" className={dataTableSurface.textCell}>
        {row.expectedSubscribersCount}
      </Text>
    ),
  },
  {
    accessor: "contactNumber",
    title: t("colContact"),
    width: "12%",
    render: (row) => (
      <Text size="sm" className={dataTableSurface.textCell} dir="ltr" style={{ textAlign: "end" }}>
        {row.contactNumber}
      </Text>
    ),
  },
  {
    accessor: "status",
    title: t("colStatus"),
    width: "10%",
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
    title: "",
    width: "8%",
    render: (row) => (
      <Group justify="flex-end">
        <ActionsRender row={row} />
      </Group>
    ),
  },
];

export { getColumns };
