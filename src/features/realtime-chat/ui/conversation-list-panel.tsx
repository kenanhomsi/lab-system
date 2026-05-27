"use client";

import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Group,
  Skeleton,
  Stack,
  Text,
  TextInput,
  UnstyledButton,
} from "@mantine/core";
import {
  IconChevronDown,
  IconChevronUp,
  IconMessagePlus,
  IconPlus,
  IconSearch,
} from "@tabler/icons-react";
import { JSX, useMemo, useState } from "react";
import type {
  Conversation,
  OnlineUser,
  ReceiveMessagePayload,
} from "../signalr/types";
import { getConversationTitle } from "../utils/chat-helpers";

interface ConversationListPanelProps {
  conversations: Conversation[];
  conversationsLoading: boolean;
  activeConversationId: string | null;
  currentUserId: string | null;
  hubsConnected: boolean;
  messagesByConversation: Record<string, ReceiveMessagePayload[]>;
  onlineUsersById: Record<string, OnlineUser>;
  nameLookup: Map<string, { displayName: string; role?: string }>;
  onOpen: (conversation: Conversation) => void;
  onJoinById: (conversationId: string) => void;
  onNewChat: () => void;
}

function formatLastMessagePreview(text?: string | null): string {
  const trimmed = text?.trim();
  if (!trimmed) return "No messages yet";
  return trimmed.length > 48 ? `${trimmed.slice(0, 48)}…` : trimmed;
}

function formatConversationTime(createdAtUtc?: string | null): string {
  if (!createdAtUtc) return "";
  const date = new Date(createdAtUtc);
  if (Number.isNaN(date.getTime())) return "";
  const now = new Date();
  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();
  if (isToday) {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

function getPeerUserId(
  conversation: Conversation,
  currentUserId: string,
): string | null {
  const peer = conversation.participants?.find(
    (p) => p.userId !== currentUserId,
  );
  if (peer?.userId) return peer.userId;
  const senderId = conversation.lastMessage?.senderUserId;
  if (senderId && senderId !== currentUserId) return senderId;
  return null;
}

function isPeerOnline(
  conversation: Conversation,
  currentUserId: string,
  onlineUsersById: Record<string, OnlineUser>,
): boolean {
  const peerId = getPeerUserId(conversation, currentUserId);
  if (!peerId) return false;
  const user = onlineUsersById[peerId];
  if (user) return user.isOnline !== false;
  const participant = conversation.participants?.find(
    (p) => p.userId === peerId,
  );
  return participant?.isOnline !== false;
}

function ConversationListSkeleton(): JSX.Element {
  return (
    <Stack gap={4}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Group key={i} gap="sm" p="xs" wrap="nowrap">
          <Skeleton circle height={40} animate />
          <div style={{ flex: 1, minWidth: 0 }}>
            <Skeleton height={12} mb={6} width="60%" animate />
            <Skeleton height={10} width="85%" animate />
          </div>
          <Skeleton height={10} width={36} animate />
        </Group>
      ))}
    </Stack>
  );
}

function ConversationRow({
  conversation,
  isActive,
  title,
  unread,
  timeLabel,
  peerOnline,
  onOpen,
}: {
  conversation: Conversation;
  isActive: boolean;
  title: string;
  unread: number;
  timeLabel: string;
  peerOnline: boolean;
  onOpen: () => void;
}): JSX.Element {
  return (
    <UnstyledButton
      onClick={onOpen}
      className={`chat-list-item${isActive ? " chat-list-item--active" : ""}`}
      style={{
        display: "block",
        width: "100%",
        padding: "10px 12px",
        borderRadius: 10,
        transition: "background-color 150ms ease",
      }}
    >
      <Group justify="space-between" wrap="nowrap" align="flex-start">
        <Group wrap="nowrap" gap="sm" style={{ flex: 1, overflow: "hidden" }}>
          <div style={{ position: "relative", flexShrink: 0 }}>
            <Avatar color={isActive ? "violet" : "gray"} radius="xl" size="md">
              {title.substring(0, 2).toUpperCase()}
            </Avatar>
            <div
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: peerOnline
                  ? "var(--mantine-color-green-6)"
                  : "var(--mantine-color-red-6)",
                border: "2px solid var(--chat-avatar-border)",
              }}
            />
          </div>
          <div style={{ overflow: "hidden", flex: 1 }}>
            <Group gap="xs" wrap="nowrap" justify="space-between">
              <Text
                size="sm"
                fw={isActive ? 600 : 500}
                truncate
                style={{ flex: 1 }}
                c={isActive ? "violet" : undefined}
              >
                {title}
              </Text>
              {timeLabel ? (
                <Text
                  size="xs"
                  c="dimmed"
                  style={{ flexShrink: 0, whiteSpace: "nowrap" }}
                >
                  {timeLabel}
                </Text>
              ) : null}
            </Group>
            <Group gap="xs" wrap="nowrap" mt={2}>
              <Text size="xs" c="dimmed" truncate style={{ flex: 1 }}>
                {formatLastMessagePreview(conversation.lastMessage?.text)}
              </Text>
              {unread > 0 ? (
                <Badge size="xs" circle color="violet">
                  {unread > 99 ? "99+" : unread}
                </Badge>
              ) : null}
            </Group>
          </div>
        </Group>
      </Group>
    </UnstyledButton>
  );
}

