"use client";

import { Badge, Group, Text } from "@mantine/core";
import { dataTableSurface } from "@/components/table";

const ROLE_COLORS: Record<string, string> = {
  admin: "red",
  doctor: "blue",
  patient: "teal",
  lab: "grape",
  secretary: "orange",
};

type Props = {
  roles?: string[];
};

const RolesRender = ({ roles }: Props) => {
  const list = roles?.filter(Boolean) ?? [];

  if (list.length === 0) {
    return (
      <Text size="sm" c="dimmed" className={dataTableSurface.textCell}>
        —
      </Text>
    );
  }

  const visible = list.slice(0, 2);
  const overflow = list.length - visible.length;

  return (
    <Group gap={4} wrap="nowrap" className={dataTableSurface.textCell}>
      {visible.map((role) => (
        <Badge
          key={role}
          size="sm"
          variant="light"
          color={ROLE_COLORS[role.toLowerCase()] ?? "gray"}
        >
          {role}
        </Badge>
      ))}
      {overflow > 0 && (
        <Badge size="sm" variant="outline" color="gray">
          +{overflow}
        </Badge>
      )}
    </Group>
  );
};

export { RolesRender };
