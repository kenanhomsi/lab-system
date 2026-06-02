"use client";

import { Group, Stack, Text, ThemeIcon } from "@mantine/core";
import type { ReactNode } from "react";

type SectionHeaderProps = {
  icon: ReactNode;
  title: string;
  description: string;
  color?: string;
};

/**
 * Section divider inside multi-step store modals.
 */
export function StoreSectionHeader({
  icon,
  title,
  description,
  color = "teal",
}: SectionHeaderProps) {
  return (
    <Group align="flex-start" gap="sm">
      <ThemeIcon size={38} radius="md" variant="light" color={color}>
        {icon}
      </ThemeIcon>
      <Stack gap={2}>
        <Text fw={600}>{title}</Text>
        <Text size="sm" c="dimmed">
          {description}
        </Text>
      </Stack>
    </Group>
  );
}
