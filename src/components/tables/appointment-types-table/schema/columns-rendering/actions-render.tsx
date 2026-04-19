"use client";

import { ActionIcon, Menu } from "@mantine/core";
import { IconDotsVertical, IconEdit } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useMirror } from "../../store";
import { AppointmentTypeItem } from "../../types";

type Props = {
  row: AppointmentTypeItem;
};

const ActionsRender = ({ row }: Props) => {
  const t = useTranslations("admin.settings.appointmentTypes");
  const setSelectedType = useMirror("setSelectedType");
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
            setSelectedType(row);
            setActiveModal("edit");
          }}
        >
          {t("edit")}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export { ActionsRender };
