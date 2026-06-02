"use client";

import { Badge } from "@mantine/core";
import { useTranslations } from "next-intl";
import {
  CONTRACT_SERVICE_REQUEST_STATUSES,
  normalizeContractServiceRequestStatus,
} from "@/lib/contract-service-request-status";

type Props = {
  value: string;
};

const statusColors: Record<(typeof CONTRACT_SERVICE_REQUEST_STATUSES)[number], string> = {
  New: "blue",
  Approved: "teal",
  Rejected: "red",
};

const StatusBadge = ({ value }: Props) => {
  const t = useTranslations("admin.contractServiceRequests");
  const normalized = normalizeContractServiceRequestStatus(value);

  const labelMap: Record<(typeof CONTRACT_SERVICE_REQUEST_STATUSES)[number], string> = {
    New: t("statusNew"),
    Approved: t("statusApproved"),
    Rejected: t("statusRejected"),
  };

  const label = normalized ? labelMap[normalized] : value || t("statusNew");
  const color = normalized ? statusColors[normalized] : "gray";

  return (
    <Badge color={color} variant="light" radius="sm">
      {label}
    </Badge>
  );
};

export { StatusBadge };
