"use client";

/**
 * Dashboard realtime chat workspace: connection status, conversation list / presence tabs,
 * join-by-ID field, placeholder transcript area until SignalR messaging is wired.
 */
import { useState } from "react";
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Collapse,
  Code,
  Divider,
  Flex,
  Group,
  Paper,
  ScrollArea,
  Tabs,
  Text,
  TextInput,
  ThemeIcon,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import {
  IconActivity,
  IconArrowRight,
  IconInbox,
  IconMessageCircle,
  IconMessages,
  IconPlus,
  IconSettings,
  IconSlash,
  IconUserPlus,
  IconUsers,
  IconWifi,
  IconWifiOff,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";

type ChatSidebarTab = "chats" | "online";

export function ChatPageShell() {
  const t = useTranslations("chatPage");
  const compact = useMediaQuery("(max-width: 992px)");
  const [connected, setConnected] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<ChatSidebarTab>("chats");
  const [conversationId, setConversationId] = useState("");
  const [logsOpened, { toggle: toggleLogs }] = useDisclosure(false);

  const onlineCount = 0;

  const sidebar = (
    <Paper
      p="lg"
      shadow="xs"
      style={{
        alignSelf: "stretch",
        flexShrink: 0,
      }}
      w={{ base: "100%", lg: compact ? "100%" : 380 }}
      maw={{ base: "100%", lg: 400 }}
      withBorder
    >
      <Flex direction="column" gap="md" mah="100%">
        <Group justify="space-between" align="flex-start" wrap="nowrap" gap="sm">
          <Button
            size="sm"
            leftSection={
              connected ? <IconWifi size={16} /> : <IconWifiOff size={16} />
            }
            variant={connected ? "outline" : "filled"}
            color="electric"
            onClick={() => setConnected((c) => !c)}
          >
            {connected ? t("disconnect") : t("connect")}
          </Button>

          <Box ta="end" miw={0}>
            <Text size="xs" tt="uppercase" fw={800} c="dimmed">
              {t("systemStatus")}
            </Text>
            <Flex justify="flex-end" align="center" gap={8} mt={4}>
              {connected ? (
                <ThemeIcon variant="light" color="green" size="md" radius="md">
                  <IconActivity size={18} />
                </ThemeIcon>
              ) : (
                <ThemeIcon variant="light" color="red" size="md" radius="md">
                  <IconSlash size={18} />
                </ThemeIcon>
              )}
            </Flex>
          </Box>
        </Group>

        <Group gap="xs" wrap="wrap">
          <Badge
            variant="dot"
            color={connected ? "green" : "red"}
            size="lg"
            radius="md"
            tt="uppercase"
            fz={11}
          >
            {`${t("svcChat")}: ${connected ? t("connectedShort") : t("disconnectedShort")}`}
          </Badge>
          <Badge
            variant="dot"
            color={connected ? "green" : "red"}
            size="lg"
            radius="md"
            tt="uppercase"
            fz={11}
          >
            {`${t("svcUsers")}: ${connected ? t("connectedShort") : t("disconnectedShort")}`}
          </Badge>
        </Group>

        <Divider />

        <Tabs
          color="electric"
          value={sidebarTab}
          onChange={(value) => {
            if (value === "chats" || value === "online") {
              setSidebarTab(value);
            }
          }}
        >
          <Tabs.List grow>
            <Tabs.Tab value="online" leftSection={<IconUsers size={16} />}>
              {t("tabOnline", { count: onlineCount })}
            </Tabs.Tab>
            <Tabs.Tab value="chats" leftSection={<IconMessageCircle size={16} />}>
              {t("tabChats")}
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="chats" pt="md">
            <Flex direction="column" gap="xs">
              <Group wrap="nowrap" gap="xs" align="flex-end">
                <ThemeIcon variant="light" color="electric" size="xl" radius="md">
                  <IconPlus size={22} stroke={2} />
                </ThemeIcon>
                <TextInput
                  aria-label={t("joinAria")}
                  placeholder={t("joinPlaceholder")}
                  value={conversationId}
                  onChange={(e) => setConversationId(e.currentTarget.value)}
                  flex={1}
                  styles={{ input: { fontWeight: 600 } }}
                />
                <Button
                  color="electric"
                  variant="filled"
                  px="md"
                  disabled={!conversationId.trim()}
                  onClick={() => { }}
                  aria-label={t("joinCta")}
                >
                  <IconArrowRight size={22} aria-hidden />
                </Button>
              </Group>
              <Text size="sm" c="dimmed">
                {t("joinHint")}
              </Text>

              <Paper
                withBorder
                p="xl"
                radius="lg"
                bg="var(--mantine-color-body)"
                bd="2px dashed var(--mantine-color-default-border)"
                mt="xs"
              >
                <Flex direction="column" align="center" gap="xs">
                  <ThemeIcon variant="outline" color="gray" size="xl" radius="xl">
                    <IconInbox size={28} stroke={1.5} />
                  </ThemeIcon>
                  <Text ta="center" fw={700} fz="lg">
                    {t("emptyConversations")}
                  </Text>
                  <Text ta="center" size="sm" c="dimmed" maw={280}>
                    {t("emptyConversationsHint")}
                  </Text>
                </Flex>
              </Paper>
            </Flex>
          </Tabs.Panel>

          <Tabs.Panel value="online" pt="md">
            <Paper
              withBorder
              p="xl"
              radius="lg"
              bg="var(--mantine-color-body)"
              bd="2px dashed var(--mantine-color-default-border)"
            >
              <Flex direction="column" align="center" gap="xs">
                <ThemeIcon variant="outline" color="gray" size="xl" radius="xl">
                  <IconUserPlus size={28} stroke={1.5} />
                </ThemeIcon>
                <Text ta="center" fw={700} fz="lg">
                  {t("emptyOnline")}
                </Text>
                <Text ta="center" size="sm" c="dimmed" maw={280}>
                  {t("onlineHint")}
                </Text>
              </Flex>
            </Paper>
          </Tabs.Panel>
        </Tabs>

        <Divider />

        <Group justify="space-between" gap="xs" wrap="nowrap" mt="auto">
          <UnstyledButton
            type="button"
            fz="sm"
            c="electric.6"
            fw={600}
            onClick={toggleLogs}
          >
            {logsOpened ? t("hideLogs") : t("showLogs")}
          </UnstyledButton>
          <ActionIcon variant="light" color="gray" size="lg" radius="md" aria-label={t("settingsAria")}>
            <IconSettings size={18} />
          </ActionIcon>
        </Group>

        <Collapse expanded={logsOpened}>
          <ScrollArea mah={220} offsetScrollbars>
            <Paper p="sm" radius="md" bg="dark.9" c="gray.3">
              <Code block fz="xs" bg="transparent" c="gray.4">
                {t("logsPlaceholder")}
              </Code>
            </Paper>
          </ScrollArea>
        </Collapse>
      </Flex>
    </Paper>
  );

  const canvas = (
    <Paper
      flex={1}
      mih={{ base: 320, lg: compact ? 400 : "calc(100vh - 8.5rem)" }}
      mah={{ lg: "calc(100vh - 8.5rem)" }}
      pos="relative"
      style={{ overflow: "hidden" }}
      withBorder
      shadow="sm"
    >
      <Box
        pos="absolute"
        inset={0}
        style={{
          background:
            "radial-gradient(1200px 600px at 12% 20%, var(--mantine-color-electric-0) 0%, transparent 55%), radial-gradient(900px 500px at 88% 80%, var(--mantine-color-gray-1) 0%, transparent 50%)",
        }}
      />
      <Flex
        direction="column"
        align="center"
        justify="center"
        pos="relative"
        mih="100%"
        p={{ base: "xl", md: "xl" }}
        gap="lg"
      >
        <ThemeIcon size={80} radius="xl" variant="light" color="electric">
          <IconMessages size={44} stroke={1.5} />
        </ThemeIcon>
        <Text ta="center" fz={28} fw={800} maw={480} lh={1.25} c="gray.9">
          {t("emptyCanvasTitle")}
        </Text>
        <Text ta="center" fz="md" maw={440} c="dimmed" fw={500} lh={1.6}>
          {t("emptyCanvasBody")}
        </Text>
      </Flex>
    </Paper>
  );

  return (
    <Flex direction="column" gap="lg" p={{ base: "xs", sm: "sm" }} style={{ minWidth: 0 }}>
      <Box>
        <Text fw={800} fz={28}>
          {t("pageTitle")}
        </Text>
        <Text c="dimmed" size="sm" mt={6} maw={720}>
          {t("pageSubtitle")}
        </Text>
      </Box>

      <Flex
        direction={{ base: "column-reverse", lg: "row" }}
        gap="lg"
        align="stretch"
        wrap="nowrap"
        style={{ minWidth: 0 }}
      >
        {canvas}
        {sidebar}
      </Flex>
    </Flex>
  );
}
