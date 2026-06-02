"use client";

import { Text } from "@mantine/core";

type Props = {
  value: string;
};

const DateRender = ({ value }: Props) => {
  const date = new Date(value);
  const formatted = Number.isNaN(date.getTime())
    ? value
    : date.toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

  return <Text size="sm">{formatted}</Text>;
};

export { DateRender };
