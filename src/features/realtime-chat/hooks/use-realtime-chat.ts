"use client";

import { useMemo } from "react";
import { useSession } from "next-auth/react";
import { useSessionUserStore } from "@/stores/session-user-store";
import { useRealtimeChatEngine } from "./use-realtime-chat-engine";

export interface UseRealtimeChatFacade {
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  joinConversation: (conversationId: string) => Promise<void>;
  leaveConversation: (conversationId: string) => Promise<void>;
  sendMessage: (conversationId: string, text: string) => Promise<void>;
  typing: (conversationId: string) => Promise<void>;
  stopTyping: (conversationId: string) => Promise<void>;
}

function resolveHubBaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_BACKEND_URL?.trim();
  if (fromEnv) return fromEnv;
  // Default to the same port as process.env.BACKEND_URL uses in the server
  return "http://localhost:4000";
}

export function useRealtimeChat(): UseRealtimeChatFacade {
  const { data: session } = useSession();
  const sessionUser = useSessionUserStore((state) => state.user);

  const engine = useRealtimeChatEngine({
    baseUrl: resolveHubBaseUrl(),
    accessToken: session?.user.accessToken ?? null,
    currentUserId: sessionUser?.id ?? null,
  });

  return useMemo(
    () => ({
      connect: engine.connect,
      disconnect: engine.disconnect,
      joinConversation: engine.joinConversation,
      leaveConversation: engine.leaveConversation,
      sendMessage: async (conversationId: string, text: string) =>
        engine.sendMessage({ conversationId, text }),
      typing: engine.sendTyping,
      stopTyping: engine.sendStopTyping,
    }),
    [engine],
  );
}
