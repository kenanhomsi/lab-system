"use client";

import { Anchor, Group, Loader, Modal, Stack, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { frontendContainer } from "@/container";
import {
  InsuranceApprovalRequestFrontendService,
  insuranceApprovalRequestModuleNames,
} from "@/modules/insurance-approval-request";
import { useMirror } from "../store";
import { StatusBadge } from "../schema/columns-rendering/status-badge";

const service = frontendContainer.get<InsuranceApprovalRequestFrontendService>(
  insuranceApprovalRequestModuleNames.service,
);

const DetailModal = () => {
  const t = useTranslations("myInsuranceApproval");
  const isOpen = useMirror("isDetailModalOpen");
  const setIsDetailModalOpen = useMirror("setIsDetailModalOpen");
  const setSelectedRequestId = useMirror("setSelectedRequestId");
  const selectedRequestId = useMirror("selectedRequestId");

  const { data, isPending } = useQuery({
    queryKey: ["my-insurance-approval-detail", selectedRequestId],
    queryFn: () => service.findMineOne(String(selectedRequestId)),
    enabled: isOpen && selectedRequestId !== null,
  });

  const handleClose = () => {
    setIsDetailModalOpen(false);
    setSelectedRequestId(null);
  };

  return (
    <Modal opened={isOpen} onClose={handleClose} title={t("detailTitle")} radius="lg" centered size="lg">
      {isPending ? (
        <Group justify="center" py="xl">
          <Loader size="sm" />
        </Group>
      ) : data ? (
        <Stack gap="sm">
          <Group justify="space-between">
            <Text fw={600}>{t("colStatus")}</Text>
            <StatusBadge value={data.status} />
          </Group>
          <Text>
            <Text span fw={600}>
              {t("colInsuredName")}:{" "}
            </Text>
            {data.insuredName}
          </Text>
          <Text>
            <Text span fw={600}>
              {t("colInsuranceNumber")}:{" "}
            </Text>
            {data.insuranceNumber}
          </Text>
          <Text>
            <Text span fw={600}>
              {t("colMobile")}:{" "}
            </Text>
            {data.mobileNumber}
          </Text>
          {data.notes ? (
            <Text>
              <Text span fw={600}>
                {t("notes")}:{" "}
              </Text>
              {data.notes}
            </Text>
          ) : null}
          {data.rejectionReason ? (
            <Text c="red">
              <Text span fw={600}>
                {t("rejectionReason")}:{" "}
              </Text>
              {data.rejectionReason}
            </Text>
          ) : null}
          {data.insuranceCardImageUrl ? (
            <Anchor href={data.insuranceCardImageUrl} target="_blank" rel="noreferrer">
              {t("viewCardImage")}
            </Anchor>
          ) : null}
          {data.prescriptionImageUrl ? (
            <Anchor href={data.prescriptionImageUrl} target="_blank" rel="noreferrer">
              {t("viewPrescriptionImage")}
            </Anchor>
          ) : null}
        </Stack>
      ) : (
        <Text c="dimmed">{t("detailNotFound")}</Text>
      )}
    </Modal>
  );
};

export { DetailModal };
