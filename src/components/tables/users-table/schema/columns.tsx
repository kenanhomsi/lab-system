"use client";

import { Avatar, Group, Stack, Text } from "@mantine/core";
import { DataTableColumn } from "./types";
import { UserItem } from "../types";
import { ActionsRender } from "./columns-rendering/actions-render";
import { DateRender } from "./columns-rendering/date-render";
import { StatusBadge } from "./columns-rendering/status-badge";

const AVATAR_COLORS = [
  "red",
  "pink",
  "grape",
  "violet",
  "indigo",
  "blue",
  "cyan",
  "teal",
  "green",
  "lime",
  "yellow",
  "orange",
];

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

type TFunction = (key: string) => string;

const getUsersColumns = (t: TFunction, tc: TFunction): DataTableColumn<UserItem>[] => {
  return [
    {
      accessor: "fullName",
      title: t("colFullName"),
      width: "22%",
      render: (row) => (
        <Group gap="sm" wrap="nowrap">
          <Avatar
            size={36}
            radius="xl"
            color={getAvatarColor(row.fullName || "U")}
            variant="filled"
          >
            {getInitials(row.fullName || "U")}
          </Avatar>
          <Stack gap={0}>
            <Text size="sm" fw={500} lh={1.3}>
              {row.fullName}
            </Text>
            <Text size="xs" c="dimmed" lh={1.3}>
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
        <Text size="sm" c={row.city ? undefined : "dimmed"}>
          {row.city || "—"}
        </Text>
      ),
    },
    {
      accessor: "phoneNumber",
      title: t("colPhone"),
      width: "14%",
      render: (row) => (
        <Text size="sm" c={row.phoneNumber ? undefined : "dimmed"}>
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
