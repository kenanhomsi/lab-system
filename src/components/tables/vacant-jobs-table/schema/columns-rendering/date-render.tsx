"use client";

import { Text } from "@mantine/core";

type Props = {
  value: string;
};

const DateRender = ({ value }: Props) => {
  if (!value) {
    return (
      <Text size="sm" c="dimmed">
        —
      </Text>
    );
  }
  const date = new Date(value);
  const formatted = Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
  return <Text size="sm">{formatted}</Text>;
};

export { DateRender };
