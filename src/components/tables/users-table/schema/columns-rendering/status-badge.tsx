"use client";

import { Badge } from "@mantine/core";

type Props = {
  value: boolean;
  trueLabel: string;
  falseLabel: string;
  type?: "status" | "confirmed";
};

const StatusBadge = ({ value, trueLabel, falseLabel, type = "status" }: Props) => {
  let trueColor = "teal";
  let falseColor = "red";

  if (type === "confirmed") {
    trueColor = "blue";
    falseColor = "orange";
  }

  return (
    <Badge
      color={value ? trueColor : falseColor}
      variant="light"
      radius="sm"
      size="sm"
    >
      {value ? trueLabel : falseLabel}
    </Badge>
  );
};

export { StatusBadge };
