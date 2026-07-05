"use client";

import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Divider,
  Group,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import {
  IconDots,
  IconMessage,
  IconPhone,
  IconVideo,
  IconX,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import type { Conversation } from "../signalr/types";
import { JSX, useMemo } from "react";

interface ChatProfilePanelProps {
  conversation: Conversation | undefined;
  conversationTitle: string;
  currentUserId: string | null;
  onClose?: () => void;
}

function getPeerFromConversation(
  conversation: Conversation | undefined,
  currentUserId: string | null,
) {
  if (!conversation?.participants?.length) return null;
  const peer = conversation.participants.find((p) => p.userId !== currentUserId);
  return peer ?? conversation.participants[0] ?? null;
}

/**
 * Right sidebar profile panel with localized contact details.
 */
export function ChatProfilePanel({
  conversation,
  conversationTitle,
  currentUserId,
  onClose,
}: ChatProfilePanelProps): JSX.Element {
  const t = useTranslations("chatPage");
  const peer = useMemo(
    () => getPeerFromConversation(conversation, currentUserId),
    [conversation, currentUserId],
  );

  const displayName =
    peer?.fullName?.trim() || conversationTitle || t("contactFallback");
  const username = peer?.email?.split("@")[0] ?? peer?.userId?.slice(0, 8);
  const role = peer?.role?.trim();

  if (!conversation) {
    return (
      <Stack className="chat-profile" p="xl" align="center" justify="center" h="100%">
        <Text size="sm" c="dimmed" ta="center">
          {t("selectConversationToViewProfile")}
        </Text>
      </Stack>
    );
  }

  return (
    <Stack
      className="chat-profile"
      gap="md"
      p="md"
      h="100%"
      style={{
        borderLeft: "1px solid var(--chat-border)",
        overflowY: "auto",
      }}
    >
      <Group justify="space-between">
        <Text fw={700} size="sm">
          {t("profile")}
        </Text>
        {onClose ? (
          <ActionIcon variant="subtle" color="gray" size="sm" onClick={onClose}>
            <IconX size={16} />
          </ActionIcon>
        ) : null}
      </Group>

      <Stack align="center" gap="xs" py="sm">
        <Avatar size={88} radius="xl" color="violet">
          {displayName.substring(0, 2).toUpperCase()}
        </Avatar>
        <Text fw={700} size="lg" ta="center">
          {displayName}
        </Text>
        {username ? (
          <Text size="sm" c="dimmed">
            @{username}
          </Text>
        ) : null}
        {role ? (
          <Text size="xs" c="var(--chat-accent)" fw={600}>
            {role}
          </Text>
        ) : null}
      </Stack>

      <Group justify="center" gap="md">
        <ActionIcon variant="light" color="violet" size="xl" radius="xl" aria-label={t("message")}>
          <IconMessage size={20} />
        </ActionIcon>
        <ActionIcon variant="light" color="violet" size="xl" radius="xl" aria-label={t("video")}>
          <IconVideo size={20} />
        </ActionIcon>
        <ActionIcon variant="light" color="violet" size="xl" radius="xl" aria-label={t("phone")}>
          <IconPhone size={20} />
        </ActionIcon>
        <ActionIcon variant="light" color="gray" size="xl" radius="xl" aria-label={t("more")}>
          <IconDots size={20} />
        </ActionIcon>
      </Group>

      <Divider color="var(--chat-border)" />

      <Stack gap="sm">
        <ProfileRow label={t("displayName")} value={displayName} />
        <ProfileRow label={t("email")} value={peer?.email ?? t("emptyValue")} />
        <ProfileRow label={t("phone")} value={peer?.phoneNumber ?? t("emptyValue")} />
        <ProfileRow label={t("role")} value={role ?? t("emptyValue")} />
        <ProfileRow
          label={t("chatType")}
          value={conversation.type === "Group" ? t("group") : t("directMessage")}
        />
      </Stack>

      <Divider color="var(--chat-border)" />

      <Group justify="space-between">
        <Text fw={600} size="sm">
          {t("files")}
        </Text>
        <Button variant="subtle" color="violet" size="compact-xs">
          {t("viewAll")}
        </Button>
      </Group>

      <SimpleGrid cols={3} spacing="xs">
        {Array.from({ length: 6 }).map((_, i) => (
          <Box
            key={i}
            style={{
              aspectRatio: "1",
              borderRadius: 8,
              background: "var(--chat-item-hover)",
              border: "1px solid var(--chat-border)",
            }}
          />
        ))}
      </SimpleGrid>
    </Stack>
  );
}

function ProfileRow({
  label,
  value,
}: {
  label: string;
  value: string;
}): JSX.Element {
  return (
    <Box>
      <Text size="xs" c="dimmed" mb={2}>
        {label}
      </Text>
      <Text size="sm" fw={500} style={{ wordBreak: "break-word" }}>
        {value}
      </Text>
    </Box>
  );
}
