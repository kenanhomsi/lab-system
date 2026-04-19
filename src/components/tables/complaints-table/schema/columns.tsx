"use client";

import { Anchor, Group, Text } from "@mantine/core";
import { IconPaperclip } from "@tabler/icons-react";
import { ComplaintItem } from "../types";
import { ActionsRender } from "./columns-rendering/actions-render";
import { DateRender } from "./columns-rendering/date-render";
import { StatusBadge } from "./columns-rendering/status-badge";
import { DataTableColumn } from "./types";

type TFunction = (key: string) => string;

const getComplaintsColumns = (t: TFunction): DataTableColumn<ComplaintItem>[] => {
  return [
    {
      accessor: "title",
      title: t("colTitle"),
      width: "16%",
      render: (row) => <Text size="sm">{row.title}</Text>,
    },
    {
      accessor: "description",
      title: t("colDescription"),
      width: "24%",
      render: (row) => (
        <Text size="sm" lineClamp={2}>
          {row.description}
        </Text>
      ),
    },
    {
      accessor: "userId",
      title: t("colUser"),
      width: "14%",
      render: (row) => <Text size="sm">{row.userId || "-"}</Text>,
    },
    {
      accessor: "status",
      title: t("colStatus"),
      width: "10%",
      render: (row) => <StatusBadge value={row.status} />,
    },
    {
      accessor: "attachmentUrl",
      title: t("colAttachment"),
      width: "10%",
      render: (row) =>
        row.attachmentUrl ? (
          <Anchor href={row.attachmentUrl} target="_blank" rel="noreferrer">
            <Group gap={4}>
              <IconPaperclip size={14} />
              <Text size="sm">{t("openAttachment")}</Text>
            </Group>
          </Anchor>
        ) : (
          <Text size="sm" c="dimmed">
            -
          </Text>
        ),
    },
    {
      accessor: "createdAt",
      title: t("colCreated"),
      width: "12%",
      render: (row) => <DateRender value={row.createdAt} />,
    },
    {
      accessor: "updatedAt",
      title: t("colUpdated"),
      width: "10%",
      render: (row) => <DateRender value={row.updatedAt} />,
    },
    {
      accessor: "actions",
      title: "",
      width: "4%",
      render: (row) => <ActionsRender row={row} />,
    },
  ];
};

export { getComplaintsColumns };
