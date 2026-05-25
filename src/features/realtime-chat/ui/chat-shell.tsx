"use client";

import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Center,
  Group,
  Paper,
  Progress,
  ScrollArea,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import {
  IconArrowLeft,
  IconBug,
  IconFile,
  IconMessageCircle,
  IconTrash,
  IconUser,
  IconX,
} from "@tabler/icons-react";
import "./chat-theme.css";
import { ChatProfilePanel } from "./chat-profile-panel";
import { ChatTopBar, type ChatSidebarView } from "./chat-top-bar";
import {
  createDirectConversation,
  getMessages,
  getOnlineUsers,
  leaveConversation as leaveConversationRest,
  listConversations,
  markMessageRead,
  uploadAttachment,
} from "../api/chat-rest-api";
import { useRealtimeChat } from "../hooks/use-realtime-chat";
import type { Conversation } from "../signalr/types";
import { useRealtimeChatStore } from "../store/realtime-chat-store";
import {
  buildUserNameLookup,
  getConversationTitle,
  mergeOnlineUsersForDisplay,
  waitForOwnNewMessage,
} from "../utils/chat-helpers";
import { ComposerPanel } from "./composer-panel";
import { ConnectionStatusCard } from "./connection-status-card";
import { ConversationListPanel } from "./conversation-list-panel";
import { MessageThreadPanel } from "./message-thread-panel";
import {
  NewChatUserPickerModal,
  type PickerUser,
} from "./new-chat-user-picker-modal";
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
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  const chatStatus = useRealtimeChatStore((state) => state.chatStatus);
  const onlineUsersStatus = useRealtimeChatStore(
    (state) => state.onlineUsersStatus,
  );
  const chatError = useRealtimeChatStore((state) => state.chatError);
  const onlineUsersError = useRealtimeChatStore(
    (state) => state.onlineUsersError,
  );
  const conversations = useRealtimeChatStore((state) => state.conversations);
  const activeConversationId = useRealtimeChatStore(
    (state) => state.activeConversationId,
  );
  const logs = useRealtimeChatStore((state) => state.logs);
  const onlineUsersById = useRealtimeChatStore(
    (state) => state.onlineUsersById,
  );
  const messagesByConversation = useRealtimeChatStore(
    (state) => state.messagesByConversation,
  );
  const typingByConversation = useRealtimeChatStore(
    (state) => state.typingByConversation,
  );
  const hubsConnected = useRealtimeChatStore((state) => state.hubsConnected);
  const conversationListVersion = useRealtimeChatStore(
    (state) => state.conversationListVersion,
  );
  const setActiveConversation = useRealtimeChatStore(
    (state) => state.setActiveConversation,
  );
  const setConversations = useRealtimeChatStore(
    (state) => state.setConversations,
  );
  const setHistoryMessages = useRealtimeChatStore(
    (state) => state.setHistoryMessages,
  );
  const markMessagePendingAttachment = useRealtimeChatStore(
    (state) => state.markMessagePendingAttachment,
  );
  const updateMessageFileUrl = useRealtimeChatStore(
    (state) => state.updateMessageFileUrl,
  );

  const [showLogs, setShowLogs] = useState(false);
  const [sidebarView, setSidebarView] = useState<ChatSidebarView>("messages");
  const [dmPendingUserId, setDmPendingUserId] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [profileOpen, { toggle: toggleProfile, close: closeProfile }] =
    useDisclosure(false);
  const wideLayout = useMediaQuery("(min-width: 1100px)");
  const compactLayout = useMediaQuery("(max-width: 767px)");
  const showProfileColumn =
    Boolean(activeConversationId) && (wideLayout || profileOpen);
  const showSidebar =
    !compactLayout || !activeConversationId;
  const showMain =
    !compactLayout || Boolean(activeConversationId);

  const connected =
    chatStatus === "Connected" && onlineUsersStatus === "Connected";

  const currentUserId = session?.user.id ?? null;
  const currentUserFullName = session?.user.fullName ?? null;

  const {
    data: conversationsData,
    isLoading: conversationsLoading,
    refetch: refetchConversations,
  } = useQuery({
    queryKey: ["chat", "conversations"],
    queryFn: () => listConversations(0, 50),
    enabled: hubsConnected,
  });

  const {
    data: historyMessages,
    isLoading: messagesLoading,
    isFetching: messagesFetching,
  } = useQuery({
    queryKey: ["chat", "messages", activeConversationId],
    queryFn: () => getMessages(activeConversationId!),
    enabled: Boolean(activeConversationId) && hubsConnected,
  });

  const { data: restOnlineUsers, isLoading: pickerUsersLoading } = useQuery({
    queryKey: ["chat", "online-users"],
    queryFn: getOnlineUsers,
    enabled: hubsConnected,
    refetchInterval: 30_000,
  });

  useEffect(() => {
    if (conversationsData) {
      setConversations(conversationsData);
    }
  }, [conversationsData, setConversations]);

  useEffect(() => {
    if (conversationListVersion > 0 && hubsConnected) {
      void refetchConversations();
    }
  }, [conversationListVersion, hubsConnected, refetchConversations]);

  useEffect(() => {
    if (!historyMessages || !activeConversationId) return;
    setHistoryMessages(activeConversationId, historyMessages);

    const unreadFromOthers = historyMessages.filter(
      (m) => !m.isRead && m.senderId !== currentUserId,
    );
    if (unreadFromOthers.length === 0) return;

    for (const msg of unreadFromOthers) {
      void markMessageRead(msg.id).catch(() => {
        /* ignore */
      });
    }

    useRealtimeChatStore
      .getState()
      .markConversationMessagesRead(
        activeConversationId,
        unreadFromOthers[unreadFromOthers.length - 1]?.id,
      );
  }, [historyMessages, activeConversationId, currentUserId, setHistoryMessages]);

  useEffect(() => {
    if (!restOnlineUsers?.length) return;

    const store = useRealtimeChatStore.getState();
    for (const user of restOnlineUsers) {
      store.upsertOnlineUserConnection(user);
    }
  }, [restOnlineUsers]);

  const users = useMemo(
    () =>
      Object.values(onlineUsersById).sort((a, b) =>
        a.userId.localeCompare(b.userId),
      ),
    [onlineUsersById],
  );

  const userNameLookup = useMemo(
    () =>
      buildUserNameLookup({
        restUsers: restOnlineUsers,
        conversations,
        messagesByConversation,
      }),
    [restOnlineUsers, conversations, messagesByConversation],
  );

  const displayUsers = useMemo(
    () =>
      mergeOnlineUsersForDisplay(
        users,
        restOnlineUsers,
        {
          id: currentUserId ?? "",
          fullName: currentUserFullName,
        },
        userNameLookup,
      ),
    [
      users,
      restOnlineUsers,
      currentUserId,
      currentUserFullName,
      userNameLookup,
    ],
  );

  const pickerUsers = useMemo((): PickerUser[] => {
    return displayUsers
      .filter((user) => user.userId !== currentUserId)
      .map((user) => ({
        userId: user.userId,
        displayName: user.displayName,
        role: user.role,
      }));
  }, [displayUsers, currentUserId]);

  const messages = useMemo(() => {
    if (!activeConversationId) return [];
    return messagesByConversation[activeConversationId] ?? [];
  }, [activeConversationId, messagesByConversation]);

  const typingUserIds = useMemo(() => {
    if (!activeConversationId) return [];
    const typingMap = typingByConversation[activeConversationId] ?? {};
    return Object.keys(typingMap).filter((userId) => typingMap[userId]);
  }, [activeConversationId, typingByConversation]);

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeConversationId),
    [conversations, activeConversationId],
  );

  const activeConversationTitle = useMemo(() => {
    if (!activeConversation) {
      return activeConversationId ?? "";
    }
    return getConversationTitle(activeConversation, currentUserId ?? "", {
      messages: activeConversationId
        ? messagesByConversation[activeConversationId]
        : undefined,
      onlineUsersById,
      nameLookup: userNameLookup,
    });
  }, [
    activeConversation,
    activeConversationId,
    currentUserId,
    messagesByConversation,
    onlineUsersById,
    userNameLookup,
  ]);

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

  const openConversation = useCallback(
    async (conversation: Conversation) => {
      const previousId = useRealtimeChatStore.getState().activeConversationId;
      if (previousId && previousId !== conversation.id) {
        try {
          await chatApi.leaveConversation(previousId);
        } catch {
          /* ignore */
        }
      }

      setActiveConversation(conversation.id);

      setConversations(
        useRealtimeChatStore.getState().conversations.map((c) =>
          c.id === conversation.id ? { ...c, ...conversation } : c,
        ),
      );

      if (hubsConnected) {
        try {
          await chatApi.joinConversation(conversation.id);
        } catch (error) {
          notifications.show({
            color: "red",
            title: "Join conversation failed",
            message: error instanceof Error ? error.message : String(error),
          });
        }
      }

      queryClient.setQueryData<Conversation[]>(
        ["chat", "conversations"],
        (prev) =>
          prev?.map((c) =>
            c.id === conversation.id ? { ...c, unreadCount: 0 } : c,
          ) ?? prev,
      );

      setConversations(
        useRealtimeChatStore.getState().conversations.map((c) =>
          c.id === conversation.id ? { ...c, unreadCount: 0 } : c,
        ),
      );

      await queryClient.invalidateQueries({
        queryKey: ["chat", "messages", conversation.id],
      });
    },
    [chatApi, hubsConnected, queryClient, setActiveConversation, setConversations],
  );

  const createDirectMutation = useMutation({
    mutationFn: (otherUserId: string) => createDirectConversation(otherUserId),
    onMutate: (otherUserId) => {
      setDmPendingUserId(otherUserId);
    },
    onSuccess: async (conversation, otherUserId) => {
      setPickerOpen(false);
      const peer = pickerUsers.find((user) => user.userId === otherUserId);
      const enrichedConversation: Conversation = peer
        ? {
            ...conversation,
            participants: [
              ...(conversation.participants ?? []),
              {
                userId: peer.userId,
                fullName: peer.displayName,
                email: "",
                phoneNumber: "",
                role: peer.role ?? "",
                isOnline: true,
              },
            ],
          }
        : conversation;
      await queryClient.refetchQueries({ queryKey: ["chat", "conversations"] });
      if (peer) {
        const patchConversations = (items: Conversation[]) =>
          items.map((item) =>
            item.id === conversation.id ? enrichedConversation : item,
          );
        const cached =
          queryClient.getQueryData<Conversation[]>(["chat", "conversations"]) ??
          [];
        queryClient.setQueryData(
          ["chat", "conversations"],
          patchConversations(cached),
        );
        setConversations(
          patchConversations(useRealtimeChatStore.getState().conversations),
        );
      }
      setSidebarView("messages");
      await openConversation(enrichedConversation);
    },
    onError: (error) => {
      notifications.show({
        color: "red",
        title: "Start chat failed",
        message: error instanceof Error ? error.message : String(error),
      });
    },
    onSettled: () => {
      setDmPendingUserId(null);
    },
  });

  const leaveActiveConversation = useCallback(async () => {
    if (!activeConversationId) return;
    const id = activeConversationId;

    try {
      await leaveConversationRest(id);
    } catch (error) {
      notifications.show({
        color: "red",
        title: "Leave conversation failed",
        message: error instanceof Error ? error.message : String(error),
      });
      return;
    }

    try {
      await chatApi.leaveConversation(id);
    } catch {
      /* ignore hub leave errors */
    }

    setActiveConversation(null);
    await queryClient.invalidateQueries({ queryKey: ["chat", "conversations"] });
  }, [activeConversationId, chatApi, queryClient, setActiveConversation]);

  const handleConnect = useCallback(async () => {
    await runAction("Connect", async () => {
      await chatApi.connect();
      await refetchConversations();
    });
  }, [chatApi, refetchConversations]);

  const handleOpenNewChatPicker = useCallback(() => {
    if (!hubsConnected) {
      notifications.show({
        color: "yellow",
        title: "Not connected",
        message: "Connect to chat before starting a new conversation.",
      });
      return;
    }
    setPickerOpen(true);
  }, [hubsConnected]);

  const handleJoinById = useCallback(
    async (conversationId: string) => {
      const existing = conversations.find((c) => c.id === conversationId);
      if (existing) {
        await openConversation(existing);
        return;
      }

      await runAction("Join conversation", async () => {
        await chatApi.joinConversation(conversationId);
        setActiveConversation(conversationId);
        await queryClient.invalidateQueries({
          queryKey: ["chat", "messages", conversationId],
        });
      });
    },
    [
      chatApi,
      conversations,
      openConversation,
      queryClient,
      setActiveConversation,
    ],
  );

  const threadLoading =
    Boolean(activeConversationId) &&
    hubsConnected &&
    (messagesLoading || messagesFetching) &&
    messages.length === 0;

  return (
    <Paper
      className="chat-app"
      withBorder
      radius="lg"
      style={{
        height: "calc(100vh - 120px)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        borderColor: "var(--chat-border)",
      }}
    >
      {(conversationsLoading || threadLoading) && (
        <Progress
          size="xs"
          radius={0}
          value={100}
          animated
          color="violet"
          style={{ flexShrink: 0 }}
        />
      )}

      <ChatTopBar
        sidebarView={sidebarView}
        onSidebarViewChange={setSidebarView}
      />

      <Box
        style={{
          display: "flex",
          flex: 1,
          overflow: "hidden",
          minHeight: 0,
        }}
      >
        {showSidebar ? (
        <Box
          className="chat-sidebar"
          w={{ base: "100%", md: 300 }}
          style={{
            borderRight: "1px solid var(--chat-border)",
            display: "flex",
            flexDirection: "column",
            flexShrink: 0,
            flex: compactLayout ? 1 : undefined,
          }}
        >
          <Box
            p="md"
            style={{ borderBottom: "1px solid var(--chat-border)" }}
          >
            <ConnectionStatusCard
              chatStatus={chatStatus}
              onlineUsersStatus={onlineUsersStatus}
              chatError={chatError}
              onlineUsersError={onlineUsersError}
              onConnect={() => void handleConnect()}
              onDisconnect={() =>
                void runAction("Disconnect", chatApi.disconnect)
              }
            />
          </Box>

          <Box style={{ flex: 1, overflowY: "auto" }} p="md">
            {sidebarView === "messages" ? (
              <ConversationListPanel
                conversations={conversations}
                conversationsLoading={conversationsLoading}
                activeConversationId={activeConversationId}
                currentUserId={currentUserId}
                hubsConnected={hubsConnected}
                messagesByConversation={messagesByConversation}
                onlineUsersById={onlineUsersById}
                nameLookup={userNameLookup}
                onNewChat={handleOpenNewChatPicker}
                onOpen={(conversation) =>
                  void runAction("Open conversation", () =>
                    openConversation(conversation),
                  )
                }
                onJoinById={(conversationId) =>
                  void handleJoinById(conversationId)
                }
              />
            ) : (
              <OnlineUsersPanel
                users={displayUsers}
                currentUserId={currentUserId}
                dmPendingUserId={dmPendingUserId}
                loading={pickerUsersLoading}
                onStartDm={(userId) => createDirectMutation.mutate(userId)}
              />
            )}
          </Box>

          <Box
            p="xs"
            style={{ borderTop: "1px solid var(--chat-border)" }}
          >
            <Group justify="center">
              <Button
                size="xs"
                variant="subtle"
                color="gray"
                leftSection={<IconBug size={14} />}
                onClick={() => setShowLogs(!showLogs)}
              >
                {showLogs ? "Hide Logs" : "Show Logs"}
              </Button>
            </Group>
          </Box>
        </Box>
        ) : null}

        {showMain ? (
        <Box
          className="chat-main"
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            position: "relative",
            minWidth: 0,
            width: compactLayout ? "100%" : undefined,
          }}
        >
        {activeConversationId ? (
          <>
            <Box className="chat-header" p="md" style={{ zIndex: 10 }}>
              <Group justify="space-between" wrap="nowrap">
                {compactLayout ? (
                  <ActionIcon
                    variant="subtle"
                    color="gray"
                    onClick={() => setActiveConversation(null)}
                    aria-label="Back to conversations"
                  >
                    <IconArrowLeft size={18} />
                  </ActionIcon>
                ) : null}
                <Group wrap="nowrap" gap="sm" style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    <Avatar color="violet" radius="xl" size="md">
                      {activeConversationTitle.substring(0, 2).toUpperCase()}
                    </Avatar>
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        backgroundColor: "var(--mantine-color-green-6)",
                        border: "2px solid var(--chat-avatar-border)",
                      }}
                    />
                  </div>
                  <Text fw={600} size="lg" truncate>
                    {activeConversationTitle}
                  </Text>
                </Group>
                <Group gap="xs" wrap="nowrap">
                  <Button
                    variant="subtle"
                    color="gray"
                    size="compact-sm"
                    leftSection={<IconFile size={14} />}
                  >
                    Files
                  </Button>
                  <Button
                    variant="subtle"
                    color="gray"
                    size="compact-sm"
                    leftSection={<IconUser size={14} />}
                    onClick={toggleProfile}
                  >
                    Profile
                  </Button>
                  <Tooltip label="Leave Chat">
                    <ActionIcon
                      variant="light"
                      color="red"
                      onClick={() =>
                        void runAction(
                          "Leave conversation",
                          leaveActiveConversation,
                        )
                      }
                    >
                      <IconX size={18} />
                    </ActionIcon>
                  </Tooltip>
                </Group>
              </Group>
            </Box>

            <Box style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
              <MessageThreadPanel
                messages={messages}
                typingUserIds={typingUserIds}
                currentUserId={currentUserId}
                isLoading={threadLoading}
              />
            </Box>

            <Box className="chat-composer" p="md">
              <ComposerPanel
                conversationId={activeConversationId}
                disabled={!connected}
                onSend={(text, file) =>
                  void runAction("Send message", async () => {
                    if (!activeConversationId || !currentUserId) return;

                    const textToSend = file
                      ? text.trim() || file.name
                      : text.trim();
                    const knownMessageIds = new Set(
                      (
                        useRealtimeChatStore.getState().messagesByConversation[
                          activeConversationId
                        ] ?? []
                      ).map((m) => m.messageId),
                    );

                    // Hub only accepts Text (1); attachment is uploaded via REST.
                    await chatApi.sendMessage(
                      activeConversationId,
                      textToSend,
                      1,
                    );

                    if (file) {
                      const sentMessage = await waitForOwnNewMessage({
                        conversationId: activeConversationId,
                        currentUserId,
                        knownMessageIds,
                      });
                      markMessagePendingAttachment(
                        activeConversationId,
                        sentMessage.messageId,
                        {
                          fileName: file.name,
                          fileType: file.type,
                        },
                      );
                      const attachment = await uploadAttachment(
                        sentMessage.messageId,
                        file,
                      );
                      updateMessageFileUrl(
                        activeConversationId,
                        sentMessage.messageId,
                        attachment.fileUrl,
                        {
                          fileName: attachment.fileName,
                          fileType: attachment.fileType,
                        },
                      );
                    }

                    await chatApi.stopTyping(activeConversationId);
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
            <IconMessageCircle
              size={64}
              color="var(--chat-text-muted)"
              stroke={1.5}
            />
            <Text c="dimmed" size="lg" fw={500}>
              Select or start a conversation to begin chatting
            </Text>
          </Center>
        )}
        </Box>
        ) : null}

        {showProfileColumn ? (
          <Box
            w={{ base: profileOpen ? "100%" : 300, md: 300 }}
            style={{
              position: wideLayout ? "relative" : "absolute",
              right: 0,
              top: 0,
              bottom: 0,
              zIndex: wideLayout ? 1 : 20,
              flexShrink: 0,
              boxShadow: wideLayout
                ? undefined
                : "-4px 0 24px rgba(0,0,0,0.2)",
            }}
          >
            <ChatProfilePanel
              conversation={activeConversation}
              conversationTitle={activeConversationTitle}
              currentUserId={currentUserId}
              onClose={wideLayout ? undefined : closeProfile}
            />
          </Box>
        ) : null}
      </Box>

      <NewChatUserPickerModal
        opened={pickerOpen}
        onClose={() => setPickerOpen(false)}
        users={pickerUsers}
        loading={pickerUsersLoading}
        pendingUserId={dmPendingUserId}
        currentUserId={currentUserId}
        onSelectUser={(userId) => createDirectMutation.mutate(userId)}
      />

      {showLogs && (
        <Paper
          withBorder
          p="md"
          radius="md"
          shadow="xl"
          style={{
            position: "absolute",
            bottom: "80px",
            right: "20px",
            width: "400px",
            maxHeight: "300px",
            display: "flex",
            flexDirection: "column",
            zIndex: 100,
          }}
        >
          <Group justify="space-between" mb="xs">
            <Text fw={700} size="sm">
              Realtime Logs
            </Text>
            <Group gap="xs">
              <ActionIcon
                size="sm"
                variant="subtle"
                onClick={() => useRealtimeChatStore.getState().clearLogs()}
              >
                <IconTrash size={14} />
              </ActionIcon>
              <ActionIcon
                size="sm"
                variant="subtle"
                onClick={() => setShowLogs(false)}
              >
                <IconX size={14} />
              </ActionIcon>
            </Group>
          </Group>
          <ScrollArea style={{ flex: 1 }}>
            <Stack gap={4}>
              {logLines.length === 0 ? (
                <Text size="xs" c="dimmed">
                  No events yet.
                </Text>
              ) : (
                logLines.map((line, i) => (
                  <Text size="xs" ff="monospace" key={i}>
                    {line}
                  </Text>
                ))
              )}
            </Stack>
          </ScrollArea>
        </Paper>
      )}
    </Paper>
  );
}
