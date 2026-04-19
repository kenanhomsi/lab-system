"use client";

import { Badge } from "@mantine/core";
import { useTranslations } from "next-intl";
import { ComplaintStatus } from "../../types";

type Props = {
  value: string;
};

const statusColors: Record<ComplaintStatus, string> = {
  received: "blue",
  in_progress: "orange",
  resolved: "teal",
};

const StatusBadge = ({ value }: Props) => {
  const t = useTranslations("admin.complaints");
  const normalized = value.toLowerCase() as ComplaintStatus;

  const labelMap: Record<ComplaintStatus, string> = {
    received: t("received"),
    in_progress: t("inProgress"),
    resolved: t("resolved"),
  };

  const label = labelMap[normalized] ?? value;
  const color = statusColors[normalized] ?? "gray";

  return (
    <Badge color={color} variant="light" radius="sm">
      {label}
    </Badge>
  );
};

export { StatusBadge };
