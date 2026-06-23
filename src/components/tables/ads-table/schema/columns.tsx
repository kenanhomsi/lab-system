"use client";

import { Badge, Box, Text } from "@mantine/core";
import type { AdItem } from "../types";
import type { DataTableColumn } from "./types";
import { ActionsRender } from "./columns-rendering";

type Translate = (key: string) => string;

const formatDateCell = (value: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString();
};

/**
 * Creates ads table column definitions.
 */
const getAdColumns = (t: Translate): DataTableColumn<AdItem>[] => [
  {
    accessor: "name",
    title: t("columnName"),
    width: "18%",
    render: (row) => <Text size="sm">{row.name}</Text>,
  },
  {
    accessor: "description",
    title: t("columnDescription"),
    width: "26%",
    render: (row) => (
      <Text size="sm" lineClamp={2}>
        {row.description}
      </Text>
    ),
  },
  {
    accessor: "mediaType",
    title: t("columnMediaType"),
    width: "12%",
    render: (row) => (
      <Badge variant="light" color={row.mediaType === "Image" ? "blue" : "violet"}>
        {t(`mediaTypeOptions.${row.mediaType}`)}
      </Badge>
    ),
  },
  {
    accessor: "mediaUrl",
    title: t("columnPreview"),
    width: "14%",
    render: (row) => (
      <Box w={86} h={48} style={{ overflow: "hidden", borderRadius: 6 }}>
        {row.mediaType === "Video" ? (
          <video
            src={row.mediaUrl}
            muted
            playsInline
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={row.mediaUrl}
            alt={row.name}
            loading="lazy"
            decoding="async"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        )}
      </Box>
    ),
  },
  {
    accessor: "createdAt",
    title: t("columnCreatedAt"),
    width: "12%",
    render: (row) => <Text size="sm">{formatDateCell(row.createdAt)}</Text>,
  },
  {
    accessor: "updatedAt",
    title: t("columnUpdatedAt"),
    width: "12%",
    render: (row) => <Text size="sm">{formatDateCell(row.updatedAt)}</Text>,
  },
  {
    accessor: "actions",
    title: t("columnActions"),
    width: "14%",
    render: (row) => <ActionsRender row={row} />,
  },
];

export { getAdColumns };
