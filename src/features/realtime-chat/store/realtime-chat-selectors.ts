import type { OnlineUser, ReceiveMessagePayload } from "../signalr/types";
import type { RealtimeChatState } from "./realtime-chat-store";

const GLOBAL_TYPING_CONVERSATION = "__global__";

export function selectOnlineUsersUnique(state: RealtimeChatState): OnlineUser[] {
  return Object.values(state.onlineUsersById).sort((a, b) =>
    a.userId.localeCompare(b.userId),
  );
}

export function selectActiveMessages(
  state: RealtimeChatState,
): ReceiveMessagePayload[] {
  if (!state.activeConversationId) return [];
  return state.messagesByConversation[state.activeConversationId] ?? [];
}

export function selectActiveTypingUsers(state: RealtimeChatState): string[] {
  if (!state.activeConversationId) return [];
  const activeTyping = state.typingByConversation[state.activeConversationId] ?? {};
  const globalTyping = state.typingByConversation[GLOBAL_TYPING_CONVERSATION] ?? {};
  const out = new Set<string>();
  for (const userId of Object.keys(activeTyping)) out.add(userId);
  for (const userId of Object.keys(globalTyping)) out.add(userId);
  return [...out];
}

export { GLOBAL_TYPING_CONVERSATION };
