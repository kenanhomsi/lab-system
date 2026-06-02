"use client";

import { Badge, Flex, Group, Paper, Text, ThemeIcon, Title } from "@mantine/core";
import type { ReactNode } from "react";

type StorePageHeaderProps = {
  badge?: string;
  title: string;
  description?: string;
  icon?: ReactNode;
  actions?: ReactNode;
};

/**
 * Consistent hero header for all lab store pages.
 */
export function StorePageHeader({ badge, title, description, icon, actions }: StorePageHeaderProps) {
  return (
    <Paper
      radius="lg"
      withBorder
      p={{ base: "md", sm: "lg" }}
      style={{
        background:
          "linear-gradient(135deg, var(--mantine-color-teal-0) 0%, var(--mantine-color-white) 55%, var(--mantine-color-gray-0) 100%)",
      }}
    >
      <Flex
        direction={{ base: "column", sm: "row" }}
        justify="space-between"
        align={{ base: "stretch", sm: "flex-start" }}
        gap="md"
      >
        <Group align="flex-start" wrap="nowrap" gap="md">
          {icon ? (
            <ThemeIcon size={48} radius="md" variant="light" color="teal">
              {icon}
            </ThemeIcon>
          ) : null}
          <div>
            {badge ? (
              <Badge color="teal" variant="light" mb={6}>
                {badge}
              </Badge>
            ) : null}
            <Title order={2} fw={800} lh={1.2}>
              {title}
            </Title>
            {description ? (
              <Text c="dimmed" mt={6} maw={560} size="sm">
                {description}
              </Text>
            ) : null}
          </div>
        </Group>
        {actions ? <Group justify="flex-end">{actions}</Group> : null}
      </Flex>
    </Paper>
  );
}
