"use client";

import { resolveClinicalPartyKind } from "@/components/modals/test-requests/party-ids";
import { ExternalIdCell } from "@/components/tables/external-patients-table/schema/columns-rendering/external-id-cell";
import { Badge, Box, Code, Text, Tooltip } from "@mantine/core";
import { TestRequestItem } from "../types";
import { ActionsRender } from "./columns-rendering/actions-render";
import { DateRender } from "./columns-rendering/date-render";
import { DataTableColumn } from "./types";

type TFunction = (key: string) => string;

type GetTestRequestsColumnsOptions = {
  roles?: string[] | undefined;
};

const numStyle = { fontVariantNumeric: "tabular-nums" as const };

const MetadataCell = ({ value }: { value: string | null | string }) => {
  const raw = value == null ? "" : String(value);
  const trimmed = raw.trim();
  if (!trimmed || trimmed === "{}") {
    return (
      <Text size="sm" c="dimmed" py={4}>
        —
      </Text>
    );
  }

  return (
    <Tooltip label={trimmed} withArrow position="top" openDelay={300} multiline maw={440}>
      <Box component="span" maw={200} display="inline-block">
        <Code
          fz={11}
          fw={500}
          px={8}
          py={4}
          style={{
            display: "block",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            cursor: "default",
            fontVariantNumeric: "normal",
          }}
        >
          {trimmed}
        </Code>
      </Box>
    </Tooltip>
  );
};

const partyValueLabel = (v: string | number | null | undefined): string => {
  if (v === null || v === undefined) return "";
  const s = String(v).trim();
  return s;
};

function buildPartyColumns(
  t: TFunction,
  kind: ReturnType<typeof resolveClinicalPartyKind>,
): DataTableColumn<TestRequestItem>[] {
  if (kind === "doctor") {
    return [
      {
        accessor: "doctorId",
        title: t("colDoctorId"),
        width: "13%",
        render: (row) => {
          const label = partyValueLabel(row.doctorId);
          return (
            <Text
              size="sm"
              py={4}
              lh={1.45}
              c={label ? undefined : "dimmed"}
              style={numStyle}
            >
              {label || "—"}
            </Text>
          );
        },
      },
    ];
  }

  if (kind === "lab") {
    return [
      {
        accessor: "labClientId",
        title: t("colLabClientId"),
        width: "13%",
        render: (row) => <ExternalIdCell value={row.labClientId ?? undefined} />,
      },
    ];
  }

  if (kind === "patient") {
    return [
      {
        accessor: "directPatientId",
        title: t("colDirectPatientId"),
        width: "13%",
        render: (row) => {
          const label = partyValueLabel(row.directPatientId);
          if (!label) {
            return (
              <Text size="sm" c="dimmed" py={4}>
                —
              </Text>
            );
          }
          const looksUuid =
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
              label,
            );
          if (looksUuid || label.length > 24) {
            return <ExternalIdCell value={label} />;
          }
          return (
            <Text size="sm" py={4} lh={1.45} style={numStyle}>
              {label}
            </Text>
          );
        },
      },
    ];
  }

  return [
    {
      accessor: "doctorId",
      title: t("colDoctorId"),
      width: "7%",
      render: (row) => {
        const label = partyValueLabel(row.doctorId);
        return (
          <Text size="sm" py={4} lh={1.45} c={label ? undefined : "dimmed"} style={numStyle}>
            {label || "—"}
          </Text>
        );
      },
    },
    {
      accessor: "labClientId",
      title: t("colLabClientId"),
      width: "9%",
      render: (row) => <ExternalIdCell value={row.labClientId ?? undefined} />,
    },
    {
      accessor: "directPatientId",
      title: t("colDirectPatientId"),
      width: "8%",
      render: (row) => {
        const label = partyValueLabel(row.directPatientId);
        if (!label) {
          return (
            <Text size="sm" c="dimmed" py={4}>
              —
            </Text>
          );
        }
        const looksUuid =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
            label,
          );
        if (looksUuid || label.length > 24) {
          return <ExternalIdCell value={label} />;
        }
        return (
          <Text size="sm" py={4} lh={1.45} style={numStyle}>
            {label}
          </Text>
        );
      },
    },
  ];
}

const getTestRequestsColumns = (
  t: TFunction,
  options?: GetTestRequestsColumnsOptions,
): DataTableColumn<TestRequestItem>[] => {
  const kind = resolveClinicalPartyKind(options?.roles);
  const partyColumns = buildPartyColumns(t, kind);

  return [
    {
      accessor: "medicalTestNameEn",
      title: t("colMedicalTest"),
      width: "14%",
      render: (row) => (
        <Text size="sm" fw={600} py={4} lh={1.45}>
          {row.medicalTestNameEn || "—"}
        </Text>
      ),
    },
    {
      accessor: "requestDate",
      title: t("colRequestDate"),
      width: "11%",
      render: (row) => <DateRender value={row.requestDate} />,
    },
    ...partyColumns,
    {
      accessor: "totalAmount",
      title: t("colTotalAmount"),
      width: "7%",
      render: (row) => (
        <Text size="sm" py={4} ta="end" style={numStyle}>
          {row.totalAmount}
        </Text>
      ),
    },
    {
      accessor: "status",
      title: t("tableStatus"),
      width: "8%",
      render: (row) => {
        const normalized =
          typeof row.status === "string" ? row.status.toLowerCase() : "";
        return (
          <Box py={4} style={{ display: "flex", justifyContent: "center" }}>
            <Badge
              color={normalized === "pending" ? "orange" : "teal"}
              variant="light"
              radius="sm"
              size="sm"
            >
              {row.status}
            </Badge>
          </Box>
        );
      },
    },
    {
      accessor: "notes",
      title: t("colNotes"),
      width: "13%",
      render: (row) => {
        const text = row.notes == null ? "" : String(row.notes);
        const display = text.trim() || "—";
        const isEmpty = !text.trim();
        return (
          <Tooltip label={text} disabled={isEmpty || text.length < 80} withArrow openDelay={400}>
            <Text size="sm" py={4} lineClamp={2} c={isEmpty ? "dimmed" : undefined} lh={1.45}>
              {display}
            </Text>
          </Tooltip>
        );
      },
    },
    {
      accessor: "metadata",
      title: t("colMetadata"),
      width: "9%",
      render: (row) => <MetadataCell value={row.metadata} />,
    },
    {
      accessor: "createdAt",
      title: t("colCreatedAt"),
      width: "10%",
      render: (row) => <DateRender value={row.createdAt} />,
    },
    {
      accessor: "actions",
      title: "",
      width: "5%",
      render: (row) => <ActionsRender row={row} />,
    },
  ];
};

export { getTestRequestsColumns };
export type { GetTestRequestsColumnsOptions };
