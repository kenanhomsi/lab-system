"use client";

import type { HubConnection } from "@microsoft/signalr";
import { useCallback, useEffect, useRef } from "react";
import {
  invokeJoinConversation,
  invokeLeaveConversation,
  invokeSendMessage,
  invokeStopTyping,
  invokeTyping,
  registerChatHandlers,
} from "../signalr/chat-client";
import {
  invokeGetOnlineUsers,
  registerOnlineUsersHandlers,
} from "../signalr/online-users-client";
import {
  createChatConnection,
  createOnlineUsersConnection,
} from "../signalr/create-connection";
import type {
  OnlineUser,
  OnlineUsersListPayload,
  ReceiveMessagePayload,
  StopTypingPayload,
  TypingPayload,
} from "../signalr/types";
import { axiosInstanceFront } from "@/lib/clients/frontend-instance";
import { GLOBAL_TYPING_CONVERSATION } from "../store/realtime-chat-selectors";
import { useRealtimeChatStore } from "../store/realtime-chat-store";

export interface UseRealtimeChatEngineOptions {
  baseUrl: string;
  accessToken: string | null;
  currentUserId: string | null;
}

export interface RealtimeChatEngineApi {
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  joinConversation: (conversationId: string) => Promise<void>;
  leaveConversation: (conversationId: string) => Promise<void>;
  sendMessage: (params: {
    conversationId: string;
    text: string;
    messageType?: number;
  }) => Promise<void>;
  sendTyping: (conversationId: string) => Promise<void>;
  sendStopTyping: (conversationId: string) => Promise<void>;
}

