"use client";

import { Badge } from "@mantine/core";
import { useTranslations } from "next-intl";
import {
  InsuranceApprovalStatus,
  normalizeInsuranceApprovalStatus,
} from "@/lib/insurance-approval-status";

type Props = {
  value: string;
};

const statusColors: Record<InsuranceApprovalStatus, string> = {
  New: "blue",
  UnderReview: "orange",
  Approved: "teal",
  Rejected: "red",
  NeedMoreInfo: "yellow",
};

const StatusBadge = ({ value }: Props) => {
  const t = useTranslations("myInsuranceApproval");
  const normalized = normalizeInsuranceApprovalStatus(value);

  const labelMap: Record<InsuranceApprovalStatus, string> = {
    New: t("statusNew"),
    UnderReview: t("statusUnderReview"),
    Approved: t("statusApproved"),
    Rejected: t("statusRejected"),
    NeedMoreInfo: t("statusNeedMoreInfo"),
  };

  const label = normalized ? labelMap[normalized] : value;
  const color = normalized ? statusColors[normalized] : "gray";

  return (
    <Badge color={color} variant="light" radius="sm">
      {label}
    </Badge>
  );
};

export { StatusBadge };
