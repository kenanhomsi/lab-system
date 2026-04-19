"use client";

import { Text } from "@mantine/core";
import { DataTableColumn } from "./types";
import { RoleItem } from "../types";
import { ActionsRender } from "./columns-rendering/actions-render";

type Translate = (key: string) => string;

const getRoleColumns = (t: Translate): DataTableColumn<RoleItem>[] => {
  return [
    {
      accessor: "name",
      title: t("columnName"),
      width: "92%",
      render: (row) => <Text size="sm">{row.name}</Text>,
    },
    {
      accessor: "actions",
      title: t("columnActions"),
      width: "8%",
      render: (row) => <ActionsRender row={row} />,
    },
  ];
};

export { getRoleColumns };
