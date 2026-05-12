"use client";

import { create } from "zustand";
import type {
  ConnectionStatusLabel,
  OnlineUser,
  RealtimeLogEntry,
  ReceiveMessagePayload,
} from "../signalr/types";

export interface RealtimeChatState {
  chatStatus: ConnectionStatusLabel;
  onlineUsersStatus: ConnectionStatusLabel;
  chatError: string | null;
  onlineUsersError: string | null;
  logs: RealtimeLogEntry[];
  openConversationIds: string[];
  activeConversationId: string | null;
  onlineUsersById: Record<string, OnlineUser>;
  presenceConnectionsByUser: Record<string, string[]>;
  messagesByConversation: Record<string, ReceiveMessagePayload[]>;
  typingByConversation: Record<string, Record<string, boolean>>;
}

export interface RealtimeChatActions {
  setChatStatus: (status: ConnectionStatusLabel) => void;
  setOnlineUsersStatus: (status: ConnectionStatusLabel) => void;
  setChatError: (error: string | null) => void;
  setOnlineUsersError: (error: string | null) => void;
  pushLog: (entry: Omit<RealtimeLogEntry, "id" | "at">) => void;
  clearLogs: () => void;
  setActiveConversation: (conversationId: string | null) => void;
  markConversationOpen: (conversationId: string) => void;
  markConversationClosed: (conversationId: string) => void;
  upsertOnlineUserConnection: (user: OnlineUser) => void;
  removeOnlineUserConnection: (payload: {
    userId: string;
    connectionId?: string;
  }) => void;
  replaceOnlineUsersSnapshot: (users: OnlineUser[]) => void;
  appendMessageIfNew: (message: ReceiveMessagePayload) => void;
  setTyping: (payload: {
    conversationId: string;
    userId: string;
    isTyping: boolean;
  }) => void;
  clearTypingConversation: (conversationId: string) => void;
  resetRealtimeState: () => void;
}

const DEFAULT_STATE: RealtimeChatState = {
  chatStatus: "Disconnected",
  onlineUsersStatus: "Disconnected",
  chatError: null,
  onlineUsersError: null,
  logs: [],
  openConversationIds: [],
  activeConversationId: null,
  onlineUsersById: {},
  presenceConnectionsByUser: {},
  messagesByConversation: {},
  typingByConversation: {},
};

function newLogId(): string {
  return crypto.randomUUID();
}

