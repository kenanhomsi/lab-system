"use client";

import { ActionIcon, Group, Tooltip } from "@mantine/core";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import type { AvailabilityRow } from "../types";
import { useMirror } from "../store";

type Props = {
  row: AvailabilityRow;
};

/**
 * Renders row-level actions for availability slots.
 */
const ActionsRender = ({ row }: Props) => {
  const t = useTranslations("admin.availabilities");
  const setActiveModal = useMirror("setActiveModal");
  const setSelectedAvailability = useMirror("setSelectedAvailability");

  const openModal = (modal: "edit" | "delete") => {
    setSelectedAvailability(row);
    setActiveModal(modal);
  };

  return (
    <Group gap={6} wrap="nowrap" justify="flex-end">
      <Tooltip label={t("edit")}>
        <ActionIcon variant="subtle" color="blue" onClick={() => openModal("edit")}>
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
