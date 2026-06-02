"use client";

import { ActionIcon, Menu } from "@mantine/core";
import { IconDotsVertical } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useMirror } from "../../store";
import type { ContractServiceRequestItem } from "../../types";

type Props = {
  row: ContractServiceRequestItem;
};

const ActionsRender = ({ row }: Props) => {
  const t = useTranslations("admin.contractServiceRequests");
  const setStatusUpdateTargetId = useMirror("setStatusUpdateTargetId");
  const setDeleteTargetId = useMirror("setDeleteTargetId");

  return (
    <Menu
      shadow="lg"
      width={220}
      radius="md"
      position="bottom-end"
      offset={8}
      withArrow
      trigger="click"
    >
      <Menu.Target>
        <ActionIcon
          variant="subtle"
          color="gray"
          radius="md"
          size="lg"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <IconDotsVertical size={16} />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item onClick={() => setStatusUpdateTargetId(row.id)}>
          {t("updateStatus")}
        </Menu.Item>
        <Menu.Item color="red" onClick={() => setDeleteTargetId(row.id)}>
          {t("delete")}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export { ActionsRender };
