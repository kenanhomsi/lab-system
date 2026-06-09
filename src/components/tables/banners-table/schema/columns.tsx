"use client";

import { Badge, Text } from "@mantine/core";
import { DataTableColumn } from "./types";
import { BannerItem } from "../types";
import { ActionsRender } from "./columns-rendering";
import { getBannerSlots } from "@/lib/banners/slots";

type Translate = (key: string) => string;

const formatDateCell = (value: string) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleDateString();
};

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
            render: (row) => {
                const slot = getBannerSlots(row.location).find(
                    (item) => item.order === row.displayOrder,
                );
                return (
                    <Text size="sm">
                        {t(`locationOptions.${row.location}`)}
                        {slot ? ` · ${row.displayOrder} - ${t(`slotLabels.${slot.labelKey}`)}` : ""}
                    </Text>
                );
            },
        },
        {
            accessor: "isActive",
            title: t("columnStatus"),
            width: "12%",
            render: (row) => (
                <Badge variant="light" color={row.isActive ? "green" : "gray"}>
                    {row.isActive ? t("active") : t("inactive")}
                </Badge>
            ),
        },
        {
            accessor: "startDate",
            title: t("columnStartDate"),
            width: "12%",
            render: (row) => <Text size="sm">{formatDateCell(row.startDate)}</Text>,
        },
        {
            accessor: "endDate",
            title: t("columnEndDate"),
            width: "12%",
            render: (row) => <Text size="sm">{formatDateCell(row.endDate)}</Text>,
        },
        {
            accessor: "displayOrder",
            title: t("columnOrder"),
            width: "8%",
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
