"use client";

import { ActionIcon, Menu } from "@mantine/core";
import { IconCheck, IconDotsVertical, IconTrash, IconX } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useMirror } from "../../store";
import type { EmploymentApplicationItem } from "../../types";

type Props = {
  row: EmploymentApplicationItem;
};

const ActionsRender = ({ row }: Props) => {
  const t = useTranslations("admin.employmentApplications");
  const deleteApplication = useMirror("deleteApplication");
  const setStatusUpdateTargetId = useMirror("setStatusUpdateTargetId");
  const setStatusUpdateIntent = useMirror("setStatusUpdateIntent");

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
        <Menu.Item
          color="green"
          leftSection={<IconCheck size={16} />}
          onClick={() => {
            setStatusUpdateTargetId(row.id);
            setStatusUpdateIntent("Accepted");
          }}
        >
          {t("approve")}
        </Menu.Item>
        <Menu.Item
          color="orange"
          leftSection={<IconX size={16} />}
          onClick={() => {
            setStatusUpdateTargetId(row.id);
            setStatusUpdateIntent("Rejected");
          }}
        >
          {t("reject")}
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item
          color="red"
          leftSection={<IconTrash size={16} />}
          onClick={() => {
            if (window.confirm(t("deleteConfirm"))) {
              void deleteApplication(row.id);
            }
          }}
        >
          {t("delete")}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export { ActionsRender };