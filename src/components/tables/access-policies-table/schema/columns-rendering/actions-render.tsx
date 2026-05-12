"use client";

import { ActionIcon, Menu } from "@mantine/core";
import {
  IconCircleCheck,
  IconCircleOff,
  IconDotsVertical,
  IconEdit,
  IconTrash,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useMirror } from "../../store";
import { AccessPolicyTableItem } from "../../types";

type Props = {
  row: AccessPolicyTableItem;
};

const ActionsRender = ({ row }: Props) => {
  const t = useTranslations("admin.settings.accessPolicies");
  const setSelectedPolicy = useMirror("setSelectedPolicy");
  const setActiveModal = useMirror("setActiveModal");
  const enablePolicy = useMirror("enableAccessPolicy") as (id: string) => Promise<unknown>;
  const disablePolicy = useMirror("disableAccessPolicy") as (id: string) => Promise<unknown>;

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
            setSelectedPolicy(row);
            setActiveModal("edit");
          }}
        >
          {t("edit")}
        </Menu.Item>
        <Menu.Item
          leftSection={<IconCircleCheck size={16} />}
          disabled={row.isEnabled}
          onClick={() => {
            void enablePolicy(row.id);
          }}
        >
          {t("enable")}
        </Menu.Item>
        <Menu.Item
          leftSection={<IconCircleOff size={16} />}
          disabled={!row.isEnabled}
          onClick={() => {
            void disablePolicy(row.id);
          }}
        >
          {t("disable")}
        </Menu.Item>
        <Menu.Item
          color="red"
          leftSection={<IconTrash size={16} />}
          onClick={() => {
            setSelectedPolicy(row);
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
