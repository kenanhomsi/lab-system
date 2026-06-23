"use client";

import { Badge, Stack, Text } from "@mantine/core";
import type { AppointmentRow } from "../types";
import type { DataTableColumn } from "./types";
import { ActionsRender } from "./columns-rendering";
import {
  appointmentStatusColor,
  formatAppointmentDateTime,
  formatAppointmentTimeRange,
} from "../utils/format";

type Translate = (key: string, values?: Record<string, string | number>) => string;

const numStyle = { fontVariantNumeric: "tabular-nums" as const };

const IdCell = ({ value }: { value: number | null | undefined }) => {
  if (value === null || value === undefined || Number(value) <= 0) {
    return (
      <Text size="sm" c="dimmed" py={4}>
        —
      </Text>
    );
  }

  return (
    <Text size="sm" fw={600} py={4} style={numStyle}>
      #{value}
    </Text>
  );
};

const statusLabelKey = (status: string): string => {
  const normalized = status.trim().toLowerCase();
  const map: Record<string, string> = {
    scheduled: "statusScheduled",
    confirmed: "statusConfirmed",
    completed: "statusCompleted",
    pending: "statusPending",
    cancelled: "statusCancelled",
    canceled: "statusCancelled",
  };
  return map[normalized] ?? "statusUnknown";
};

const locationLabelKey = (location: string): string => {
  const normalized = location.trim().toLowerCase();
  const map: Record<string, string> = {
    lab: "locationLab",
    home: "locationHome",
    work: "locationWork",
  };
  return map[normalized] ?? "locationUnknown";
};

/**
 * Creates blood draw appointments table column definitions.
 */
const getAppointmentColumns = (t: Translate): DataTableColumn<AppointmentRow>[] => [
  {
    accessor: "id",
    title: t("columnAppointment"),
    width: "8%",
    render: (row) => <IdCell value={row.id} />,
  },
  {
    accessor: "testRequestId",
    title: t("columnTestRequest"),
    width: "10%",
    render: (row) => <IdCell value={row.testRequestId} />,
  },
  {
    accessor: "availabilityId",
    title: t("columnAvailability"),
    width: "10%",
    render: (row) => <IdCell value={row.availabilityId} />,
  },
  {
    accessor: "startTime",
    title: t("columnTime"),
    width: "18%",
    render: (row) => {
      const { dateLabel, timeLabel } = formatAppointmentTimeRange(row.startTime, row.endTime);
      return (
        <Stack gap={2} py={4}>
          <Text size="sm" fw={600} style={numStyle}>
            {dateLabel}
          </Text>
          <Text size="xs" c="dimmed">
            {timeLabel}
          </Text>
          {row.notes ? (
            <Text size="xs" c="dimmed" lineClamp={1}>
              {row.notes}
            </Text>
          ) : null}
        </Stack>
      );
    },
  },
  {
    accessor: "patientLocationType",
    title: t("columnLocation"),
    width: "12%",
    render: (row) => {
      const raw = row.patientLocationType?.trim();
      if (!raw) {
        return (
          <Text size="sm" c="dimmed" py={4}>
            —
          </Text>
        );
      }
      const key = locationLabelKey(raw);
      const label = key === "locationUnknown" ? raw : t(key);
      return (
        <Badge variant="light" color="gray" radius="md">
          {label}
        </Badge>
      );
    },
  },
  {
    accessor: "status",
    title: t("columnStatus"),
    width: "12%",
    render: (row) => {
      const raw = row.status?.trim();
      if (!raw) {
        return (
          <Text size="sm" c="dimmed" py={4}>
            —
          </Text>
        );
      }
      const key = statusLabelKey(raw);
      const label = key === "statusUnknown" ? raw : t(key);
      return (
        <Badge variant="light" color={appointmentStatusColor(raw)} radius="md">
          {label}
        </Badge>
      );
    },
  },
  {
    accessor: "createdAt",
    title: t("columnCreatedAt"),
    width: "14%",
    render: (row) => (
      <Text size="sm" c="dimmed" py={4} style={numStyle}>
        {row.createdAt ? formatAppointmentDateTime(row.createdAt) : "—"}
      </Text>
    ),
  },
  {
    accessor: "actions",
    title: t("columnActions"),
    width: "10%",
    render: (row) => <ActionsRender row={row} />,
  },
];

export { getAppointmentColumns };
