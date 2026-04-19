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
import { useMirror } from "../../store";
import { UserItem, UserModalType } from "../../types";

type Props = {
  row: UserItem;
};

const ActionsRender = ({ row }: Props) => {
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
    <Group gap={4} wrap="nowrap" justify="flex-end">
      <Tooltip label="Edit" withArrow position="top">
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

      <Tooltip label={row.isActive ? "Deactivate" : "Activate"} withArrow position="top">
        <ActionIcon
          variant="subtle"
          color={row.isActive ? "orange" : "teal"}
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
          <Tooltip label="More actions" withArrow position="top">
            <ActionIcon
              variant="subtle"
              color="gray"
              radius="md"
              size="md"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <IconDotsVertical size={15} />
            </ActionIcon>
          </Tooltip>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item leftSection={<IconTrash size={15} />} color="red" onClick={() => openModal("delete")}>
            Delete
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item leftSection={<IconShieldCheck size={15} />} onClick={() => openModal("roles")}>
            Manage Roles
          </Menu.Item>
          <Menu.Item leftSection={<IconSettings size={15} />} onClick={() => openModal("permissions")}>
            Manage Permissions
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
};

export { ActionsRender };
