"use client";

import { Badge } from "@mantine/core";
import { useTranslations } from "next-intl";
import {
  CLIENT_JOIN_REQUEST_STATUSES,
  normalizeClientJoinRequestStatus,
} from "@/lib/client-join-request-status";

type Props = {
  value: string;
};

const statusColors: Record<(typeof CLIENT_JOIN_REQUEST_STATUSES)[number], string> = {
  New: "blue",
  Approved: "teal",
  Rejected: "red",
};

const StatusBadge = ({ value }: Props) => {
  const t = useTranslations("admin.clientJoinRequests");
  const normalized = normalizeClientJoinRequestStatus(value);

  const labelMap: Record<(typeof CLIENT_JOIN_REQUEST_STATUSES)[number], string> = {
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
