"use client";

import { Button, Paper, Stack, Text, ThemeIcon, Title } from "@mantine/core";
import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";

type StoreEmptyStateProps = {
  icon: ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
};

/**
 * Centered empty state for cart, orders, and search results.
 */
export function StoreEmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: StoreEmptyStateProps) {
  return (
    <Paper radius="lg" withBorder p="xl" ta="center">
      <Stack align="center" gap="md" maw={400} mx="auto">
        <ThemeIcon size={72} radius="xl" variant="light" color="teal">
          {icon}
        </ThemeIcon>
        <Title order={3} fw={700}>
          {title}
        </Title>
        {description ? (
          <Text c="dimmed" size="sm">
            {description}
          </Text>
        ) : null}
        {actionLabel && actionHref ? (
          <Button component={Link} href={actionHref} color="teal">
            {actionLabel}
          </Button>
        ) : null}
        {actionLabel && onAction ? (
          <Button color="teal" onClick={onAction}>
            {actionLabel}
          </Button>
        ) : null}
      </Stack>
    </Paper>
  );
}
