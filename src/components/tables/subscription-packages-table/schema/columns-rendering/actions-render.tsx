"use client";

import { ActionIcon, Menu } from "@mantine/core";
import { IconDotsVertical, IconEdit, IconLockOpen, IconLockOff } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useMirror } from "../../store";
import { SubscriptionPackageItem } from "../../types";

type Props = {
  row: SubscriptionPackageItem;
};

const ActionsRender = ({ row }: Props) => {
  const t = useTranslations("admin.common");
  const setSelectedPackage = useMirror("setSelectedPackage");
  const setActiveModal = useMirror("setActiveModal");
  const activatePackage = useMirror("activatePackage");
  const deactivatePackage = useMirror("deactivatePackage");

  const openEdit = () => {
    setSelectedPackage(row);
    setActiveModal("edit");
  };

  const toggleActivation = () => {
    if (row.isActive) {
      void deactivatePackage(row.id);
      return;
    }
    void activatePackage(row.id);
  };

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
        <Menu.Item leftSection={<IconEdit size={16} />} onClick={openEdit}>
          {t("edit")}
        </Menu.Item>
        <Menu.Item
          leftSection={row.isActive ? <IconLockOff size={16} /> : <IconLockOpen size={16} />}
          onClick={toggleActivation}
        >
          {row.isActive ? t("deactivate") : t("activate")}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export { ActionsRender };
