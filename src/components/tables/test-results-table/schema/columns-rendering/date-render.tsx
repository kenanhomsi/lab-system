"use client";

import { Text } from "@mantine/core";

const DateRender = ({ value }: { value: string }) => {
  const parsed = new Date(value);
  const label = Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleString(undefined, {
    year: "numeric", month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit",
  });
  return <Text size="sm" c="dimmed">{label}</Text>;
};

export { DateRender };