function errMsg(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

function normalizeOnlineUsers(payload: OnlineUsersListPayload): OnlineUser[] {
  const out: OnlineUser[] = [];
  if (!Array.isArray(payload)) return out;
  for (const entry of payload) {
    if (!entry || typeof entry !== "object") continue;
    const userId = typeof entry.userId === "string" ? entry.userId.trim() : "";
    if (!userId) continue;
    const displayName =
      typeof entry.displayName === "string"
        ? entry.displayName
        : typeof (entry as { fullName?: string }).fullName === "string"
          ? (entry as { fullName: string }).fullName
          : undefined;
    out.push({
      userId,
      displayName,
      role: typeof entry.role === "string" ? entry.role : undefined,
      connectionId:
        typeof entry.connectionId === "string" ? entry.connectionId : undefined,
    });
  }
  return out;
}

function typingConversationId(
  payload: TypingPayload | StopTypingPayload,
  fallbackConversationId: string | null,
): string {
  const fromPayload =
    typeof payload.conversationId === "string"
      ? payload.conversationId.trim()
      : "";
  if (fromPayload) return fromPayload;
  if (fallbackConversationId?.trim()) return fallbackConversationId.trim();
  return GLOBAL_TYPING_CONVERSATION;
}

export function useRealtimeChatEngine({
  baseUrl,
  accessToken,
  currentUserId,
}: UseRealtimeChatEngineOptions): RealtimeChatEngineApi {
  const tokenRef = useRef(accessToken?.trim() ?? "");
  const chatConnectionRef = useRef<HubConnection | null>(null);
  const onlineUsersConnectionRef = useRef<HubConnection | null>(null);
  const unregisterChatHandlersRef = useRef<(() => void) | null>(null);
  const unregisterOnlineHandlersRef = useRef<(() => void) | null>(null);
  const typingTimersRef = useRef<Record<string, number>>({});

  const clearTypingTimer = useCallback((timerKey: string) => {
    const timerId = typingTimersRef.current[timerKey];
    if (timerId !== undefined) {
      window.clearTimeout(timerId);
      delete typingTimersRef.current[timerKey];
    }
  }, []);

  const clearTypingTimersForConversation = useCallback(
    (conversationId: string) => {
      const prefix = `${conversationId.trim()}:`;
      for (const key of Object.keys(typingTimersRef.current)) {
        if (key.startsWith(prefix)) clearTypingTimer(key);
      }
    },
    [clearTypingTimer],
  );

  const clearAllTypingTimers = useCallback(() => {
    for (const key of Object.keys(typingTimersRef.current))
      clearTypingTimer(key);
  }, [clearTypingTimer]);

  const stopConnections = useCallback(async () => {
    unregisterOnlineHandlersRef.current?.();
    unregisterOnlineHandlersRef.current = null;
    unregisterChatHandlersRef.current?.();
    unregisterChatHandlersRef.current = null;

    const onlineConn = onlineUsersConnectionRef.current;
    const chatConn = chatConnectionRef.current;
    onlineUsersConnectionRef.current = null;
    chatConnectionRef.current = null;

    if (onlineConn) {
      try {
        await onlineConn.stop();
      } catch {
        // Ignore stop race errors.
      }
    }

    if (chatConn) {
      try {
        await chatConn.stop();
      } catch {
        // Ignore stop race errors.
      }
    }
    clearAllTypingTimers();
  }, [clearAllTypingTimers]);

  useEffect(() => {
    tokenRef.current = accessToken?.trim() ?? "";
  }, [accessToken]);

  useEffect(() => {
    if (accessToken?.trim()) return;
    void stopConnections();
    useRealtimeChatStore.getState().resetRealtimeState();
  }, [accessToken, stopConnections]);

  useEffect(() => {
    return () => {
      void stopConnections();
    };
  }, [stopConnections]);

  const connect = useCallback(async () => {
    if (!tokenRef.current) {
      useRealtimeChatStore.getState().setChatError("Missing access token.");
      useRealtimeChatStore
        .getState()
        .setOnlineUsersError("Missing access token.");
      return;
    }

    const hubBase = baseUrl.trim();
    if (!hubBase) {
      useRealtimeChatStore
        .getState()
        .setChatError("Chat hub URL is not ready yet.");
      useRealtimeChatStore
        .getState()
        .setOnlineUsersError("Chat hub URL is not ready yet.");
      return;
    }

    if (chatConnectionRef.current || onlineUsersConnectionRef.current) {
      useRealtimeChatStore.getState().pushLog({
        hub: "app",
        event: "Connect skipped",
        detail: "Connections already created.",
      });
      return;
    }

    useRealtimeChatStore.getState().setChatError(null);
    useRealtimeChatStore.getState().setOnlineUsersError(null);
    useRealtimeChatStore.getState().setChatStatus("Connecting");
    useRealtimeChatStore.getState().setOnlineUsersStatus("Connecting");

    const onlineConnection = createOnlineUsersConnection(
      hubBase,
      () => tokenRef.current,
    );
    const chatConnection = createChatConnection(
      hubBase,
      () => tokenRef.current,
    );
    onlineUsersConnectionRef.current = onlineConnection;
    chatConnectionRef.current = chatConnection;

    unregisterOnlineHandlersRef.current = registerOnlineUsersHandlers(
      onlineConnection,
      {
        onUserOnline: (payload) => {
          useRealtimeChatStore.getState().upsertOnlineUserConnection(payload);
          useRealtimeChatStore.getState().pushLog({
            hub: "online-users",
            event: "UserOnline",
            payload,
          });
        },
        onUserOffline: (payload) => {
          useRealtimeChatStore.getState().removeOnlineUserConnection(payload);
          useRealtimeChatStore.getState().pushLog({
            hub: "online-users",
            event: "UserOffline",
            payload,
          });
        },
        onOnlineUsersList: (payload) => {
          useRealtimeChatStore
            .getState()
            .replaceOnlineUsersSnapshot(normalizeOnlineUsers(payload));
          useRealtimeChatStore.getState().pushLog({
            hub: "online-users",
            event: "OnlineUsersList",
            payload,
          });
        },
      },
    );

    unregisterChatHandlersRef.current = registerChatHandlers(chatConnection, {
      onReceiveMessage: (payload: ReceiveMessagePayload) => {
        useRealtimeChatStore.getState().appendMessageIfNew(payload);

        const conversationId = payload.conversationId?.trim();
        const senderId = payload.senderId?.trim();
        if (conversationId && senderId) {
          useRealtimeChatStore
            .getState()
            .setTyping({ conversationId, userId: senderId, isTyping: false });
        }

        const activeId = useRealtimeChatStore.getState().activeConversationId;
        const messageId = payload.messageId?.trim();
        if (
          activeId &&
          messageId &&
          activeId === conversationId
        ) {
          void axiosInstanceFront
            .post(`/chat/messages/${messageId}/read`)
            .catch(() => {
              /* ignore */
            });
        }

        useRealtimeChatStore.getState().bumpConversationListVersion();

        useRealtimeChatStore.getState().pushLog({
          hub: "chat",
          event: "ReceiveMessage",
          payload,
        });
      },
      onTyping: (payload: TypingPayload) => {
        if (!payload.isTyping) {
          const fallbackConversationId =
            useRealtimeChatStore.getState().activeConversationId;
          const conversationId = typingConversationId(
            payload,
            fallbackConversationId,
          );
          const userId = payload.userId?.trim();
          if (!userId) return;
          useRealtimeChatStore
            .getState()
            .setTyping({ conversationId, userId, isTyping: false });
          return;
        }

        const fallbackConversationId =
          useRealtimeChatStore.getState().activeConversationId;
        const conversationId = typingConversationId(
          payload,
          fallbackConversationId,
        );
        const userId = payload.userId?.trim();
        if (!userId) return;

        useRealtimeChatStore
          .getState()
          .setTyping({ conversationId, userId, isTyping: true });
      },
      onStopTyping: (payload: StopTypingPayload) => {
        const fallbackConversationId =
          useRealtimeChatStore.getState().activeConversationId;
        const conversationId = typingConversationId(
          payload,
          fallbackConversationId,
        );
        const userId = payload.userId?.trim();
        if (!userId) return;
        const timerKey = `${conversationId}:${userId}`;
        clearTypingTimer(timerKey);
        useRealtimeChatStore
          .getState()
          .setTyping({ conversationId, userId, isTyping: false });
      },
      onReadReceipt: (payload) => {
        const { conversationId, messageId } = payload;
        if (conversationId) {
          useRealtimeChatStore
            .getState()
            .markConversationMessagesRead(conversationId, messageId);
        }
        useRealtimeChatStore.getState().pushLog({
          hub: "chat",
          event: "ReadReceipt",
          payload,
        });
      },
      onConversationUpdated: (payload) => {
        useRealtimeChatStore.getState().updateConversationUpdated(payload);
        useRealtimeChatStore.getState().pushLog({
          hub: "chat",
          event: "ConversationUpdated",
          payload,
        });
      },
    });

    onlineConnection.onreconnecting((error) => {
      useRealtimeChatStore.getState().setOnlineUsersStatus("Connecting");
      useRealtimeChatStore.getState().pushLog({
        hub: "online-users",
        event: "reconnecting",
        detail: error ? errMsg(error) : undefined,
      });
    });

    onlineConnection.onreconnected(async () => {
      useRealtimeChatStore.getState().setOnlineUsersStatus("Connected");
      try {
        await invokeGetOnlineUsers(onlineConnection);
      } catch (error) {
        useRealtimeChatStore.getState().setOnlineUsersError(errMsg(error));
      }
      useRealtimeChatStore.getState().pushLog({
        hub: "online-users",
        event: "reconnected",
      });
    });

    onlineConnection.onclose((error) => {
      useRealtimeChatStore.getState().setOnlineUsersStatus("Disconnected");
      if (error)
        useRealtimeChatStore.getState().setOnlineUsersError(errMsg(error));
      useRealtimeChatStore.getState().pushLog({
        hub: "online-users",
        event: "closed",
        detail: error ? errMsg(error) : undefined,
      });
    });

    chatConnection.onreconnecting((error) => {
      useRealtimeChatStore.getState().setChatStatus("Connecting");
      useRealtimeChatStore.getState().pushLog({
        hub: "chat",
        event: "reconnecting",
        detail: error ? errMsg(error) : undefined,
      });
    });

    chatConnection.onreconnected(async () => {
      useRealtimeChatStore.getState().setChatStatus("Connected");
      const conversationIds =
        useRealtimeChatStore.getState().openConversationIds;
      for (const conversationId of conversationIds) {
        try {
          await invokeJoinConversation(chatConnection, conversationId);
        } catch (error) {
          useRealtimeChatStore.getState().setChatError(errMsg(error));
          useRealtimeChatStore.getState().pushLog({
            hub: "chat",
            event: "rejoin failed",
            detail: errMsg(error),
            payload: { conversationId },
          });
        }
      }
      useRealtimeChatStore.getState().pushLog({
        hub: "chat",
        event: "reconnected",
        payload: { rejoinedCount: conversationIds.length },
      });
    });

    chatConnection.onclose((error) => {
      useRealtimeChatStore.getState().setChatStatus("Disconnected");
      if (error) useRealtimeChatStore.getState().setChatError(errMsg(error));
      clearAllTypingTimers();
      useRealtimeChatStore.getState().pushLog({
        hub: "chat",
        event: "closed",
        detail: error ? errMsg(error) : undefined,
      });
    });

    try {
      await onlineConnection.start();
      useRealtimeChatStore.getState().setOnlineUsersStatus("Connected");
      await invokeGetOnlineUsers(onlineConnection);
      await chatConnection.start();
      useRealtimeChatStore.getState().setChatStatus("Connected");
      useRealtimeChatStore.getState().setHubsConnected(true);
      useRealtimeChatStore.getState().pushLog({
        hub: "app",
        event: "Connections started",
        payload: { currentUserId },
      });
    } catch (error) {
      const message = errMsg(error);
      useRealtimeChatStore.getState().setChatError(message);
      useRealtimeChatStore.getState().setOnlineUsersError(message);
      useRealtimeChatStore.getState().setChatStatus("Disconnected");
      useRealtimeChatStore.getState().setOnlineUsersStatus("Disconnected");
      useRealtimeChatStore.getState().setHubsConnected(false);
      useRealtimeChatStore.getState().pushLog({
        hub: "app",
        event: "Connections failed",
        detail: message,
      });
      await stopConnections();
    }
  }, [
    baseUrl,
    clearAllTypingTimers,
    clearTypingTimer,
    currentUserId,
    stopConnections,
  ]);

  const disconnect = useCallback(async () => {
    await stopConnections();
    useRealtimeChatStore.getState().setChatStatus("Disconnected");
    useRealtimeChatStore.getState().setOnlineUsersStatus("Disconnected");
    useRealtimeChatStore.getState().setHubsConnected(false);
    useRealtimeChatStore.getState().setActiveConversation(null);
    useRealtimeChatStore.getState().pushLog({
      hub: "app",
      event: "Connections stopped",
    });
  }, [stopConnections]);

  const joinConversation = useCallback(async (conversationId: string) => {
    const normalized = conversationId.trim();
    if (!normalized) return;
    const chatConn = chatConnectionRef.current;
    if (!chatConn) throw new Error("Chat hub is not connected.");

    try {
      await invokeJoinConversation(chatConn, normalized);
      useRealtimeChatStore.getState().markConversationOpen(normalized);
      useRealtimeChatStore.getState().pushLog({
        hub: "chat",
        event: "invoke JoinConversation",
        payload: { conversationId: normalized },
      });
    } catch (error) {
      useRealtimeChatStore.getState().setChatError(errMsg(error));
      throw error;
    }
  }, []);

  const leaveConversation = useCallback(
    async (conversationId: string) => {
      const normalized = conversationId.trim();
      if (!normalized) return;
      const chatConn = chatConnectionRef.current;
      if (!chatConn) throw new Error("Chat hub is not connected.");

      try {
        await invokeLeaveConversation(chatConn, normalized);
        clearTypingTimersForConversation(normalized);
        useRealtimeChatStore.getState().markConversationClosed(normalized);
        useRealtimeChatStore.getState().pushLog({
          hub: "chat",
          event: "invoke LeaveConversation",
          payload: { conversationId: normalized },
        });
      } catch (error) {
        useRealtimeChatStore.getState().setChatError(errMsg(error));
        throw error;
      }
    },
    [clearTypingTimersForConversation],
  );

  const sendMessage = useCallback(
    async ({
      conversationId,
      text,
      messageType = 1,
    }: {
      conversationId: string;
      text: string;
      messageType?: number;
    }) => {
      const normalizedConversationId = conversationId.trim();
      const normalizedText = text.trim();
      if (!normalizedConversationId)
        throw new Error("Conversation ID is required.");
      if (messageType === 1 && !normalizedText)
        throw new Error("Message text is required.");

      const chatConn = chatConnectionRef.current;
      if (!chatConn) throw new Error("Chat hub is not connected.");

      try {
        await invokeSendMessage(chatConn, normalizedConversationId, {
          text: normalizedText,
          messageType,
        });
        useRealtimeChatStore.getState().pushLog({
          hub: "chat",
          event: "invoke SendMessage",
          payload: {
            conversationId: normalizedConversationId,
            messageType,
          },
        });
      } catch (error) {
        useRealtimeChatStore.getState().setChatError(errMsg(error));
        throw error;
      }
    },
    [],
  );

  const sendTyping = useCallback(async (conversationId: string) => {
    const normalized = conversationId.trim();
    if (!normalized) return;
    const chatConn = chatConnectionRef.current;
    if (!chatConn) throw new Error("Chat hub is not connected.");
    await invokeTyping(chatConn, normalized);
  }, []);

  const sendStopTyping = useCallback(async (conversationId: string) => {
    const normalized = conversationId.trim();
    if (!normalized) return;
    const chatConn = chatConnectionRef.current;
    if (!chatConn) throw new Error("Chat hub is not connected.");
    await invokeStopTyping(chatConn, normalized);
  }, []);

  return {
    connect,
    disconnect,
    joinConversation,
    leaveConversation,
    sendMessage,
    sendTyping,
    sendStopTyping,
  };
}
