"use client";

import { Group, Stack, Text } from "@mantine/core";
import { DataTableColumn } from "./types";
import { UserItem } from "../types";
import { ActionsRender } from "./columns-rendering/actions-render";
import { DateRender } from "./columns-rendering/date-render";
import { StatusBadge } from "./columns-rendering/status-badge";
import { UserAvatar } from "./columns-rendering/user-avatar";
import { dataTableSurface } from "@/components/table";

type TFunction = (key: string) => string;

const getUsersColumns = (t: TFunction, tc: TFunction): DataTableColumn<UserItem>[] => {
  return [
    {
      accessor: "fullName",
      title: t("colFullName"),
      width: "22%",
      render: (row) => (
        <Group gap="sm" wrap="nowrap">
          <UserAvatar fullName={row.fullName} />
          <Stack gap={0} className={dataTableSurface.textCell}>
            <Text size="sm" fw={500} lh={1.3} style={{ textAlign: "start" }}>
              {row.fullName}
            </Text>
            <Text size="xs" c="dimmed" lh={1.3} style={{ textAlign: "start" }}>
              {row.email}
            </Text>
          </Stack>
        </Group>
      ),
    },
    {
      accessor: "city",
      title: t("colCity"),
      width: "10%",
      render: (row) => (
        <Text
          size="sm"
          className={dataTableSurface.textCell}
          c={row.city ? undefined : "dimmed"}
        >
          {row.city || "—"}
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
          className={dataTableSurface.textCell}
          c={row.phoneNumber ? undefined : "dimmed"}
          dir="ltr"
          style={{ textAlign: "end" }}
        >
          {row.phoneNumber || "—"}
        </Text>
      ),
    },
    {
      accessor: "isActive",
      title: t("tableStatus"),
      width: "10%",
      render: (row) => (
        <StatusBadge
          value={row.isActive}
          trueLabel={tc("active")}
          falseLabel={tc("inactive")}
          type="status"
        />
      ),
    },
    {
      accessor: "emailConfirmed",
      title: t("colConfirmed"),
      width: "12%",
      render: (row) => (
        <StatusBadge
          value={row.emailConfirmed}
          trueLabel={tc("confirmed")}
          falseLabel={tc("unconfirmed")}
          type="confirmed"
        />
      ),
    },
    {
      accessor: "createdAt",
      title: t("colCreatedAt"),
      width: "14%",
      render: (row) => <DateRender value={row.createdAt} />,
    },
    {
      accessor: "actions",
      title: "",
      width: "8%",
      render: (row) => <ActionsRender row={row} />,
    },
  ];
};

export { getUsersColumns };