/**
 * Conversation list with search and Onlines / Offlines grouping (ChatTiko-style).
 */
export function ConversationListPanel({
  conversations,
  conversationsLoading,
  activeConversationId,
  currentUserId,
  hubsConnected,
  messagesByConversation,
  onlineUsersById,
  nameLookup,
  onOpen,
  onJoinById,
  onNewChat,
}: ConversationListPanelProps): JSX.Element {
  const [joinConversationId, setJoinConversationId] = useState("");
  const [showJoinById, setShowJoinById] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const uid = currentUserId ?? "";

  const { onlineConversations, offlineConversations } = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const filtered = conversations.filter((conversation) => {
      if (!q) return true;
      const title = getConversationTitle(conversation, uid, {
        messages: messagesByConversation[conversation.id],
        onlineUsersById,
        nameLookup,
      }).toLowerCase();
      const preview =
        conversation.lastMessage?.text?.trim().toLowerCase() ?? "";
      return title.includes(q) || preview.includes(q);
    });

    const online: Conversation[] = [];
    const offline: Conversation[] = [];

    for (const conversation of filtered) {
      if (isPeerOnline(conversation, uid, onlineUsersById)) {
        online.push(conversation);
      } else {
        offline.push(conversation);
      }
    }

    return { onlineConversations: online, offlineConversations: offline };
  }, [
    conversations,
    searchQuery,
    uid,
    messagesByConversation,
    onlineUsersById,
    nameLookup,
  ]);

  const renderSection = (
    label: string,
    items: Conversation[],
  ): JSX.Element | null => {
    if (items.length === 0) return null;

    return (
      <Stack gap={4}>
        <Text className="chat-section-label" px={4} pt="xs">
          {label}
        </Text>
        {items.map((conversation) => {
          const isActive = conversation.id === activeConversationId;
          const title = getConversationTitle(conversation, uid, {
            messages: messagesByConversation[conversation.id],
            onlineUsersById,
            nameLookup,
          });
          return (
            <ConversationRow
              key={conversation.id}
              conversation={conversation}
              isActive={isActive}
              title={title}
              unread={conversation.unreadCount ?? 0}
              timeLabel={formatConversationTime(
                conversation.lastMessage?.createdAtUtc,
              )}
              peerOnline={isPeerOnline(conversation, uid, onlineUsersById)}
              onOpen={() => onOpen(conversation)}
            />
          );
        })}
      </Stack>
    );
  };

  return (
    <Stack gap="md">
      <TextInput
        className="chat-search-input"
        placeholder="Search…"
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.currentTarget.value)}
        leftSection={<IconSearch size={16} stroke={1.5} />}
        size="sm"
        radius="md"
      />

      <Button
        fullWidth
        leftSection={<IconPlus size={16} />}
        variant="light"
        color="violet"
        disabled={!hubsConnected}
        onClick={onNewChat}
      >
        New chat
      </Button>
      {/* 
      <Group justify="flex-end">
        <ActionIcon
          size="sm"
          variant="subtle"
          color="gray"
          onClick={() => setShowJoinById((v) => !v)}
          aria-label={showJoinById ? "Hide join by ID" : "Join by ID"}
        >
          {showJoinById ? (
            <IconChevronUp size={16} />
          ) : (
            <IconChevronDown size={16} />
          )}
        </ActionIcon>
      </Group>

      {showJoinById ? (
        <Group gap="xs">
          <TextInput
            placeholder="Join conversation ID…"
            value={joinConversationId}
            onChange={(event) =>
              setJoinConversationId(event.currentTarget.value)
            }
            flex={1}
            size="sm"
            className="chat-search-input"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const next = joinConversationId.trim();
                if (next) {
                  onJoinById(next);
                  setJoinConversationId("");
                }
              }
            }}
          />
          <ActionIcon
            size="lg"
            variant="light"
            color="violet"
            onClick={() => {
              const next = joinConversationId.trim();
              if (!next) return;
              onJoinById(next);
              setJoinConversationId("");
            }}
            aria-label="Join conversation"
          >
            <IconMessagePlus size={18} />
          </ActionIcon>
        </Group>
      ) : null} */}

      {conversationsLoading ? (
        <ConversationListSkeleton />
      ) : onlineConversations.length === 0 &&
        offlineConversations.length === 0 ? (
        <Text c="dimmed" size="sm" ta="center" py="xl">
          {searchQuery.trim()
            ? "No conversations match your search."
            : 'No conversations yet. Tap "New chat" to start.'}
        </Text>
      ) : (
        <Stack gap="xs">
          {renderSection("Onlines", onlineConversations)}
          {renderSection("Offlines", offlineConversations)}
        </Stack>
      )}
    </Stack>
  );
}
