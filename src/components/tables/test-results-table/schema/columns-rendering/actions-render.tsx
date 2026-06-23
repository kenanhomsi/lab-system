"use client";

import { ActionIcon, Group, Tooltip } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconDownload, IconEdit, IconTrash } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import {
  createTestResultPdfBlob,
  downloadBlob,
  getResultFileName,
  parseResultRows,
} from "../../pdf-export";
import { useMirror } from "../../store";
import { TestResultItem } from "../../types";

/**
 * Renders per-row actions for viewing or managing a test result.
 */
const ActionsRender = ({
  row,
  canManage,
}: {
  row: TestResultItem;
  canManage: boolean;
}) => {
  const t = useTranslations("admin.common");
  const testResultsT = useTranslations("admin.testResults");
  const setSelectedTestResult = useMirror("setSelectedTestResult");
  const setActiveModal = useMirror("setActiveModal");
  const [isDownloading, setIsDownloading] = useState(false);

  const openModal = (modal: "edit" | "delete") => {
    setSelectedTestResult(row);
    setActiveModal(modal);
  };

  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    try {
      const rows = parseResultRows(row.resultData).rows;
      const blob = await createTestResultPdfBlob(row);
      downloadBlob(blob, getResultFileName(row, rows));
    } catch {
      notifications.show({
        color: "red",
        message: testResultsT("downloadPdfFailed"),
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Group gap={4} wrap="nowrap" justify="flex-end">
      <Tooltip label={testResultsT("downloadPdf")} withArrow position="top">
        <ActionIcon
          variant="subtle"
          color="teal"
          radius="md"
          size="md"
          aria-label={testResultsT("downloadPdf")}
          loading={isDownloading}
          onClick={(e) => {
            e.stopPropagation();
            void handleDownloadPdf();
          }}
        >
          <IconDownload size={15} />
        </ActionIcon>
      </Tooltip>
      {canManage ? (
        <>
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
        </>
      ) : null}
    </Group>
  );
};

export { ActionsRender };
