"use client";

import { Badge, type MantineColor } from "@mantine/core";
import { useTranslations } from "next-intl";
import type { StoreOrderStatus } from "@/modules/store";

const statusColorMap: Record<StoreOrderStatus, MantineColor> = {
  Pending: "yellow",
  Confirmed: "blue",
  Preparing: "cyan",
  OutForDelivery: "violet",
  Delivered: "green",
  Cancelled: "red",
};

const statusLabelKey: Record<StoreOrderStatus, string> = {
  Pending: "pending",
  Confirmed: "confirmed",
  Preparing: "processing",
  OutForDelivery: "shipped",
  Delivered: "delivered",
  Cancelled: "cancelled",
};

type StoreOrderStatusBadgeProps = {
  status: StoreOrderStatus | string;
  size?: "sm" | "md" | "lg";
};

/**
 * Colored badge for store order status with i18n labels.
 */
export function StoreOrderStatusBadge({ status, size = "sm" }: StoreOrderStatusBadgeProps) {
  const t = useTranslations("labStore");
  const normalized = status as StoreOrderStatus;
  const color = statusColorMap[normalized] ?? "gray";
  const labelKey = statusLabelKey[normalized];
  const label = labelKey ? t(labelKey) : status;

  return (
    <Badge color={color} variant="light" size={size} radius="sm">
      {label}
    </Badge>
  );
}
