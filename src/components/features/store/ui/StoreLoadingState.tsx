"use client";

import { Divider, Group, Paper, Skeleton, Stack } from "@mantine/core";

type StoreLoadingStateProps = {
  variant?: "home" | "grid" | "table" | "detail";
};

/**
 * Skeleton placeholders while store data is loading.
 */
export function StoreLoadingState({ variant = "home" }: StoreLoadingStateProps) {
  if (variant === "table") {
    return (
      <Paper withBorder radius="lg" p="md">
        <Stack gap="sm">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} height={44} radius="sm" />
          ))}
        </Stack>
      </Paper>
    );
  }

  if (variant === "detail") {
    return (
      <Stack gap="lg">
        <Skeleton height={100} radius="lg" />
        <Skeleton height={80} radius="lg" />
        <Skeleton height={200} radius="lg" />
      </Stack>
    );
  }

  if (variant === "grid") {
    return (
      <Stack gap="lg">
        <Skeleton height={80} radius="lg" />
        <Group grow>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} height={280} radius="lg" />
          ))}
        </Group>
      </Stack>
    );
  }

  return (
    <Stack gap="lg">
      <Skeleton height={120} radius="lg" />
      <Group grow>
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} height={180} radius="lg" />
        ))}
      </Group>
      <Divider />
      <Group grow>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} height={280} radius="lg" />
        ))}
      </Group>
    </Stack>
  );
}