export const useRealtimeChatStore = create<RealtimeChatState & RealtimeChatActions>(
  (set) => ({
    ...DEFAULT_STATE,
    setChatStatus: (chatStatus) => set({ chatStatus }),
    setOnlineUsersStatus: (onlineUsersStatus) => set({ onlineUsersStatus }),
    setChatError: (chatError) => set({ chatError }),
    setOnlineUsersError: (onlineUsersError) => set({ onlineUsersError }),
    pushLog: (entry) =>
      set((state) => ({
        logs: [...state.logs.slice(-399), { ...entry, at: Date.now(), id: newLogId() }],
      })),
    clearLogs: () => set({ logs: [] }),
    setActiveConversation: (conversationId) =>
      set(() => ({
        activeConversationId:
          conversationId && conversationId.trim() ? conversationId.trim() : null,
      })),
    markConversationOpen: (conversationId) =>
      set((state) => {
        const normalized = conversationId.trim();
        if (!normalized) return state;
        if (state.openConversationIds.includes(normalized)) {
          return {
            ...state,
            activeConversationId: normalized,
          };
        }
        return {
          ...state,
          openConversationIds: [...state.openConversationIds, normalized],
          activeConversationId: normalized,
        };
      }),
    markConversationClosed: (conversationId) =>
      set((state) => {
        const normalized = conversationId.trim();
        if (!normalized) return state;
        const remaining = state.openConversationIds.filter((id) => id !== normalized);
        const nextActive =
          state.activeConversationId === normalized
            ? remaining[remaining.length - 1] ?? null
            : state.activeConversationId;
        const nextTyping = { ...state.typingByConversation };
        delete nextTyping[normalized];
        return {
          ...state,
          openConversationIds: remaining,
          activeConversationId: nextActive,
          typingByConversation: nextTyping,
        };
      }),
    upsertOnlineUserConnection: (user) =>
      set((state) => {
        const userId = user.userId?.trim();
        if (!userId) return state;

        const existing = state.onlineUsersById[userId];
        const nextUser: OnlineUser = {
          userId,
          displayName: user.displayName ?? existing?.displayName,
          role: user.role ?? existing?.role,
          connectionId: user.connectionId ?? existing?.connectionId,
        };

        const nextPresence = { ...state.presenceConnectionsByUser };
        const previousConnections = nextPresence[userId] ?? [];
        if (user.connectionId?.trim()) {
          const connectionId = user.connectionId.trim();
          nextPresence[userId] = previousConnections.includes(connectionId)
            ? previousConnections
            : [...previousConnections, connectionId];
        } else if (!nextPresence[userId]) {
          nextPresence[userId] = [];
        }

        return {
          ...state,
          onlineUsersById: {
            ...state.onlineUsersById,
            [userId]: nextUser,
          },
          presenceConnectionsByUser: nextPresence,
        };
      }),
    removeOnlineUserConnection: ({ userId, connectionId }) =>
      set((state) => {
        const normalizedUserId = userId?.trim();
        if (!normalizedUserId) return state;

        const nextPresence = { ...state.presenceConnectionsByUser };
        const userConnections = nextPresence[normalizedUserId] ?? [];
        const normalizedConnectionId = connectionId?.trim();

        const remaining =
          normalizedConnectionId && userConnections.length > 0
            ? userConnections.filter((id) => id !== normalizedConnectionId)
            : [];

        if (remaining.length > 0) {
          nextPresence[normalizedUserId] = remaining;
          return {
            ...state,
            presenceConnectionsByUser: nextPresence,
          };
        }

        delete nextPresence[normalizedUserId];
        const nextUsers = { ...state.onlineUsersById };
        delete nextUsers[normalizedUserId];

        return {
          ...state,
          onlineUsersById: nextUsers,
          presenceConnectionsByUser: nextPresence,
        };
      }),
    replaceOnlineUsersSnapshot: (users) =>
      set((state) => {
        const nextById: Record<string, OnlineUser> = {};
        const nextPresence: Record<string, string[]> = {};
        for (const user of users) {
          const userId = user.userId?.trim();
          if (!userId) continue;
          const current = nextById[userId];
          nextById[userId] = {
            userId,
            displayName: user.displayName ?? current?.displayName,
            role: user.role ?? current?.role,
            connectionId: user.connectionId ?? current?.connectionId,
          };
          if (user.connectionId?.trim()) {
            const connectionId = user.connectionId.trim();
            const currentConnections = nextPresence[userId] ?? [];
            if (!currentConnections.includes(connectionId)) {
              nextPresence[userId] = [...currentConnections, connectionId];
            }
          } else if (!nextPresence[userId]) {
            nextPresence[userId] = [];
          }
        }
        return {
          ...state,
          onlineUsersById: nextById,
          presenceConnectionsByUser: nextPresence,
        };
      }),
    appendMessageIfNew: (message) =>
      set((state) => {
        const conversationId = message.conversationId?.trim();
        const messageId = message.messageId?.trim();
        if (!conversationId || !messageId) return state;

        const existing = state.messagesByConversation[conversationId] ?? [];
        if (existing.some((item) => item.messageId === messageId)) return state;

        return {
          ...state,
          messagesByConversation: {
            ...state.messagesByConversation,
            [conversationId]: [...existing.slice(-199), message],
          },
        };
      }),
    setTyping: ({ conversationId, userId, isTyping }) =>
      set((state) => {
        const normalizedConversationId = conversationId.trim();
        const normalizedUserId = userId.trim();
        if (!normalizedConversationId || !normalizedUserId) return state;

        const currentMap = state.typingByConversation[normalizedConversationId] ?? {};
        const nextMap = { ...currentMap };
        if (isTyping) {
          nextMap[normalizedUserId] = true;
        } else {
          delete nextMap[normalizedUserId];
        }

        const nextTyping = { ...state.typingByConversation };
        if (Object.keys(nextMap).length === 0) {
          delete nextTyping[normalizedConversationId];
        } else {
          nextTyping[normalizedConversationId] = nextMap;
        }
        return {
          ...state,
          typingByConversation: nextTyping,
        };
      }),
    clearTypingConversation: (conversationId) =>
      set((state) => {
        const normalizedConversationId = conversationId.trim();
        if (!normalizedConversationId) return state;
        const nextTyping = { ...state.typingByConversation };
        delete nextTyping[normalizedConversationId];
        return {
          ...state,
          typingByConversation: nextTyping,
        };
      }),
    resetRealtimeState: () => set({ ...DEFAULT_STATE }),
  }),
);
