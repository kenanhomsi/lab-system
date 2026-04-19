"use client";

import { ActionIcon, Menu } from "@mantine/core";
import {
  IconCircleCheck,
  IconDotsVertical,
  IconPlayerPause,
} from "@tabler/icons-react";
import { useMirror } from "../../store";
import { AppointmentItem } from "../../types";

type Props = {
  row: AppointmentItem;
};

const ActionsRender = ({ row }: Props) => {
  const setSelectedAppointment = useMirror("setSelectedAppointment");
  const setActiveModal = useMirror("setActiveModal");

  const openModal = (modal: "confirm" | "cancel") => {
    setSelectedAppointment(row);
    setActiveModal(modal);
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
        <Menu.Item leftSection={<IconCircleCheck size={16} />} onClick={() => openModal("confirm")}>
          Confirm
        </Menu.Item>
        <Menu.Item
          leftSection={<IconPlayerPause size={16} />}
          onClick={() => openModal("cancel")}
          color="red"
        >
          Cancel
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export { ActionsRender };
