"use client";

import { Badge, Text } from "@mantine/core";
import { DataTableColumn } from "./types";
import { BannerItem } from "../types";
import { ActionsRender } from "./columns-rendering";

type Translate = (key: string) => string;

const getBannerColumns = (t: Translate): DataTableColumn<BannerItem>[] => {
    return [
        {
            accessor: "title",
            title: t("columnTitle"),
            width: "25%",
            render: (row) => <Text size="sm">{row.title}</Text>,
        },
        {
            accessor: "type",
            title: t("columnType"),
            width: "15%",
            render: (row) => <Text size="sm">{row.type}</Text>,
        },
        {
            accessor: "location",
            title: t("columnLocation"),
            width: "15%",
            render: (row) => <Text size="sm">{row.location}</Text>,
        },
        {
            accessor: "isActive",
            title: t("columnStatus"),
            width: "15%",
            render: (row) => (
                <Badge variant="light" color={row.isActive ? "green" : "gray"}>
                    {row.isActive ? t("active") : t("inactive")}
                </Badge>
            ),
        },
        {
            accessor: "displayOrder",
            title: t("columnOrder"),
            width: "10%",
            render: (row) => <Text size="sm">{row.displayOrder}</Text>,
        },
        {
            accessor: "actions",
            title: t("columnActions"),
            width: "20%",
            render: (row) => <ActionsRender row={row} />,
        },
    ];
};

export { getBannerColumns };
