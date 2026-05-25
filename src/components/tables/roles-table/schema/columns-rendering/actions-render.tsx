"use client";

import { ActionIcon, Menu } from "@mantine/core";
import { IconDotsVertical, IconEdit, IconTrash } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { RoleTableItem } from "../../types";
import { useMirror } from "../../store";

type Props = {
  row: RoleTableItem;
};

const ActionsRender = ({ row }: Props) => {
  const t = useTranslations("admin.settings.roles");
  const setSelectedRole = useMirror("setSelectedRole");
  const setActiveModal = useMirror("setActiveModal");

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
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
        >
          <IconDotsVertical size={16} />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          leftSection={<IconEdit size={16} />}
          onClick={() => {
            setSelectedRole(row);
            setActiveModal("edit");
          }}
        >
          {t("edit")}
        </Menu.Item>
        <Menu.Item
          color="red"
          leftSection={<IconTrash size={16} />}
          onClick={() => {
            setSelectedRole(row);
            setActiveModal("delete");
          }}
        >
          {t("delete")}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export { ActionsRender };
