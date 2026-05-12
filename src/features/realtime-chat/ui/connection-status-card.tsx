"use client";

import { Badge, Button, Group, Stack, Text } from "@mantine/core";
import { IconWifi, IconWifiOff } from "@tabler/icons-react";
import type { ConnectionStatusLabel } from "../signalr/types";
import { JSX } from "react";

interface ConnectionStatusCardProps {
  chatStatus: ConnectionStatusLabel;
  onlineUsersStatus: ConnectionStatusLabel;
  chatError: string | null;
  onlineUsersError: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
}

/**
 * Displays current SignalR connection state and connect/disconnect controls.
 */
export function ConnectionStatusCard({
  chatStatus,
  onlineUsersStatus,
  chatError,
  onlineUsersError,
  onConnect,
  onDisconnect,
}: ConnectionStatusCardProps): JSX.Element {
  const isConnected = chatStatus === "Connected" && onlineUsersStatus === "Connected";
  return (
    <Stack gap="xs">
      <Group justify="space-between">
        <Group gap="xs">
          {isConnected ? (
            <IconWifi size={20} color="var(--mantine-color-green-6)" />
          ) : (
            <IconWifiOff size={20} color="var(--mantine-color-red-6)" />
          )}
          <Text fw={600} size="sm">System Status</Text>
        </Group>
        {isConnected ? (
          <Button size="compact-xs" variant="light" color="red" onClick={onDisconnect}>
            Disconnect
          </Button>
        ) : (
          <Button size="compact-xs" onClick={onConnect}>
            Connect
          </Button>
        )}
      </Group>
      <Group gap="xs">
        <Badge size="xs" color={onlineUsersStatus === "Connected" ? "green" : "gray"} variant="dot">
          Users: {onlineUsersStatus}
        </Badge>
        <Badge size="xs" color={chatStatus === "Connected" ? "green" : "gray"} variant="dot">
          Chat: {chatStatus}
        </Badge>
      </Group>
      {onlineUsersError ? <Text size="xs" c="red.6">{onlineUsersError}</Text> : null}
      {chatError ? <Text size="xs" c="red.6">{chatError}</Text> : null}
    </Stack>
  );
}
