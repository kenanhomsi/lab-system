"use client";

import { ActionIcon, Group, Tooltip } from "@mantine/core";
import { IconCalendarPlus, IconEdit, IconTrash } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useMirror } from "../../store";
import { TestRequestItem } from "../../types";
import { useSyncedSessionUser } from "@/stores/use-synced-session-user";

const ActionsRender = ({ row }: { row: TestRequestItem }) => {
  const t = useTranslations("admin.common");
  const ta = useTranslations("appointmentsFeature");
  const { user } = useSyncedSessionUser();
  const setSelectedTestRequest = useMirror("setSelectedTestRequest");
  const setActiveModal = useMirror("setActiveModal");
  const roles = user?.roles?.map((role) => role.toLowerCase()) ?? [];
  const canBookAppointment = roles.includes("doctor") || roles.includes("patient");

  const openModal = (modal: "edit" | "delete" | "appointment") => {
    setSelectedTestRequest(row);
    setActiveModal(modal);
  };

  return (
    <Group gap={4} wrap="nowrap" justify="flex-end">
      {canBookAppointment ? (
        <Tooltip label={ta("bookAction")} withArrow position="top">
          <ActionIcon variant="subtle" color="teal" radius="md" size="md" onClick={(e) => { e.stopPropagation(); openModal("appointment"); }}>
            <IconCalendarPlus size={15} />
          </ActionIcon>
        </Tooltip>
      ) : null}
      <Tooltip label={t("edit")} withArrow position="top">
        <ActionIcon variant="subtle" color="blue" radius="md" size="md" onClick={(e) => { e.stopPropagation(); openModal("edit"); }}>
          <IconEdit size={15} />
        </ActionIcon>
      </Tooltip>
      <Tooltip label={t("delete")} withArrow position="top">
        <ActionIcon variant="subtle" color="red" radius="md" size="md" onClick={(e) => { e.stopPropagation(); openModal("delete"); }}>
          <IconTrash size={15} />
        </ActionIcon>
      </Tooltip>
    </Group>
  );
};

export { ActionsRender };
