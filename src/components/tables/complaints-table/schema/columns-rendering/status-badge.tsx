"use client";

import { Badge } from "@mantine/core";
import { useTranslations } from "next-intl";
import { ComplaintStatus, normalizeComplaintStatus } from "@/lib/complaint-status";

type Props = {
  value: string;
};

const statusColors: Record<ComplaintStatus, string> = {
  Pending: "blue",
  InReview: "orange",
  Resolved: "teal",
  Rejected: "red",
};

const StatusBadge = ({ value }: Props) => {
  const t = useTranslations("admin.complaints");
  const normalized = normalizeComplaintStatus(value);

  const labelMap: Record<ComplaintStatus, string> = {
    Pending: t("pending"),
    InReview: t("inReview"),
    Resolved: t("resolved"),
    Rejected: t("rejected"),
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
