"use client";

import {
  Anchor,
  Avatar,
  Box,
  Group,
  Loader,
  Paper,
  Skeleton,
  Stack,
  Text,
} from "@mantine/core";
import {
  IconCheck,
  IconChecks,
  IconFile,
  IconMessageCircle,
} from "@tabler/icons-react";
import type { ReceiveMessagePayload } from "../signalr/types";
import { type JSX, useEffect, useRef } from "react";

function isFileMessage(message: ReceiveMessagePayload): boolean {
  return (
    message.messageType === 2 ||
    !!message.fileUrl?.trim() ||
    !!message.attachmentFileName?.trim()
  );
}

function shouldShowCaption(message: ReceiveMessagePayload): boolean {
  const caption = message.text?.trim() ?? "";
  if (!caption) return false;
  const fileName = message.attachmentFileName?.trim();
  if (isFileMessage(message) && fileName && caption === fileName) return false;
  return true;
}

function isImageAttachment(
  fileType?: string | null,
  fileUrl?: string | null,
): boolean {
  if (fileType?.toLowerCase().startsWith("image/")) return true;
  if (!fileUrl) return false;
  return /\.(png|jpe?g|gif|webp|bmp|svg)(\?|$)/i.test(fileUrl);
}

function MessageAttachmentContent({
  message,
  isMe,
}: {
  message: ReceiveMessagePayload;
  isMe: boolean;
}): JSX.Element | null {
  if (!isFileMessage(message)) return null;

  const fileUrl = message.fileUrl?.trim();
  const fileName =
    message.attachmentFileName?.trim() ||
    fileUrl?.split("/").pop()?.split("?")[0] ||
    "Attachment";
  const fileType = message.attachmentFileType ?? null;

  if (!fileUrl) {
    return (
      <Group gap="xs" mt={message.text?.trim() ? 8 : 0}>
        <Loader size="xs" color={isMe ? "white" : "violet"} />
        <Text size="xs" c={isMe ? "rgba(255,255,255,0.75)" : "dimmed"}>
          Uploading attachment…
        </Text>
      </Group>
    );
  }

  if (isImageAttachment(fileType, fileUrl)) {
    return (
      <Box mt={message.text?.trim() ? 8 : 0}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={fileUrl}
          alt={fileName}
          style={{
            maxWidth: "100%",
            maxHeight: 280,
            borderRadius: 8,
            display: "block",
          }}
        />
      </Box>
    );
  }

  return (
    <Anchor
      href={fileUrl}
      target="_blank"
      rel="noopener noreferrer"
      underline="hover"
      c={isMe ? "white" : "violet.3"}
      mt={message.text?.trim() ? 8 : 0}
      style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
    >
      <IconFile size={16} />
      <Text size="sm" component="span" style={{ wordBreak: "break-all" }}>
        {fileName}
      </Text>
    </Anchor>
  );
}

interface MessageThreadPanelProps {
  messages: ReceiveMessagePayload[];
  typingUserIds: string[];
  currentUserId: string | null;
  isLoading?: boolean;
}

function fmtTime(createdAtUtc: string): string {
  const date = new Date(createdAtUtc);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function fmtDateLabel(createdAtUtc: string): string {
  const date = new Date(createdAtUtc);
  if (Number.isNaN(date.getTime())) return "";
  const now = new Date();
  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();
  if (isToday) return "Today";
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate();
  if (isYesterday) return "Yesterday";
  return date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Skeleton placeholders while message history is loading. */
function MessageThreadSkeleton(): JSX.Element {
  const widths = ["55%", "42%", "68%", "38%", "52%", "45%", "60%", "35%"];

  return (
    <Stack gap="md" py="md" style={{ minHeight: "100%", justifyContent: "flex-end" }}>
      {widths.map((width, i) => {
        const isRight = i % 2 === 1;
        return (
          <Group
            key={i}
            justify={isRight ? "flex-end" : "flex-start"}
            align="flex-end"
            gap="xs"
            wrap="nowrap"
          >
            {!isRight && <Skeleton circle height={28} width={28} />}
            <Skeleton height={44} width={width} radius="lg" animate />
            {isRight && <Skeleton circle height={28} width={28} />}
          </Group>
        );
      })}
    </Stack>
  );
}

/** Animated three-dot typing indicator. */
function TypingBubble({ names }: { names: string[] }): JSX.Element {
  const label =
    names.length === 1
      ? `${names[0]} is typing`
      : `${names.length} people are typing`;

  return (
    <Group gap="xs" align="flex-end">
      <Box w={28} />
      <Box>
        <Text size="xs" c="dimmed" mb={4} ml={2}>
          {label}
        </Text>
        <Paper
          p="xs"
          radius="xl"
          className="chat-bubble--incoming"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            paddingLeft: 14,
            paddingRight: 14,
          }}
        >
          <span className="typing-dot typing-dot--1" />
          <span className="typing-dot typing-dot--2" />
          <span className="typing-dot typing-dot--3" />
        </Paper>
      </Box>
    </Group>
  );
}

/**
 * Renders messages for the active conversation plus an animated typing indicator.
 * Groups consecutive messages from the same sender and shows date separators.
 */
