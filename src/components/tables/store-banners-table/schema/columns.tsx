"use client";

import { Avatar, Badge, Group, Text } from "@mantine/core";
import type { DataTableColumn } from "@/components/table/store/init";
import type { StoreBanner } from "@/modules/store";
import { ActionsRender } from "./columns-rendering/actions-render";

type TFunction = (key: string) => string;

const getStoreBannersColumns = (t: TFunction): DataTableColumn<StoreBanner>[] => [
  {
    accessor: "id",
    title: t("colId"),
    width: "6%",
    render: (row) => (
      <Text size="sm" c="dimmed" fw={600}>
        {row.id}
      </Text>
    ),
  },
  {
    accessor: "title",
    title: t("colTitle"),
    width: "22%",
    render: (row) => (
      <Group gap="sm" wrap="nowrap">
        {row.imageUrl ? (
          <Avatar src={row.imageUrl} size={40} radius="md" />
        ) : (
          <Avatar size={40} radius="md" color="teal">
            {row.title.charAt(0) || "?"}
          </Avatar>
        )}
        <Text size="sm" fw={500} lineClamp={1}>
          {row.title}
        </Text>
      </Group>
    ),
  },
  {
    accessor: "location",
    title: t("colLocation"),
    width: "14%",
    render: (row) => (
      <Text size="sm" c="dimmed" lineClamp={1}>
        {row.location}
      </Text>
    ),
  },
  {
    accessor: "displayOrder",
    title: t("colDisplayOrder"),
    width: "10%",
    render: (row) => <Text size="sm">{row.displayOrder}</Text>,
  },
  {
    accessor: "isActive",
    title: t("colActive"),
    width: "10%",
    render: (row) => (
      <Badge color={row.isActive ? "teal" : "gray"} variant="light" radius="sm" size="sm">
        {row.isActive ? t("yes") : t("no")}
      </Badge>
    ),
  },
  {
    accessor: "actions",
    title: "",
    width: "6%",
    render: (row) => <ActionsRender row={row} />,
  },
];

export { getStoreBannersColumns };
