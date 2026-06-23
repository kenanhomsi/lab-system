"use client";

import { ActionIcon, Group, Tooltip } from "@mantine/core";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { BannerItem } from "../types";
import { useMirror } from "../store";

type Props = {
    row: BannerItem;
};

const ActionsRender = ({ row }: Props) => {
    const t = useTranslations("admin.settings.banners");
    const setSelectedBanner = useMirror("setSelectedBanner");
    const setActiveModal = useMirror("setActiveModal");

    return (
        <Group gap={4} wrap="nowrap" justify="flex-end">
            <Tooltip label={t("edit")} withArrow position="top">
                <ActionIcon
                    variant="subtle"
                    color="blue"
                    radius="md"
                    size="md"
                    onClick={(e) => {
                        e.stopPropagation();
                        setSelectedBanner(row);
                        setActiveModal("edit");
                    }}
                >
                    <IconEdit size={15} />
                </ActionIcon>
            </Tooltip>
            <Tooltip label={t("delete")} withArrow position="top">
                <ActionIcon
                    variant="subtle"
                    color="red"
                    radius="md"
                    size="md"
                    onClick={(e) => {
                        e.stopPropagation();
                        setSelectedBanner(row);
                        setActiveModal("delete");
                    }}
                >
                    <IconTrash size={15} />
                </ActionIcon>
            </Tooltip>
        </Group>
    );
};

export { ActionsRender };
