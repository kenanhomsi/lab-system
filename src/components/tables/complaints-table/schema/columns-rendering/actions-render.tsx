"use client";

import { ActionIcon, Menu } from "@mantine/core";
import { IconDotsVertical } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { ComplaintStatus } from "@/lib/complaint-status";
import { useMirror } from "../../store";
import { ComplaintItem } from "../../types";

type Props = {
  row: ComplaintItem;
};

const ActionsRender = ({ row }: Props) => {
  const t = useTranslations("admin.complaints");
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
        <Menu.Item onClick={() => updateStatus("Pending")}>{t("markAsPending")}</Menu.Item>
        <Menu.Item onClick={() => updateStatus("InReview")}>{t("markAsInReview")}</Menu.Item>
        <Menu.Item onClick={() => updateStatus("Resolved")} color="teal">
          {t("markAsResolved")}
        </Menu.Item>
        <Menu.Item onClick={() => updateStatus("Rejected")} color="red">
          {t("markAsRejected")}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export { ActionsRender };
