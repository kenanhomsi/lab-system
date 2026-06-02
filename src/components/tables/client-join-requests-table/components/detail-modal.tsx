"use client";

import { Group, Modal, Stack, Text } from "@mantine/core";
import { useTranslations } from "next-intl";
import { useMirror } from "../store";
import { StatusBadge } from "../schema/columns-rendering/status-badge";

const DetailModal = () => {
  const t = useTranslations("admin.clientJoinRequests");
  const isOpen = useMirror("isDetailModalOpen");
  const setIsDetailModalOpen = useMirror("setIsDetailModalOpen");
  const setSelectedRequest = useMirror("setSelectedRequest");
  const selectedRequest = useMirror("selectedRequest");

  const handleClose = () => {
    setIsDetailModalOpen(false);
    setSelectedRequest(null);
  };

  return (
    <Modal
      opened={isOpen}
      onClose={handleClose}
      title={t("modalTitle")}
      radius="lg"
      centered
      size="lg"
    >
      {selectedRequest ? (
        <Stack gap="sm">
          <Group justify="space-between">
            <Text fw={600}>{t("colStatus")}</Text>
            <StatusBadge value={selectedRequest.status} />
          </Group>
          <Text>
            <Text span fw={600}>
              {t("colManager")}:{" "}
            </Text>
            {selectedRequest.managerName}
          </Text>
          <Text>
            <Text span fw={600}>
              {t("colLab")}:{" "}
            </Text>
            {selectedRequest.labName}
          </Text>
          <Text>
            <Text span fw={600}>
              {t("mobile")}:{" "}
            </Text>
            {selectedRequest.mobileNumber}
          </Text>
          <Text>
            <Text span fw={600}>
              {t("email")}:{" "}
            </Text>
            {selectedRequest.email}
          </Text>
          <Text>
            <Text span fw={600}>
              {t("colAddress")}:{" "}
            </Text>
            {selectedRequest.address}
          </Text>
          {selectedRequest.additionalInfo ? (
            <Text>
              <Text span fw={600}>
                {t("additionalInfo")}:{" "}
              </Text>
              {selectedRequest.additionalInfo}
            </Text>
          ) : null}
          {selectedRequest.notes ? (
            <Text>
              <Text span fw={600}>
                {t("notes")}:{" "}
              </Text>
              {selectedRequest.notes}
            </Text>
          ) : null}
        </Stack>
      ) : (
        <Text c="dimmed">{t("empty")}</Text>
      )}
    </Modal>
  );
};

export { DetailModal };
