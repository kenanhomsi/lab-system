"use client";

import { Box } from "@mantine/core";
import { dataTableSurface } from "@/components/table";

type Props = {
  value: boolean;
  trueLabel: string;
  falseLabel: string;
  type?: "status" | "confirmed";
};

const tokenStyles: Record<
  "status" | "confirmed",
  { true: { bg: string; fg: string }; false: { bg: string; fg: string } }
> = {
  status: {
    true: {
      bg: "var(--color-background-success)",
      fg: "var(--color-text-success)",
    },
    false: {
      bg: "var(--color-background-danger)",
      fg: "var(--color-text-danger)",
    },
  },
  confirmed: {
    true: {
      bg: "var(--color-background-info)",
      fg: "var(--color-text-info)",
    },
    false: {
      bg: "var(--color-background-warning)",
      fg: "var(--color-text-warning)",
    },
  },
};

const StatusBadge = ({
  value,
  trueLabel,
  falseLabel,
  type = "status",
}: Props) => {
  const style = value ? tokenStyles[type].true : tokenStyles[type].false;

  return (
    <Box
      component="span"
      className={dataTableSurface.badge}
      style={{ background: style.bg, color: style.fg }}
    >
      {value ? trueLabel : falseLabel}
    </Box>
  );
};

export { StatusBadge };
