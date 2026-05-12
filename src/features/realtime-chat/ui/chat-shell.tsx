"use client";

import { Box, Button, Center, Group, Paper, Stack, Tabs, Text, ActionIcon, ScrollArea, Tooltip } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { IconMessageCircle, IconUsers, IconTrash, IconBug, IconX } from "@tabler/icons-react";
import { useRealtimeChat } from "../hooks/use-realtime-chat";
import { useRealtimeChatStore } from "../store/realtime-chat-store";
import { ComposerPanel } from "./composer-panel";
import { ConnectionStatusCard } from "./connection-status-card";
import { ConversationListPanel } from "./conversation-list-panel";
import { MessageThreadPanel } from "./message-thread-panel";
import { OnlineUsersPanel } from "./online-users-panel";

async function runAction(
  label: string,
  action: () => Promise<void>,
): Promise<void> {
  try {
    await action();
  } catch (error) {
    notifications.show({
      color: "red",
      title: `${label} failed`,
      message: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Main realtime chat client shell for dashboard route.
 */
export function ChatShell() {
  const chatApi = useRealtimeChat();
  const { data: session } = useSession();

  const chatStatus = useRealtimeChatStore((state) => state.chatStatus);
  const onlineUsersStatus = useRealtimeChatStore((state) => state.onlineUsersStatus);
  const chatError = useRealtimeChatStore((state) => state.chatError);
  const onlineUsersError = useRealtimeChatStore((state) => state.onlineUsersError);
  const openConversationIds = useRealtimeChatStore((state) => state.openConversationIds);
  const activeConversationId = useRealtimeChatStore((state) => state.activeConversationId);
  const logs = useRealtimeChatStore((state) => state.logs);
  const onlineUsersById = useRealtimeChatStore((state) => state.onlineUsersById);
  const messagesByConversation = useRealtimeChatStore((state) => state.messagesByConversation);
  const typingByConversation = useRealtimeChatStore((state) => state.typingByConversation);
  const setActiveConversation = useRealtimeChatStore((state) => state.setActiveConversation);

  const [showLogs, setShowLogs] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>("conversations");

  const users = useMemo(
    () =>
      Object.values(onlineUsersById).sort((a, b) => a.userId.localeCompare(b.userId)),
    [onlineUsersById],
  );

  const messages = useMemo(() => {
    if (!activeConversationId) return [];
    return messagesByConversation[activeConversationId] ?? [];
  }, [activeConversationId, messagesByConversation]);

  const typingUserIds = useMemo(() => {
    if (!activeConversationId) return [];
    const typingMap = typingByConversation[activeConversationId] ?? {};
    return Object.keys(typingMap).filter((userId) => typingMap[userId]);
  }, [activeConversationId, typingByConversation]);

  const connected =
    chatStatus === "Connected" && onlineUsersStatus === "Connected";

  const currentUserId = session?.user.id ?? null;

  const logLines = useMemo(
    () =>
      logs
        .slice(-25)
        .map(
          (entry) =>
            `[${new Date(entry.at).toLocaleTimeString()}] [${entry.hub}] ${entry.event}`,
        ),
    [logs],
  );

  return (
    <Paper withBorder radius="md" style={{ height: "calc(100vh - 120px)", display: "flex", overflow: "hidden" }}>
      {/* Sidebar */}
      <Box w={{ base: "100%", md: 320 }} style={{ borderRight: "1px solid var(--mantine-color-default-border)", display: "flex", flexDirection: "column", backgroundColor: "var(--mantine-color-body)" }}>
        <Box p="md" style={{ borderBottom: "1px solid var(--mantine-color-default-border)" }}>
          <ConnectionStatusCard
            chatStatus={chatStatus}
            onlineUsersStatus={onlineUsersStatus}
            chatError={chatError}
            onlineUsersError={onlineUsersError}
            onConnect={() => void runAction("Connect", chatApi.connect)}
            onDisconnect={() => void runAction("Disconnect", chatApi.disconnect)}
          />
        </Box>

        <Tabs value={activeTab} onChange={setActiveTab} variant="outline" style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
          <Tabs.List grow>
            <Tabs.Tab value="conversations" leftSection={<IconMessageCircle size={16} />}>
              Chats
            </Tabs.Tab>
            <Tabs.Tab value="online" leftSection={<IconUsers size={16} />}>
              Online ({users.length})
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="conversations" style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <Box style={{ flex: 1, overflowY: "auto" }} p="md">
              <ConversationListPanel
                openConversationIds={openConversationIds}
                activeConversationId={activeConversationId}
                onSetActive={(conversationId) => setActiveConversation(conversationId)}
                onJoin={(conversationId) =>
                  void runAction("Join conversation", async () => {
                    await chatApi.joinConversation(conversationId);
                  })
                }
                onLeave={(conversationId) =>
                  void runAction("Leave conversation", async () => {
                    await chatApi.leaveConversation(conversationId);
                  })
                }
              />
            </Box>
          </Tabs.Panel>

          <Tabs.Panel value="online" style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <Box style={{ flex: 1, overflowY: "auto" }} p="md">
              <OnlineUsersPanel users={users} currentUserId={currentUserId} />
            </Box>
          </Tabs.Panel>
        </Tabs>

        <Box p="xs" style={{ borderTop: "1px solid var(--mantine-color-default-border)" }}>
          <Group justify="center">
            <Button size="xs" variant="subtle" color="gray" leftSection={<IconBug size={14} />} onClick={() => setShowLogs(!showLogs)}>
              {showLogs ? "Hide Logs" : "Show Logs"}
            </Button>
          </Group>
        </Box>
      </Box>

      {/* Main Chat Area */}
      <Box style={{ flex: 1, display: "flex", flexDirection: "column", backgroundColor: "var(--mantine-color-gray-0)", position: "relative" }}>
        {activeConversationId ? (
          <>
            <Box p="md" style={{ borderBottom: "1px solid var(--mantine-color-default-border)", backgroundColor: "var(--mantine-color-body)", zIndex: 10 }}>
              <Group justify="space-between">
                <Group>
                  <IconMessageCircle size={24} color="var(--mantine-color-blue-6)" />
                  <Text fw={600} size="lg">{activeConversationId}</Text>
                </Group>
                <Tooltip label="Leave Chat">
                  <ActionIcon variant="light" color="red" onClick={() => void runAction("Leave conversation", async () => {
                    await chatApi.leaveConversation(activeConversationId);
                  })}>
                    <IconX size={18} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            </Box>

            <Box style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
              <MessageThreadPanel
                messages={messages}
                typingUserIds={typingUserIds}
                currentUserId={currentUserId}
              />
            </Box>

            <Box p="md" style={{ backgroundColor: "var(--mantine-color-body)", borderTop: "1px solid var(--mantine-color-default-border)" }}>
              <ComposerPanel
                conversationId={activeConversationId}
                disabled={!connected}
                onSend={(text) =>
                  void runAction("Send message", async () => {
                    if (!activeConversationId) return;
                    await chatApi.sendMessage(activeConversationId, text);
                  })
                }
                onTyping={() => {
                  if (!activeConversationId) return;
                  void chatApi.typing(activeConversationId);
                }}
                onStopTyping={() => {
                  if (!activeConversationId) return;
                  void chatApi.stopTyping(activeConversationId);
                }}
              />
            </Box>
          </>
        ) : (
          <Center style={{ flex: 1, flexDirection: "column", gap: "16px" }}>
            <IconMessageCircle size={64} color="var(--mantine-color-gray-4)" stroke={1.5} />
            <Text c="dimmed" size="lg" fw={500}>Select or join a conversation to start chatting</Text>
          </Center>
        )}
      </Box>

      {/* Logs Overlay Panel */}
      {showLogs && (
        <Paper withBorder p="md" radius="md" shadow="xl" style={{ position: "absolute", bottom: "80px", right: "20px", width: "400px", maxHeight: "300px", display: "flex", flexDirection: "column", zIndex: 100 }}>
          <Group justify="space-between" mb="xs">
            <Text fw={700} size="sm">Realtime Logs</Text>
            <Group gap="xs">
              <ActionIcon size="sm" variant="subtle" onClick={() => useRealtimeChatStore.getState().clearLogs()}>
                <IconTrash size={14} />
              </ActionIcon>
              <ActionIcon size="sm" variant="subtle" onClick={() => setShowLogs(false)}>
                <IconX size={14} />
              </ActionIcon>
            </Group>
          </Group>
          <ScrollArea style={{ flex: 1 }}>
            <Stack gap={4}>
              {logLines.length === 0 ? (
                <Text size="xs" c="dimmed">No events yet.</Text>
              ) : (
                logLines.map((line, i) => (
                  <Text size="xs" ff="monospace" key={i}>{line}</Text>
                ))
              )}
            </Stack>
          </ScrollArea>
        </Paper>
      )}
    </Paper>
  );
}
