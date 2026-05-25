"use client";

import { Text, Tooltip } from "@mantine/core";
import { useTranslations } from "next-intl";

export type DateRenderContext = "result" | "created";

const DateRender = ({ value, context }: { value: string; context?: DateRenderContext }) => {
  const t = useTranslations("admin.testResults");
  const parsed = new Date(value);
  const label = Number.isNaN(parsed.getTime())
    ? value
    : parsed.toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });

  const caption =
    context === "result"
      ? t("rowDateContextResult")
      : context === "created"
        ? t("rowDateContextCreated")
        : null;

  const tip = caption ? `${caption}\n${label}` : label;

  return (
    <Tooltip label={tip} withArrow position="top" openDelay={400}>
      <Text size="sm" py={4} c="dimmed" style={{ cursor: "default" }}>
        {label}
      </Text>
    </Tooltip>
  );
};

export { DateRender };
