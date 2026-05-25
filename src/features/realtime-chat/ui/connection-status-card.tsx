"use client";

import {
  Badge,
  Button,
  Collapse,
  Group,
  Loader,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { IconChevronDown, IconChevronUp, IconWifi, IconWifiOff } from "@tabler/icons-react";
import type { ConnectionStatusLabel } from "../signalr/types";
import { JSX, useState } from "react";

interface ConnectionStatusCardProps {
  chatStatus: ConnectionStatusLabel;
  onlineUsersStatus: ConnectionStatusLabel;
  chatError: string | null;
  onlineUsersError: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
}

function HubStatusBadge({
  label,
  status,
}: {
  label: string;
  status: ConnectionStatusLabel;
}): JSX.Element {
  const color =
    status === "Connected"
      ? "green"
      : status === "Connecting"
        ? "yellow"
        : "gray";
  return (
    <Group gap={5} wrap="nowrap">
      <div
        className={
          status === "Connected"
            ? "chat-status-dot chat-status-dot--connected"
            : status === "Connecting"
              ? "chat-status-dot chat-status-dot--connecting"
              : "chat-status-dot"
        }
      />
      <Badge
        size="xs"
        color={color}
        variant="light"
        style={{ textTransform: "none" }}
      >
        {label}
      </Badge>
    </Group>
  );
}

/**
 * Displays current SignalR connection state and connect/disconnect controls.
 * Compact single-line status with optional hub details.
 */
export function ConnectionStatusCard({
  chatStatus,
  onlineUsersStatus,
  chatError,
  onlineUsersError,
  onConnect,
  onDisconnect,
}: ConnectionStatusCardProps): JSX.Element {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const isConnected =
    chatStatus === "Connected" && onlineUsersStatus === "Connected";
  const isConnecting =
    chatStatus === "Connecting" || onlineUsersStatus === "Connecting";
  const errorMessage = onlineUsersError ?? chatError;

  return (
    <>
      <style>{`
        .chat-status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: var(--mantine-color-gray-5);
          flex-shrink: 0;
        }
        .chat-status-dot--connected {
          background-color: var(--mantine-color-green-6);
          animation: chat-status-pulse 2.4s ease-in-out infinite;
        }
        .chat-status-dot--connecting {
          background-color: var(--mantine-color-yellow-5);
          animation: chat-status-blink 0.9s ease-in-out infinite;
        }
        @keyframes chat-status-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
          50% { box-shadow: 0 0 0 5px rgba(34, 197, 94, 0); }
        }
        @keyframes chat-status-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.25; }
        }
      `}</style>

      <Stack gap={6}>
        <Group justify="space-between" align="center" wrap="nowrap">
          <Group gap={8} align="center" wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
            {isConnecting ? (
              <Loader size={16} color="yellow" type="dots" />
            ) : isConnected ? (
              <IconWifi size={18} color="var(--mantine-color-green-6)" />
            ) : (
              <IconWifiOff size={18} color="var(--mantine-color-red-5)" />
            )}
            <div
              className={
                isConnected
                  ? "chat-status-dot chat-status-dot--connected"
                  : isConnecting
                    ? "chat-status-dot chat-status-dot--connecting"
                    : "chat-status-dot"
              }
            />
            <Text
              fw={600}
              size="sm"
              truncate
              c={
                isConnected
                  ? "green.7"
                  : isConnecting
                    ? "yellow.7"
                    : "dimmed"
              }
            >
              {isConnecting
                ? "Connecting…"
                : isConnected
                  ? "Live"
                  : "Offline"}
            </Text>
          </Group>

          {isConnected ? (
            <Button
              size="compact-xs"
              variant="light"
              color="red"
              onClick={onDisconnect}
            >
              Disconnect
            </Button>
          ) : (
            <Button
              size="compact-xs"
              color="violet"
              loading={isConnecting}
              onClick={onConnect}
            >
              Connect
            </Button>
          )}
        </Group>

        <UnstyledButton
          onClick={() => setDetailsOpen((v) => !v)}
          style={{ alignSelf: "flex-start" }}
        >
          <Group gap={4}>
            <Text size="xs" c="dimmed">
              Hub details
            </Text>
            {detailsOpen ? (
              <IconChevronUp size={12} color="var(--mantine-color-dimmed)" />
            ) : (
              <IconChevronDown size={12} color="var(--mantine-color-dimmed)" />
            )}
          </Group>
        </UnstyledButton>

        <Collapse expanded={detailsOpen}>
          <Group gap={10} mt={4}>
            <HubStatusBadge label="Users hub" status={onlineUsersStatus} />
            <HubStatusBadge label="Chat hub" status={chatStatus} />
          </Group>
        </Collapse>

        {errorMessage && (
          <Text size="xs" c="red.6" lineClamp={2}>
            {errorMessage}
          </Text>
        )}
      </Stack>
    </>
  );
}
