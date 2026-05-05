"use client";

import { Badge, Box, Text } from "@mantine/core";
import { DateRender } from "@/components/tables/test-requests-table/schema/columns-rendering/date-render";
import type { ExternalPatientRow } from "../types";
import { ActionsRender } from "./columns-rendering/actions-render";
import { ExternalIdCell } from "./columns-rendering/external-id-cell";
import type { DataTableColumn } from "../store/schema";

const numStyle = { fontVariantNumeric: "tabular-nums" as const };

const getExternalPatientsColumns = (
  t: (key: string) => string,
): DataTableColumn<ExternalPatientRow>[] => {
  return [
    {
      accessor: "fullName",
      title: t("colFullName"),
      width: "20%",
      render: (row) => (
        <Text size="sm" fw={600} py={4} lh={1.45}>
          {row.fullName || "—"}
        </Text>
      ),
    },
    {
      accessor: "age",
      title: t("colAge"),
      width: "7%",
      render: (row) => (
        <Text size="sm" py={4} ta="center" style={numStyle}>
          {row.age}
        </Text>
      ),
    },
    {
      accessor: "gender",
      title: t("colGender"),
      width: "9%",
      render: (row) => (
        <Text size="sm" py={4} c="dimmed">
          {row.gender || "—"}
        </Text>
      ),
    },
    {
      accessor: "phoneNumber",
      title: t("colPhone"),
      width: "14%",
      render: (row) => (
        <Text
          size="sm"
          py={4}
          ta="end"
          style={numStyle}
          dir="ltr"
        >
          {row.phoneNumber || "—"}
        </Text>
      ),
    },
    {
      accessor: "externalId",
      title: t("colExternalId"),
      width: "12%",
      render: (row) => <ExternalIdCell value={row.externalId} />,
    },
    {
      accessor: "linkedDirectPatientId",
      title: t("colLinkedDirectPatientId"),
      width: "12%",
      render: (row) =>
        row.linkedDirectPatientId ? (
          <Badge
            variant="light"
            color="teal"
            size="sm"
            radius="md"
            style={{ maxWidth: "10rem" }}
            title={row.linkedDirectPatientId}
          >
            <Text size="xs" truncate component="span" inherit>
              {row.linkedDirectPatientId}
            </Text>
          </Badge>
        ) : (
          <Text size="sm" c="dimmed" py={4}>
            —
          </Text>
        ),
    },
    {
      accessor: "createdAt",
      title: t("colCreatedAt"),
      width: "14%",
      render: (row) => (
        <Box py={4} ta="end">
          <DateRender value={row.createdAt} />
        </Box>
      ),
    },
    {
      accessor: "actions",
      title: "",
      width: "8%",
      render: (row) => <ActionsRender row={row} />,
    },
  ];
};

export { getExternalPatientsColumns };
