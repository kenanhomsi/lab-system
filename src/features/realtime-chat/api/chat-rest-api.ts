import { axiosInstanceFront } from "@/lib/clients/frontend-instance";
import type {
  ChatAttachment,
  ChatMessage,
  ChatUserSummary,
  Conversation,
  OnlineUser,
} from "../signalr/types";

/** Raw row from `GET /api/chat/online-users`. */
interface OnlineUserApiRow {
  userId: string;
  isOnline?: boolean;
  user?: ChatUserSummary;
  displayName?: string;
  fullName?: string;
  role?: string;
}

/** Normalize nested `{ userId, isOnline, user: ChatUserSummary }` API rows. */
export function normalizeOnlineUserApiRow(
  row: OnlineUserApiRow,
): OnlineUser | null {
  const userId = row.userId?.trim() || row.user?.userId?.trim();
  if (!userId) return null;

  const profile = row.user;
  const fullName = profile?.fullName?.trim() || row.fullName?.trim();
  const displayName = row.displayName?.trim() || fullName;
  const role = profile?.role?.trim() || row.role?.trim();

  return {
    userId,
    fullName,
    displayName,
    role,
    isOnline: row.isOnline ?? profile?.isOnline ?? true,
  };
}

/** Unwrap `{ success, message, data }` or `{ data }` BFF envelopes. */
function unwrapData<T>(payload: T | { data: T }): T {
  if (typeof payload === "object" && payload !== null && "data" in payload) {
    return (payload as { data: T }).data;
  }
  return payload as T;
}

function normalizeConversation(raw: Conversation & Record<string, unknown>): Conversation {
  const participants =
    Array.isArray(raw.participants)
      ? raw.participants
      : Array.isArray(raw.participantUsers)
        ? raw.participantUsers
        : undefined;

  return {
    ...raw,
    ...(participants ? { participants: participants as Conversation["participants"] } : {}),
  };
}

export async function listConversations(
  skip = 0,
  take = 50,
): Promise<Conversation[]> {
  const params = new URLSearchParams();
  params.append("skip", skip.toString());
  params.append("take", take.toString());
  const response = await axiosInstanceFront.get<
    Conversation[] | { data: Conversation[] }
  >(`/chat/conversations?${params.toString()}`);
  const data = unwrapData(response.data);
  return Array.isArray(data)
    ? data.map((row) =>
        normalizeConversation(row as Conversation & Record<string, unknown>),
      )
    : [];
}

export async function getMessages(
  conversationId: string,
  take = 50,
  beforeUtc?: string,
): Promise<ChatMessage[]> {
  const params = new URLSearchParams();
  params.append("take", take.toString());
  if (beforeUtc) {
    params.append("beforeUtc", beforeUtc);
  }
  const response = await axiosInstanceFront.get<
    ChatMessage[] | { data: ChatMessage[] }
  >(
    `/chat/conversations/${encodeURIComponent(conversationId)}/messages?${params.toString()}`,
  );
  const data = unwrapData(response.data);
  return Array.isArray(data) ? data : [];
}

export async function createDirectConversation(
  otherUserId: string,
): Promise<Conversation> {
  const response = await axiosInstanceFront.post<
    Conversation | { data: Conversation }
  >("/chat/conversations/direct", { otherUserId });
  return normalizeConversation(unwrapData(response.data) as Conversation & Record<string, unknown>);
}

export async function leaveConversation(conversationId: string): Promise<void> {
  await axiosInstanceFront.post(
    `/chat/conversations/${encodeURIComponent(conversationId)}/leave`,
  );
}

export async function markMessageRead(messageId: string): Promise<void> {
  await axiosInstanceFront.post(
    `/chat/messages/${encodeURIComponent(messageId)}/read`,
  );
}

export async function uploadAttachment(
  messageId: string,
  file: File,
): Promise<ChatAttachment> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axiosInstanceFront.post<
    ChatAttachment | { data: ChatAttachment }
  >(`/chat/messages/${encodeURIComponent(messageId)}/attachments`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return unwrapData(response.data);
}

export async function getOnlineUsers(): Promise<OnlineUser[]> {
  const response = await axiosInstanceFront.get<
    OnlineUserApiRow[] | { data: OnlineUserApiRow[] }
  >("/chat/online-users");
  const data = unwrapData(response.data);
  if (!Array.isArray(data)) return [];

  return data
    .map((row) => normalizeOnlineUserApiRow(row))
    .filter((user): user is OnlineUser => user !== null);
}
