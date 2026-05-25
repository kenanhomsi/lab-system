"use client";

import { Group, SegmentedControl, Stack, Text } from "@mantine/core";
import {
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import {
  IconBrandWechat,
  IconMessageCircle,
  IconUsers,
} from "@tabler/icons-react";
import { JSX, useEffect, useState } from "react";

export type ChatSidebarView = "messages" | "contacts";

interface ChatTopBarProps {
  sidebarView: ChatSidebarView;
  onSidebarViewChange: (view: ChatSidebarView) => void;
}

/**
 * Secondary chat toolbar: view tabs, local time, and light/dark theme toggle.
 */
export function ChatTopBar({
  sidebarView,
  onSidebarViewChange,
}: ChatTopBarProps): JSX.Element {
  const { setColorScheme } = useMantineColorScheme();
  const computed = useComputedColorScheme("light");
  const [localTime, setLocalTime] = useState("");

  useEffect(() => {
    const tick = () => {
      setLocalTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    };
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <Stack gap={0} className="chat-top-bar">
      <Group px="md" pt="sm" pb={4} gap="xs">
        <IconBrandWechat size={22} style={{ color: "var(--chat-accent)" }} />
        <Text fw={800} size="lg" style={{ color: "var(--chat-accent)" }}>
          Chat
        </Text>
      </Group>
      <Group
        px="md"
        pb="sm"
        justify="space-between"
        wrap="wrap"
        gap="sm"
      >
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

      <Group gap="md" wrap="wrap">
        {localTime ? (
          <Text size="xs" c="dimmed">
            Local time:{" "}
            <Text span fw={600} c="var(--chat-text)">
              {localTime}
            </Text>
          </Text>
        ) : null}

        <SegmentedControl
          size="xs"
          radius="md"
          value={computed}
          onChange={(value) => {
            if (value === "light" || value === "dark") {
              setColorScheme(value);
            }
          }}
          data={[
            { label: "Light", value: "light" },
            { label: "Dark", value: "dark" },
          ]}
        />
      </Group>
      </Group>
    </Stack>
  );
}
