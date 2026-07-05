"use client";

import { Flex, Group, SegmentedControl, Text } from "@mantine/core";
import {
  IconBrandWechat,
  IconMessageCircle,
  IconUsers,
} from "@tabler/icons-react";
import { JSX } from "react";
import { useTranslations } from "next-intl";

export type ChatSidebarView = "messages" | "contacts";

interface ChatTopBarProps {
  sidebarView: ChatSidebarView;
  onSidebarViewChange: (view: ChatSidebarView) => void;
}

/**
 * Secondary chat toolbar: messages and contacts tabs.
 */
export function ChatTopBar({
  sidebarView,
  onSidebarViewChange,
}: ChatTopBarProps): JSX.Element {
  const t = useTranslations("chatPage");

  return (
    <Flex gap={0} align="center" className="chat-top-bar">
      <Group px="md" pt="sm" pb={4} gap="xs">
        <IconBrandWechat size={22} style={{ color: "var(--chat-accent)" }} />
        <Text fw={800} size="lg" style={{ color: "var(--chat-accent)" }}>
          {t("svcChat")}
        </Text>
      </Group>
      <Group px="md" pt="sm" pb={4} gap={4}>
        <SegmentedControl
          value={sidebarView}
          onChange={(v) => {
            if (v === "messages" || v === "contacts") {
              onSidebarViewChange(v);
            }
          }}
          data={[
            {
              value: "messages",
              label: (
                <Group gap={6} wrap="nowrap">
                  <IconMessageCircle size={14} />
                  <span>{t("tabChats")}</span>
                </Group>
              ),
            },
            {
              value: "contacts",
              label: (
                <Group gap={6} wrap="nowrap">
                  <IconUsers size={14} />
                  <span>{t("tabContacts")}</span>
                </Group>
              ),
            },
          ]}
          size="xs"
          radius="md"
          color="violet"
        />
      </Group>
    </Flex>
  );
}
