"use client";

import { ActionIcon, Group, Tooltip } from "@mantine/core";
import { IconEye, IconLink } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useMirror } from "../../store";
import type { ExternalPatientRow } from "../../types";

const ActionsRender = ({ row }: { row: ExternalPatientRow }) => {
  const t = useTranslations("externalPatients");
  const setSelectedPatient = useMirror("setSelectedPatient");
  const setActiveModal = useMirror("setActiveModal");

  const canLink = !row.linkedDirectPatientId;

  return (
    <Group gap={6} wrap="nowrap" justify="flex-end">
      <Tooltip label={t("actionView")} withArrow position="top">
        <ActionIcon
          variant="light"
          color="gray"
          radius="md"
          size="md"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedPatient(row);
            setActiveModal("view");
          }}
        >
          <IconEye size={16} />
        </ActionIcon>
      </Tooltip>
      {canLink ? (
        <Tooltip label={t("actionLink")} withArrow position="top">
        <ActionIcon
          variant="light"
          color="teal"
          radius="md"
          size="md"
          onClick={(e) => {
              e.stopPropagation();
              setSelectedPatient(row);
              setActiveModal("link");
            }}
          >
            <IconLink size={16} />
          </ActionIcon>
        </Tooltip>
      ) : null}
    </Group>
  );
};

export { ActionsRender };
