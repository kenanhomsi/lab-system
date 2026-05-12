"use client";

import { ActionIcon, Avatar, Group, Stack, Text, TextInput, UnstyledButton } from "@mantine/core";
import { IconMessagePlus, IconX } from "@tabler/icons-react";
import { JSX, useState } from "react";

interface ConversationListPanelProps {
  openConversationIds: string[];
  activeConversationId: string | null;
  onSetActive: (conversationId: string) => void;
  onJoin: (conversationId: string) => void;
  onLeave: (conversationId: string) => void;
}

/**
 * Manages opening, selecting, and leaving subscribed conversation rooms.
 */
export function ConversationListPanel({
  openConversationIds,
  activeConversationId,
  onSetActive,
  onJoin,
  onLeave,
}: ConversationListPanelProps): JSX.Element {
  const [joinConversationId, setJoinConversationId] = useState("");

  return (
    <Stack gap="md">
      <Group gap="xs">
        <TextInput
          placeholder="Join conversation ID..."
          value={joinConversationId}
          onChange={(event) => setJoinConversationId(event.currentTarget.value)}
          flex={1}
          size="sm"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const next = joinConversationId.trim();
              if (next) {
                onJoin(next);
                setJoinConversationId("");
              }
            }
          }}
        />
        <ActionIcon
          size="lg"
          variant="light"
          color="blue"
          onClick={() => {
            const next = joinConversationId.trim();
            if (!next) return;
            onJoin(next);
            setJoinConversationId("");
          }}
        >
          <IconMessagePlus size={18} />
        </ActionIcon>
      </Group>

      <Stack gap={4}>
        {openConversationIds.length === 0 ? (
          <Text c="dimmed" size="sm" ta="center" py="xl">
            No open conversations.
          </Text>
        ) : (
          openConversationIds.map((conversationId) => {
            const isActive = conversationId === activeConversationId;
            return (
              <UnstyledButton
                key={conversationId}
                onClick={() => onSetActive(conversationId)}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  backgroundColor: isActive ? "var(--mantine-color-blue-light)" : "transparent",
                  transition: "background-color 150ms ease",
                }}
              >
                <Group justify="space-between" wrap="nowrap">
                  <Group wrap="nowrap" gap="sm" style={{ flex: 1, overflow: "hidden" }}>
                    <Avatar color={isActive ? "blue" : "gray"} radius="xl" size="md">
                      {conversationId.substring(0, 2).toUpperCase()}
                    </Avatar>
                    <div style={{ overflow: "hidden", flex: 1 }}>
                      <Text size="sm" fw={500} truncate>
                        {conversationId}
                      </Text>
                      <Text size="xs" c={isActive ? "blue.7" : "dimmed"} truncate>
                        {isActive ? "Active chat" : "Tap to open"}
                      </Text>
                    </div>
                  </Group>
                  <ActionIcon
                    size="sm"
                    color="red"
                    variant="subtle"
                    onClick={(e) => {
                      e.stopPropagation();
                      onLeave(conversationId);
                    }}
                  >
                    <IconX size={14} />
                  </ActionIcon>
                </Group>
              </UnstyledButton>
            );
          })
        )}
      </Stack>
    </Stack>
  );
}
