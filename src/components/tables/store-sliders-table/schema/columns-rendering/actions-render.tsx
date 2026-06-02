"use client";

import { ActionIcon, Group, Tooltip } from "@mantine/core";
import { IconEdit } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import type { StoreSlider } from "@/modules/store";
import { useMirror } from "../../store";

type Props = {
  row: StoreSlider;
};

const ActionsRender = ({ row }: Props) => {
  const t = useTranslations("admin.common");
  const setSelectedSlider = useMirror("setSelectedSlider");
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
            setSelectedSlider(row);
            setActiveModal("edit");
          }}
        >
          <IconEdit size={15} />
        </ActionIcon>
      </Tooltip>
    </Group>
  );
};

export { ActionsRender };
