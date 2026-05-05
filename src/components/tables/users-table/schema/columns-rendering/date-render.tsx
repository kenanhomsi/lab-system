"use client";

import { Text } from "@mantine/core";
import { dataTableSurface } from "@/components/table";

type Props = {
  value: string;
};

const DateRender = ({ value }: Props) => {
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

  return (
    <Text size="sm" c="dimmed" className={dataTableSurface.textCell}>
      {label}
    </Text>
  );
};

export { DateRender };
