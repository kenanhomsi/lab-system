"use client";

import { ActionIcon, Group, Tooltip } from "@mantine/core";
import { IconEye, IconTrash } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useMirror } from "../../store";
import type { InsuranceApprovalItem } from "../../types";

type Props = {
  row: InsuranceApprovalItem;
};

const ActionsRender = ({ row }: Props) => {
  const t = useTranslations("myInsuranceApproval");
  const setSelectedRequestId = useMirror("setSelectedRequestId");
  const setIsDetailModalOpen = useMirror("setIsDetailModalOpen");
  const setDeleteTargetId = useMirror("setDeleteTargetId");

  const openDetail = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedRequestId(row.id);
    setIsDetailModalOpen(true);
  };

  const openDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteTargetId(row.id);
  };

  return (
    <Group gap={4} wrap="nowrap">
      <Tooltip label={t("viewDetails")}>
        <ActionIcon variant="subtle" color="blue" onClick={openDetail} aria-label={t("viewDetails")}>
          <IconEye size={16} />
        </ActionIcon>
      </Tooltip>
      <Tooltip label={t("delete")}>
        <ActionIcon variant="subtle" color="red" onClick={openDelete} aria-label={t("delete")}>
          <IconTrash size={16} />
        </ActionIcon>
      </Tooltip>
    </Group>
  );
};

export { ActionsRender };
