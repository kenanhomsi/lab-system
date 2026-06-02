"use client";

import { ActionIcon, Group, Tooltip } from "@mantine/core";
import { IconEdit } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import type { StoreCoupon } from "@/modules/store";
import { useMirror } from "../../store";

type Props = {
  row: StoreCoupon;
};

const ActionsRender = ({ row }: Props) => {
  const t = useTranslations("admin.common");
  const setSelectedCoupon = useMirror("setSelectedCoupon");
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
            setSelectedCoupon(row);
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
