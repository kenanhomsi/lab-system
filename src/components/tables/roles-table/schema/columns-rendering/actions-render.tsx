"use client";

import { ActionIcon, Menu } from "@mantine/core";
import { IconDotsVertical, IconEdit, IconTrash } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useMirror } from "../../store";
import { RoleItem } from "../../types";

type Props = {
  row: RoleItem;
};

const ActionsRender = ({ row }: Props) => {
  const t = useTranslations("admin.settings.roles");
  const setSelectedRole = useMirror("setSelectedRole");
  const setActiveModal = useMirror("setActiveModal");

  return (
    <Menu
      shadow="lg"
      width={200}
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
