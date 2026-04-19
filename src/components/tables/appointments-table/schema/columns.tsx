"use client";

import { Text } from "@mantine/core";
import { AppointmentItem } from "../types";
import { ActionsRender } from "./columns-rendering/actions-render";
import { DateRender } from "./columns-rendering/date-render";
import { StatusBadge } from "./columns-rendering/status-badge";
import { DataTableColumn } from "./types";

type TFunction = (key: string) => string;

const getAppointmentsColumns = (t: TFunction): DataTableColumn<AppointmentItem>[] => {
  return [
    {
      accessor: "name",
      title: t("colName"),
      width: "14%",
      render: (row) => <Text size="sm">{row.name}</Text>,
    },
    {
      accessor: "appointmentTypeName",
      title: t("colType"),
      width: "12%",
      render: (row) => <Text size="sm">{row.appointmentTypeName}</Text>,
    },
    {
      accessor: "slot",
      title: t("colSlot"),
      width: "14%",
      render: (row) => <DateRender value={row.slot} />,
    },
    {
      accessor: "status",
      title: t("colStatus"),
      width: "10%",
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      accessor: "locationType",
      title: t("colLocationType"),
      width: "10%",
      render: (row) => <Text size="sm">{row.locationType}</Text>,
    },
    {
      accessor: "patientId",
      title: t("colPatient"),
      width: "10%",
      render: (row) => <Text size="sm">{row.patientId || "-"}</Text>,
    },
    {
      accessor: "doctorId",
      title: t("colDoctor"),
      width: "10%",
      render: (row) => <Text size="sm">{row.doctorId || "-"}</Text>,
    },
    {
      accessor: "address",
      title: t("colAddress"),
      width: "14%",
      render: (row) => <Text size="sm">{row.address || "-"}</Text>,
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

export { getAppointmentsColumns };