export function MessageThreadPanel({
  messages,
  typingUserIds,
  currentUserId,
  isLoading = false,
}: MessageThreadPanelProps): JSX.Element {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    });
    return () => cancelAnimationFrame(frame);
  }, [messages, typingUserIds, isLoading]);

  return (
    <>
      <style>{`
        @keyframes typing-bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-5px); opacity: 1; }
        }
        .typing-dot {
          display: inline-block;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background-color: var(--mantine-color-gray-5);
          animation: typing-bounce 1.3s ease-in-out infinite;
        }
        .typing-dot--1 { animation-delay: 0s; }
        .typing-dot--2 { animation-delay: 0.22s; }
        .typing-dot--3 { animation-delay: 0.44s; }
        @keyframes msg-slide-up {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .msg-row {
          animation: msg-slide-up 0.22s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
      `}</style>

      <Stack
        gap="sm"
        className="chat-thread-bg"
        style={{ minHeight: "100%", justifyContent: "flex-end" }}
      >
        {isLoading ? (
          <MessageThreadSkeleton />
        ) : messages.length === 0 ? (
          <Stack
            align="center"
            gap="sm"
            style={{ flex: 1, justifyContent: "center" }}
            py="xl"
          >
            <IconMessageCircle
              size={40}
              stroke={1.2}
              color="var(--chat-text-muted)"
            />
            <Text size="sm" c="dimmed" ta="center">
              No messages yet — say hi!
            </Text>
          </Stack>
        ) : (
          (() => {
            let lastDate = "";
            return messages.map((message, index) => {
              const isMe =
                currentUserId?.trim() === message.senderId?.trim();
              const displayName =
                message.senderDisplayName?.trim() || message.senderId;
              const prevMsg = index > 0 ? messages[index - 1] : null;
              const isSameAuthor = prevMsg?.senderId === message.senderId;
              const showAvatar = !isMe && !isSameAuthor;

              const dateLabel = fmtDateLabel(message.createdAtUtc);
              const showDateSep = dateLabel !== lastDate;
              if (showDateSep) lastDate = dateLabel;

              return (
                <Box key={message.messageId}>
                  {showDateSep && (
                    <Group gap="xs" justify="center" my="xs">
                      <Box
                        style={{
                          flex: 1,
                          height: 1,
                          backgroundColor: "var(--chat-date-line)",
                        }}
                      />
                      <Text
                        size="xs"
                        c="dimmed"
                        px={8}
                        style={{ whiteSpace: "nowrap" }}
                      >
                        {dateLabel}
                      </Text>
                      <Box
                        style={{
                          flex: 1,
                          height: 1,
                          backgroundColor: "var(--chat-date-line)",
                        }}
                      />
                    </Group>
                  )}

                  <Group
                    className="msg-row"
                    justify={isMe ? "flex-end" : "flex-start"}
                    align="flex-end"
                    wrap="nowrap"
                    gap="xs"
                    mt={isSameAuthor && !showDateSep ? 2 : 6}
                  >
                    {!isMe && (
                      <Box w={28} style={{ flexShrink: 0 }}>
                        {showAvatar && (
                          <Avatar
                            radius="xl"
                            size="sm"
                            color="violet"
                            variant="filled"
                            style={{ fontSize: 10 }}
                          >
                            {displayName.substring(0, 2).toUpperCase()}
                          </Avatar>
                        )}
                      </Box>
                    )}

                    <Box style={{ maxWidth: "72%" }}>
                      {!isMe && showAvatar && (
                        <Text size="xs" c="dimmed" mb={3} ml={4} fw={500}>
                          {displayName}
                        </Text>
                      )}

                      <Paper
                        p="sm"
                        radius="lg"
                        className={
                          isMe
                            ? "chat-bubble--sent"
                            : "chat-bubble--incoming"
                        }
                        style={{
                          borderBottomRightRadius: isMe ? 4 : undefined,
                          borderBottomLeftRadius: !isMe ? 4 : undefined,
                        }}
                      >
                        {shouldShowCaption(message) && (
                          <Text
                            size="sm"
                            style={{ wordBreak: "break-word", lineHeight: 1.5 }}
                          >
                            {message.text}
                          </Text>
                        )}
                        <MessageAttachmentContent
                          message={message}
                          isMe={isMe}
                        />
                        <Group gap={4} justify="flex-end" mt={4} wrap="nowrap">
                          <Text
                            size="xs"
                            c={
                              isMe
                                ? "rgba(255,255,255,0.65)"
                                : "dimmed"
                            }
                            style={{ fontSize: "10px" }}
                          >
                            {fmtTime(message.createdAtUtc)}
                          </Text>
                          {isMe &&
                            (message.isRead ? (
                              <IconChecks
                                size={12}
                                color="rgba(255,255,255,0.75)"
                              />
                            ) : (
                              <IconCheck
                                size={12}
                                color="rgba(255,255,255,0.5)"
                              />
                            ))}
                        </Group>
                      </Paper>
                    </Box>
                  </Group>
                </Box>
              );
            });
          })()
        )}

        {!isLoading && typingUserIds.length > 0 && (
          <TypingBubble names={typingUserIds} />
        )}

        <div ref={bottomRef} />
      </Stack>
    </>
  );
}
