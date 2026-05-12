"use client";

import { Avatar, Badge, Group, Stack, Text } from "@mantine/core";
import { JSX } from "react";

interface OnlineUsersPanelProps {
  users: Array<{ userId: string; displayName?: string; role?: string }>;
  currentUserId: string | null;
}

/**
 * Renders deduplicated online users (presence is tracked per user).
 */
export function OnlineUsersPanel({
  users,
  currentUserId,
}: OnlineUsersPanelProps): JSX.Element {
  return (
    <Stack gap="xs">
      {users.length === 0 ? (
        <Text size="sm" c="dimmed" ta="center" py="xl">
          No other users online.
        </Text>
      ) : (
        users.map((user) => {
          const isYou = currentUserId === user.userId;
          const displayName = user.displayName?.trim() ? user.displayName : user.userId;

          return (
            <Group
              key={user.userId}
              justify="space-between"
              wrap="nowrap"
              style={{ padding: "8px", borderRadius: "8px" }}
            >
              <Group wrap="nowrap" gap="sm">
                <div style={{ position: "relative" }}>
                  <Avatar color="gray" radius="xl" size="md">
                    {displayName.substring(0, 2).toUpperCase()}
                  </Avatar>
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      backgroundColor: "var(--mantine-color-green-6)",
                      border: "2px solid var(--mantine-color-body)",
                    }}
                  />
                </div>
                <div style={{ overflow: "hidden" }}>
                  <Text size="sm" fw={500} truncate>
                    {displayName} {isYou ? "(You)" : ""}
                  </Text>
                </div>
              </Group>
              {user.role ? (
                <Badge size="xs" variant="light">
                  {user.role}
                </Badge>
              ) : null}
            </Group>
          );
        })
      )}
    </Stack>
  );
}
