"use client";

import { Box, Group, Paper, Stack, Text, Avatar } from "@mantine/core";
import type { ReceiveMessagePayload } from "../signalr/types";
import { JSX, useEffect, useRef } from "react";

interface MessageThreadPanelProps {
  messages: ReceiveMessagePayload[];
  typingUserIds: string[];
  currentUserId: string | null;
}

function fmtTime(createdAtUtc: string): string {
  const date = new Date(createdAtUtc);
  if (Number.isNaN(date.getTime())) return createdAtUtc;
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/**
 * Renders messages for the active conversation plus typing indicators.
 */
export function MessageThreadPanel({
  messages,
  typingUserIds,
  currentUserId,
}: MessageThreadPanelProps): JSX.Element {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUserIds]);

  return (
    <Stack gap="md" style={{ minHeight: "100%", justifyContent: "flex-end" }}>
      {messages.length === 0 ? (
        <Text size="sm" c="dimmed" ta="center" my="auto">
          No messages yet. Say hi!
        </Text>
      ) : (
        messages.map((message, index) => {
          const isMe = currentUserId?.trim() === message.senderId?.trim();
          const displayName = message.senderDisplayName?.trim() || message.senderId;
          const showAvatar = !isMe && (index === 0 || messages[index - 1].senderId !== message.senderId);

          return (
            <Group
              key={message.messageId}
              justify={isMe ? "flex-end" : "flex-start"}
              align="flex-end"
              wrap="nowrap"
              gap="xs"
            >
              {!isMe && (
                <Box w={32}>
                  {showAvatar && (
                    <Avatar radius="xl" size="sm" color="blue">
                      {displayName.substring(0, 2).toUpperCase()}
                    </Avatar>
                  )}
                </Box>
              )}

              <Box style={{ maxWidth: "70%" }}>
                {!isMe && showAvatar && (
                  <Text size="xs" c="dimmed" mb={4} ml={4}>
                    {displayName}
                  </Text>
                )}
                <Paper
                  p="sm"
                  radius="lg"
                  style={{
                    backgroundColor: isMe ? "var(--mantine-color-blue-filled)" : "var(--mantine-color-gray-1)",
                    color: isMe ? "var(--mantine-color-white)" : "var(--mantine-color-text)",
                    borderBottomRightRadius: isMe ? 4 : undefined,
                    borderBottomLeftRadius: !isMe ? 4 : undefined,
                  }}
                >
                  <Text size="sm" style={{ wordBreak: "break-word" }}>
                    {message.text ?? ""}
                  </Text>
                  <Text
                    size="xs"
                    ta="right"
                    mt={4}
                    c={isMe ? "blue.2" : "dimmed"}
                    style={{ fontSize: "10px" }}
                  >
                    {fmtTime(message.createdAtUtc)}
                  </Text>
                </Paper>
              </Box>
            </Group>
          );
        })
      )}

      {typingUserIds.length > 0 && (
        <Group gap="xs" mt="xs">
          <Box w={32} />
          <Paper p="xs" radius="xl" style={{ backgroundColor: "var(--mantine-color-gray-1)" }}>
            <Text size="xs" c="dimmed" fs="italic">
              {typingUserIds.length === 1
                ? `${typingUserIds[0]} is typing...`
                : `${typingUserIds.length} people are typing...`}
            </Text>
          </Paper>
        </Group>
      )}
      <div ref={bottomRef} />
    </Stack>
  );
}
