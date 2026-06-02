"use client";

import { Group, Stack, Text, ThemeIcon, Title } from "@mantine/core";
import type { ReactNode } from "react";

type ModalHeaderProps = {
  icon: ReactNode;
  title: string;
  subtitle: string;
  color?: string;
};

/**
 * Standard store admin modal title row with icon, title, and subtitle.
 */
export function StoreModalHeader({
  icon,
  title,
  subtitle,
  color = "teal",
}: ModalHeaderProps) {
  return (
    <Group gap="sm" wrap="nowrap">
      <ThemeIcon size={42} radius="md" variant="light" color={color}>
        {icon}
      </ThemeIcon>
      <Stack gap={0}>
        <Title order={4}>{title}</Title>
        <Text size="sm" c="dimmed">
          {subtitle}
        </Text>
      </Stack>
    </Group>
  );
}
