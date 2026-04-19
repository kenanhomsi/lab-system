"use client";

import { ActionIcon, Menu } from "@mantine/core";
import { IconDotsVertical } from "@tabler/icons-react";
import { useMirror } from "../../store";
import { ComplaintItem, ComplaintStatus } from "../../types";

type Props = {
  row: ComplaintItem;
};

const ActionsRender = ({ row }: Props) => {
  const updateComplaintStatus = useMirror("updateComplaintStatus");

  const updateStatus = (status: ComplaintStatus) => {
    void updateComplaintStatus(row.id, status);
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
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <IconDotsVertical size={16} />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item onClick={() => updateStatus("received")}>Mark as Received</Menu.Item>
        <Menu.Item onClick={() => updateStatus("in_progress")}>Mark as In Progress</Menu.Item>
        <Menu.Item onClick={() => updateStatus("resolved")} color="teal">
          Mark as Resolved
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export { ActionsRender };
