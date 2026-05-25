export type ConnectionStatusLabel = "Disconnected" | "Connecting" | "Connected";

export type SignalRHubKind = "online-users" | "chat";

export interface ChatUserSummary {
  userId: string;
  fullName: string;
  email?: string;
  phoneNumber?: string;
  role?: string;
  isOnline?: boolean;
}

export interface Conversation {
  id: string;
  type: "Direct" | "Group";
  title?: string | null;
  createdAtUtc?: string;
  createdByUserId?: string;
  /** When the API returns conversation members, used to label direct chats. */
  participants?: ChatUserSummary[];
  unreadCount: number;
  lastMessage?: {
    text?: string | null;
    messageType?: string | number;
    createdAtUtc: string;
    senderUserId?: string;
    sender: { userId: string; fullName: string };
  } | null;
  createdByUser: { userId: string; fullName: string };
}

export interface ChatAttachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedAtUtc: string;
  uploadedByUserId: string;
  uploadedByUser?: ChatUserSummary;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderFullName?: string | null;
  senderDisplayName?: string | null;
  text?: string | null;
  messageType: number | string;
  fileUrl?: string | null;
  replyToId?: string | null;
  createdAtUtc: string;
  isRead: boolean;
  attachments?: ChatAttachment[];
}

export interface OnlineUser {
  userId: string;
  displayName?: string;
  fullName?: string;
  role?: string;
  connectionId?: string;
  isOnline?: boolean;
}

export interface UserOnlinePayload {
  userId: string;
  displayName?: string;
  fullName?: string;
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
  attachmentFileName?: string | null;
  attachmentFileType?: string | null;
  replyToId?: string | null;
  createdAtUtc: string;
  isRead?: boolean;
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
