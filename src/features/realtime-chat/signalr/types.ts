export type ConnectionStatusLabel = "Disconnected" | "Connecting" | "Connected";

export type SignalRHubKind = "online-users" | "chat";

export interface OnlineUser {
  userId: string;
  displayName?: string;
  role?: string;
  connectionId?: string;
}

export interface UserOnlinePayload {
  userId: string;
  displayName?: string;
  role?: string;
  connectionId?: string;
}

export interface UserOfflinePayload {
  userId: string;
  connectionId?: string;
}

export type OnlineUsersListPayload = OnlineUser[] | readonly OnlineUser[];

export interface SendMessageRequest {
  conversationId: string;
  text: string;
  messageType: number;
  fileUrl: string | null;
  replyToId: string | null;
}

export interface ReceiveMessagePayload {
  messageId: string;
  conversationId: string;
  senderId: string;
  senderDisplayName?: string | null;
  text?: string | null;
  messageType: number;
  fileUrl?: string | null;
  replyToId?: string | null;
  createdAtUtc: string;
}

export interface TypingPayload {
  userId: string;
  isTyping: boolean;
  conversationId?: string;
}

export interface StopTypingPayload {
  userId: string;
  isTyping: boolean;
  conversationId?: string;
}

export interface ReadReceiptPayload {
  conversationId: string;
  messageId?: string;
  userId?: string;
  readAt?: string;
}

export type ConversationUpdatedPayload = Readonly<
  Partial<Record<string, unknown>> & {
    conversationId?: string;
    reason?: string;
    lastMessageAt?: string;
    unreadCount?: number;
  }
>;

export interface RealtimeLogEntry {
  id: string;
  at: number;
  hub: SignalRHubKind | "app";
  event: string;
  detail?: string;
  payload?: unknown;
}
