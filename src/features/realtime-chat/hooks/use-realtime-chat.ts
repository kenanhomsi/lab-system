"use client";

import { useEffect, useMemo, useState } from "react";
import { useSessionUserStore } from "@/stores/session-user-store";
import { axiosInstanceFront } from "@/lib/clients/frontend-instance";
import { useRealtimeChatEngine } from "./use-realtime-chat-engine";

function resolveClientHubBaseUrl(): string {
  if (typeof window === "undefined") return "";
  return window.location.origin;
}

export interface UseRealtimeChatFacade {
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  joinConversation: (conversationId: string) => Promise<void>;
  leaveConversation: (conversationId: string) => Promise<void>;
  sendMessage: (
    conversationId: string,
    text: string,
    messageType?: number,
  ) => Promise<void>;
  typing: (conversationId: string) => Promise<void>;
  stopTyping: (conversationId: string) => Promise<void>;
}

type NegotiateResponse = {
  hubBaseUrl: string;
  accessToken: string | null;
};

export function useRealtimeChat(): UseRealtimeChatFacade {
  const sessionUser = useSessionUserStore((state) => state.user);
  const [hubBaseUrl, setHubBaseUrl] = useState(resolveClientHubBaseUrl);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    axiosInstanceFront
      .get<NegotiateResponse>("/chat/negotiate")
      .then((res) => {
        if (cancelled) return;
        const url = res.data?.hubBaseUrl?.trim();
        if (url) setHubBaseUrl(url);
        setAccessToken(res.data?.accessToken ?? null);
      })
      .catch(() => {
        if (!cancelled) setHubBaseUrl(resolveClientHubBaseUrl());
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const engine = useRealtimeChatEngine({
    baseUrl: hubBaseUrl,
    accessToken,
    currentUserId: sessionUser?.id ?? null,
  });

  return useMemo(
    () => ({
      connect: engine.connect,
      disconnect: engine.disconnect,
      joinConversation: engine.joinConversation,
      leaveConversation: engine.leaveConversation,
      sendMessage: async (
        conversationId: string,
        text: string,
        messageType?: number,
      ) => engine.sendMessage({ conversationId, text, messageType }),
      typing: engine.sendTyping,
      stopTyping: engine.sendStopTyping,
    }),
    [engine],
  );
}
