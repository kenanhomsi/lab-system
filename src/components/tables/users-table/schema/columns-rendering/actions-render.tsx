"use client";

import { ActionIcon, Group, Menu, Tooltip } from "@mantine/core";
import {
  IconDotsVertical,
  IconEdit,
  IconLockOpen,
  IconSettings,
  IconShieldCheck,
  IconTrash,
  IconUserCheck,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useMirror } from "../../store";
import { UserItem, UserModalType } from "../../types";
import { dataTableSurface } from "@/components/table";

type Props = {
  row: UserItem;
};

const ActionsRender = ({ row }: Props) => {
  const t = useTranslations("admin.common");
  const setSelectedUser = useMirror("setSelectedUser");
  const setActiveModal = useMirror("setActiveModal");
  const activateUser = useMirror("activateUser");
  const deactivateUser = useMirror("deactivateUser");

  const openModal = (modal: UserModalType) => {
    setSelectedUser(row);
    setActiveModal(modal);
  };

  const toggleActivation = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (row.isActive) {
      void deactivateUser(row.id);
    } else {
      void activateUser(row.id);
    }
  };

  return (
    <div className={dataTableSurface.rowActions}>
      <Group gap={4} wrap="nowrap" justify="end">
        <Tooltip label={t("edit")} withArrow position="top">
          <ActionIcon
            variant="subtle"
            className={dataTableSurface.actionIconPrimary}
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

        <Tooltip
          label={row.isActive ? t("deactivate") : t("activate")}
          withArrow
          position="top"
        >
          <ActionIcon
            variant="subtle"
            className={
              row.isActive
                ? dataTableSurface.actionIconSecondary
                : dataTableSurface.actionIconPrimary
            }
            radius="md"
            size="md"
            onClick={toggleActivation}
          >
            {row.isActive ? <IconLockOpen size={15} /> : <IconUserCheck size={15} />}
          </ActionIcon>
        </Tooltip>

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
            <Tooltip label={t("moreActions")} withArrow position="top">
              <ActionIcon
                variant="subtle"
                className={dataTableSurface.actionIconSecondary}
                radius="md"
                size="md"
              >
                <IconDotsVertical size={15} />
              </ActionIcon>
            </Tooltip>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              leftSection={<IconTrash size={15} />}
              color="red"
              onClick={() => openModal("delete")}
            >
              {t("delete")}
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item
              leftSection={<IconShieldCheck size={15} />}
              onClick={() => openModal("roles")}
            >
              {t("manageRoles")}
            </Menu.Item>
            <Menu.Item
              leftSection={<IconSettings size={15} />}
              onClick={() => openModal("permissions")}
            >
              {t("managePermissions")}
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </div>
  );
};

export { ActionsRender };
