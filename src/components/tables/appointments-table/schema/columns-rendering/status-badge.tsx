"use client";

import { Badge } from "@mantine/core";
import { useTranslations } from "next-intl";

type Props = {
  status: string;
};

const statusToColor = (status: string) => {
  const normalized = status.toLowerCase();
  if (normalized === "confirmed") return "teal";
  if (normalized === "in_progress") return "blue";
  if (normalized === "completed") return "green";
  if (normalized === "cancelled") return "red";
  return "yellow";
};

const StatusBadge = ({ status }: Props) => {
  const t = useTranslations("admin.appointments");

  const labelMap: Record<string, string> = {
    confirmed: t("statusConfirmed"),
    in_progress: t("statusInProgress"),
    completed: t("statusCompleted"),
    cancelled: t("statusCancelled"),
    pending: t("statusPending"),
  };

  const normalized = status.toLowerCase();
  const label = labelMap[normalized] ?? status;

  return (
    <Badge color={statusToColor(status)} variant="light" radius="sm">
      {label}
    </Badge>
  );
};

export { StatusBadge };
