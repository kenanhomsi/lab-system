"use client";

import { Group, Modal, Stack, Text } from "@mantine/core";
import { useTranslations } from "next-intl";
import { useMirror } from "../store";
import { StatusBadge } from "../schema/columns-rendering/status-badge";

function contractTypeLabel(t: (key: string) => string, value: string): string {
  if (value === "Individual") return t("contractTypeIndividual");
  if (value === "Organization") return t("contractTypeOrganization");
  return value;
}

function durationLabel(t: (key: string) => string, value: string): string {
  if (value === "ThreeMonths") return t("durationThreeMonths");
  if (value === "SixMonths") return t("durationSixMonths");
  if (value === "OneYear") return t("durationOneYear");
  return value;
}

const DetailModal = () => {
  const t = useTranslations("admin.contractServiceRequests");
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
              {t("colContractType")}:{" "}
            </Text>
            {contractTypeLabel(t, selectedRequest.contractType)}
          </Text>
          <Text>
            <Text span fw={600}>
              {t("colResponsible")}:{" "}
            </Text>
            {selectedRequest.responsibleName}
          </Text>
          <Text>
            <Text span fw={600}>
              {t("colOrganization")}:{" "}
            </Text>
            {selectedRequest.organizationName}
          </Text>
          <Text>
            <Text span fw={600}>
              {t("colSubscribers")}:{" "}
            </Text>
            {selectedRequest.expectedSubscribersCount}
          </Text>
          <Text>
            <Text span fw={600}>
              {t("contactNumber")}:{" "}
            </Text>
            {selectedRequest.contactNumber}
          </Text>
          <Text>
            <Text span fw={600}>
              {t("email")}:{" "}
            </Text>
            {selectedRequest.email}
          </Text>
          <Text>
            <Text span fw={600}>
              {t("address")}:{" "}
            </Text>
            {selectedRequest.address}
          </Text>
          <Text>
            <Text span fw={600}>
              {t("colDuration")}:{" "}
            </Text>
            {durationLabel(t, selectedRequest.contractDuration)}
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
