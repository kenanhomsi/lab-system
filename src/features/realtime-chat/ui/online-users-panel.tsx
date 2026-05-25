"use client";

import {
  ActionIcon,
  Avatar,
  Badge,
  Group,
  Skeleton,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import { IconMessageCircle } from "@tabler/icons-react";
import { JSX, useMemo } from "react";
import type { OnlineUserDisplay } from "../utils/chat-helpers";

interface OnlineUsersPanelProps {
  users: OnlineUserDisplay[];
  currentUserId: string | null;
  onStartDm?: (userId: string) => void;
  dmPendingUserId?: string | null;
  loading?: boolean;
}

function UserRow({
  user,
  currentUserId,
  onStartDm,
  dmPendingUserId,
  showOnlineDot,
}: {
  user: OnlineUserDisplay;
  currentUserId: string | null;
  onStartDm?: (userId: string) => void;
  dmPendingUserId?: string | null;
  showOnlineDot: boolean;
}): JSX.Element {
  const isYou = currentUserId === user.userId;
  const { displayName } = user;
  const isPending = dmPendingUserId === user.userId;

  return (
    <Group
      justify="space-between"
      wrap="nowrap"
      className="chat-list-item"
      style={{
        padding: "8px 10px",
        borderRadius: "10px",
        transition: "background-color 150ms ease",
      }}
    >
      <Group wrap="nowrap" gap="sm">
        <div style={{ position: "relative" }}>
          <Avatar color="gray" radius="xl" size="md">
            {displayName.substring(0, 2).toUpperCase()}
          </Avatar>
          {showOnlineDot && (
            <div
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: "var(--mantine-color-green-6)",
                border: "2px solid var(--chat-avatar-border)",
              }}
            />
          )}
        </div>
        <div style={{ overflow: "hidden" }}>
          <Text size="sm" fw={500} truncate>
            {displayName} {isYou ? "(You)" : ""}
          </Text>
        </div>
      </Group>
      <Group gap="xs" wrap="nowrap">
        {user.role ? (
          <Badge size="xs" variant="light" color="gray">
            {user.role}
          </Badge>
        ) : null}
        {!isYou && onStartDm ? (
          <Tooltip label="Start direct message" withArrow>
            <ActionIcon
              variant="light"
              color="violet"
              size="md"
              loading={isPending}
              onClick={() => onStartDm(user.userId)}
              aria-label={`Chat with ${displayName}`}
            >
              <IconMessageCircle size={18} />
            </ActionIcon>
          </Tooltip>
        ) : null}
      </Group>
    </Group>
  );
}

function OnlineUsersSkeleton(): JSX.Element {
  return (
    <Stack gap="xs">
      {Array.from({ length: 4 }).map((_, i) => (
        <Group key={i} gap="sm" p="xs">
          <Skeleton circle height={40} animate />
          <Skeleton height={14} width="50%" animate />
        </Group>
      ))}
    </Stack>
  );
}

/**
 * Renders deduplicated online users grouped by presence.
 */
export function OnlineUsersPanel({
  users,
  currentUserId,
  onStartDm,
  dmPendingUserId,
  loading = false,
}: OnlineUsersPanelProps): JSX.Element {
  const { onlineUsers, offlineUsers } = useMemo(() => {
    const online: OnlineUserDisplay[] = [];
    const offline: OnlineUserDisplay[] = [];

    for (const user of users) {
      const isOnline = user.isOnline !== false;
      if (isOnline) {
        online.push(user);
      } else {
        offline.push(user);
      }
    }

    return { onlineUsers: online, offlineUsers: offline };
  }, [users]);

  if (loading) {
    return <OnlineUsersSkeleton />;
  }

  if (users.length === 0) {
    return (
      <Text size="sm" c="dimmed" ta="center" py="xl">
        No other users online.
      </Text>
    );
  }

  return (
    <Stack gap="md">
      {onlineUsers.length > 0 && (
        <Stack gap={4}>
          <Text className="chat-section-label" px={4}>
            Onlines
          </Text>
          {onlineUsers.map((user) => (
            <UserRow
              key={user.userId}
              user={user}
              currentUserId={currentUserId}
              onStartDm={onStartDm}
              dmPendingUserId={dmPendingUserId}
              showOnlineDot
            />
          ))}
        </Stack>
      )}

      {offlineUsers.length > 0 && (
        <Stack gap={4}>
          <Text className="chat-section-label" px={4}>
            Offlines
          </Text>
          {offlineUsers.map((user) => (
            <UserRow
              key={user.userId}
              user={user}
              currentUserId={currentUserId}
              onStartDm={onStartDm}
              dmPendingUserId={dmPendingUserId}
              showOnlineDot={false}
            />
          ))}
        </Stack>
      )}
    </Stack>
  );
}
