"use client";

import { Button, Divider, Group, Paper, Stack, Text, Title } from "@mantine/core";
import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";

type StoreSummaryLine = {
  label: string;
  value: string | number;
  bold?: boolean;
};

type StoreSummaryPanelProps = {
  title: string;
  lines: StoreSummaryLine[];
  totalLabel: string;
  totalValue: string | number;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  actionLoading?: boolean;
  children?: ReactNode;
};

/**
 * Sticky order summary panel used in cart and checkout.
 */
export function StoreSummaryPanel({
  title,
  lines,
  totalLabel,
  totalValue,
  actionLabel,
  actionHref,
  onAction,
  actionLoading,
  children,
}: StoreSummaryPanelProps) {
  return (
    <Paper withBorder radius="lg" p="lg" shadow="sm">
      <Stack gap="md">
        <Title order={4} fw={700}>
          {title}
        </Title>
        {children}
        <Stack gap="xs">
          {lines.map((line) => (
            <Group key={line.label} justify="space-between">
              <Text size="sm" c={line.bold ? "dark" : "dimmed"} fw={line.bold ? 700 : 400}>
                {line.label}
              </Text>
              <Text size="sm" fw={line.bold ? 700 : 500}>
                {line.value}
              </Text>
            </Group>
          ))}
        </Stack>
        <Divider />
        <Group justify="space-between">
          <Text fw={800} size="lg">
            {totalLabel}
          </Text>
          <Text fw={800} size="lg" c="teal">
            {totalValue}
          </Text>
        </Group>
        {actionLabel && actionHref ? (
          <Button component={Link} href={actionHref} color="teal" size="md" fullWidth>
            {actionLabel}
          </Button>
        ) : null}
        {actionLabel && onAction ? (
          <Button color="teal" size="md" fullWidth loading={actionLoading} onClick={onAction}>
            {actionLabel}
          </Button>
        ) : null}
      </Stack>
    </Paper>
  );
}
