"use client";

import { ActionIcon, Group, Tooltip } from "@mantine/core";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useMirror } from "../../store";
import { MedicalTestItem } from "../../types";

type Props = {
  row: MedicalTestItem;
};

const ActionsRender = ({ row }: Props) => {
  const t = useTranslations("admin.common");
  const setSelectedMedicalTest = useMirror("setSelectedMedicalTest");
  const setActiveModal = useMirror("setActiveModal");

  const openModal = (modal: "edit" | "delete") => {
    setSelectedMedicalTest(row);
    setActiveModal(modal);
  };

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
            openModal("edit");
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
            openModal("delete");
          }}
        >
          <IconTrash size={15} />
        </ActionIcon>
      </Tooltip>
    </Group>
  );
};

export { ActionsRender };
