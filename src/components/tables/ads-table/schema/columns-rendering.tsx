"use client";

import { ActionIcon, Group, Tooltip } from "@mantine/core";
import { IconEye, IconPencil, IconTrash } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import type { AdItem } from "../types";
import { useMirror } from "../store";

type Props = {
  row: AdItem;
};

/**
 * Renders row-level actions for ads.
 */
const ActionsRender = ({ row }: Props) => {
  const t = useTranslations("admin.settings.ads");
  const setActiveModal = useMirror("setActiveModal");
  const setSelectedAd = useMirror("setSelectedAd");

  const openModal = (modal: "view" | "edit" | "delete") => {
    setSelectedAd(row);
    setActiveModal(modal);
  };

  return (
    <Group gap={6} wrap="nowrap">
      <Tooltip label={t("view")}>
        <ActionIcon variant="subtle" color="blue" onClick={() => openModal("view")}>
          <IconEye size={16} />
        </ActionIcon>
      </Tooltip>
      <Tooltip label={t("edit")}>
        <ActionIcon variant="subtle" color="gray" onClick={() => openModal("edit")}>
          <IconPencil size={16} />
        </ActionIcon>
      </Tooltip>
      <Tooltip label={t("delete")}>
        <ActionIcon variant="subtle" color="red" onClick={() => openModal("delete")}>
          <IconTrash size={16} />
        </ActionIcon>
      </Tooltip>
    </Group>
  );
};

export { ActionsRender };
