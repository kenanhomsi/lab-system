"use client";

import { Flex, Group, SegmentedControl, Text } from "@mantine/core";
import {
  IconBrandWechat,
  IconMessageCircle,
  IconUsers,
} from "@tabler/icons-react";
import { JSX } from "react";

export type ChatSidebarView = "messages" | "contacts";

interface ChatTopBarProps {
  sidebarView: ChatSidebarView;
  onSidebarViewChange: (view: ChatSidebarView) => void;
}

/**
 * Secondary chat toolbar: Messages / Contacts view tabs.
 */
export function ChatTopBar({
  sidebarView,
  onSidebarViewChange,
}: ChatTopBarProps): JSX.Element {
  return (
    <Flex gap={0} align='center' className="chat-top-bar">
      <Group px="md" pt="sm" pb={4} gap="xs">
        <IconBrandWechat size={22} style={{ color: "var(--chat-accent)" }} />
        <Text fw={800} size="lg" style={{ color: "var(--chat-accent)" }}>
          Chat
        </Text>
      </Group>
      <Group px="md" pt="sm" pb={4} gap={4} >
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
                  <span>Messages</span>
                </Group>
              ),
            },
            {
              value: "contacts",
              label: (
                <Group gap={6} wrap="nowrap">
                  <IconUsers size={14} />
                  <span>Contacts</span>
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
