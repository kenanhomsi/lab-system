"use client";

import { ActionIcon, Group, Tooltip } from "@mantine/core";
import { IconPencil, IconX } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import type { AppointmentRow } from "../types";
import { useMirror } from "../store";
import { isCancelledStatus, isCompletedStatus, isEditableStatus } from "../utils/format";

type Props = {
  row: AppointmentRow;
};

/**
 * Renders row-level actions for blood draw appointments.
 */
const ActionsRender = ({ row }: Props) => {
  const t = useTranslations("admin.bloodDrawAppointments");
  const setActiveModal = useMirror("setActiveModal");
  const setSelectedAppointment = useMirror("setSelectedAppointment");

  if (isCancelledStatus(row.status) || isCompletedStatus(row.status)) {
    return null;
  }

  const openEditModal = () => {
    setSelectedAppointment(row);
    setActiveModal("edit");
  };

  const openCancelModal = () => {
    setSelectedAppointment(row);
    setActiveModal("cancel");
  };

  return (
    <Group gap={6} wrap="nowrap" justify="flex-end">
      {isEditableStatus(row.status) ? (
        <Tooltip label={t("editStatus")}>
          <ActionIcon variant="subtle" color="blue" onClick={openEditModal}>
            <IconPencil size={16} />
          </ActionIcon>
        </Tooltip>
      ) : null}
      <Tooltip label={t("cancel")}>
        <ActionIcon variant="subtle" color="red" onClick={openCancelModal}>
          <IconX size={16} />
        </ActionIcon>
      </Tooltip>
    </Group>
  );
};

export { ActionsRender };
