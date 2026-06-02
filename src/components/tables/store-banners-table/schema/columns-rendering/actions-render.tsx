"use client";

import { ActionIcon, Group, Tooltip } from "@mantine/core";
import { IconEdit } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import type { StoreBanner } from "@/modules/store";
import { useMirror } from "../../store";

type Props = {
  row: StoreBanner;
};

const ActionsRender = ({ row }: Props) => {
  const t = useTranslations("admin.common");
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
    </Group>
  );
};

export { ActionsRender };
