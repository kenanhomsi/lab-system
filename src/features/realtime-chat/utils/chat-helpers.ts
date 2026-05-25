import type {
  ChatMessage,
  Conversation,
  OnlineUser,
  ReceiveMessagePayload,
} from "../signalr/types";
import { useRealtimeChatStore } from "../store/realtime-chat-store";

export interface OnlineUserDisplay {
  userId: string;
  displayName: string;
  role?: string;
  isOnline?: boolean;
}

/** Resolve the best human-readable label for an online user record. */
export function resolveOnlineUserDisplayName(user: {
  userId: string;
  displayName?: string | null;
  fullName?: string | null;
}): string {
  return (
    user.displayName?.trim() ||
    user.fullName?.trim() ||
    user.userId
  );
}

/** Collect known names from chat data the current user is allowed to see. */
export function buildUserNameLookup(sources: {
  restUsers?: OnlineUser[] | null;
  conversations?: Conversation[];
  messagesByConversation?: Record<
    string,
    Array<{
      senderId: string;
      senderDisplayName?: string | null;
      senderFullName?: string | null;
    }>
  >;
}): Map<string, { displayName: string; role?: string }> {
  const map = new Map<string, { displayName: string; role?: string }>();

  const remember = (
    userId: string | undefined | null,
    name: string | undefined | null,
    role?: string,
  ) => {
    const id = userId?.trim();
    const label = name?.trim();
    if (!id || !label || label === id) return;

    const existing = map.get(id);
    if (!existing) {
      map.set(id, { displayName: label, role });
      return;
    }
    if (existing.displayName === id) {
      map.set(id, { displayName: label, role: existing.role ?? role });
    } else if (!existing.role && role) {
      map.set(id, { ...existing, role });
    }
  };

  for (const user of sources.restUsers ?? []) {
    remember(user.userId, resolveOnlineUserDisplayName(user), user.role);
  }

  for (const conversation of sources.conversations ?? []) {
    for (const participant of conversation.participants ?? []) {
      remember(
        participant.userId,
        participant.fullName ?? (participant as { displayName?: string }).displayName,
        participant.role,
      );
    }

    if (conversation.lastMessage?.sender) {
      remember(
        conversation.lastMessage.sender.userId ||
          conversation.lastMessage.senderUserId,
        conversation.lastMessage.sender.fullName,
      );
    }

    if (conversation.createdByUser) {
      remember(
        conversation.createdByUser.userId,
        conversation.createdByUser.fullName,
      );
    }
  }

  for (const messages of Object.values(sources.messagesByConversation ?? {})) {
    for (const message of messages) {
      remember(
        message.senderId,
        message.senderDisplayName ?? message.senderFullName,
      );
    }
  }

  return map;
}

function formatRoleLabel(role: string): string {
  return role.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function applyNameLookup(
  userId: string,
  displayName: string,
  role: string | undefined,
  lookup: Map<string, { displayName: string; role?: string }> | undefined,
): OnlineUserDisplay {
  const resolvedRole = role ?? lookup?.get(userId)?.role;

  if (displayName !== userId) {
    return { userId, displayName, role: resolvedRole };
  }

  const known = lookup?.get(userId);
  if (known?.displayName && known.displayName !== userId) {
    return {
      userId,
      displayName: known.displayName,
      role: resolvedRole ?? known.role,
    };
  }

  if (resolvedRole?.trim()) {
    return { userId, displayName: formatRoleLabel(resolvedRole), role: resolvedRole };
  }

  return { userId, displayName, role: resolvedRole };
}

/** Merge SignalR presence with REST profile data so the UI shows names, not IDs. */
export function mergeOnlineUsersForDisplay(
  signalrUsers: OnlineUser[],
  restUsers?: OnlineUser[] | null,
  currentUser?: { id: string; fullName?: string | null } | null,
  nameLookup?: Map<string, { displayName: string; role?: string }>,
): OnlineUserDisplay[] {
  const map = new Map<string, OnlineUserDisplay>();

  for (const user of signalrUsers) {
    const resolved = applyNameLookup(
      user.userId,
      resolveOnlineUserDisplayName(user),
      user.role,
      nameLookup,
    );
    map.set(user.userId, {
      ...resolved,
      isOnline: user.isOnline ?? true,
    });
  }

  if (restUsers) {
    for (const user of restUsers) {
      const name = resolveOnlineUserDisplayName(user);
      const existing = map.get(user.userId);
      const hasRealName = name !== user.userId;
      const merged = applyNameLookup(
        user.userId,
        hasRealName ? name : (existing?.displayName ?? name),
        user.role ?? existing?.role,
        nameLookup,
      );
      map.set(user.userId, {
        ...merged,
        isOnline: user.isOnline ?? existing?.isOnline ?? true,
      });
    }
  }

  if (currentUser?.id) {
    const selfName = currentUser.fullName?.trim();
    if (selfName) {
      const existing = map.get(currentUser.id);
      map.set(currentUser.id, {
        userId: currentUser.id,
        displayName: selfName,
        role: existing?.role,
      });
    }
  }

  // Include known users from lookup who are online via REST but not yet in SignalR.
  if (restUsers) {
    for (const user of restUsers) {
      if (user.isOnline === false || map.has(user.userId)) continue;
      const merged = applyNameLookup(
        user.userId,
        resolveOnlineUserDisplayName(user),
        user.role,
        nameLookup,
      );
      map.set(user.userId, merged);
    }
  }

  return Array.from(map.values()).sort((a, b) =>
    a.displayName.localeCompare(b.displayName),
  );
}

const FILE_MESSAGE_WAIT_MS = 30_000;

/**
 * Waits until a new message from the current user appears in the store
 * (after SignalR `ReceiveMessage`), so the client can upload an attachment.
 */
export function waitForOwnNewMessage(params: {
  conversationId: string;
  currentUserId: string;
  knownMessageIds: Set<string>;
}): Promise<ReceiveMessagePayload> {
  const { conversationId, currentUserId, knownMessageIds } = params;
  const normalizedConversationId = conversationId.trim();
  const normalizedUserId = currentUserId.trim();

  return new Promise((resolve, reject) => {
    let unsub: () => void = () => {};

    const tryResolve = () => {
      const msgs =
        useRealtimeChatStore.getState().messagesByConversation[
          normalizedConversationId
        ] ?? [];
      const found = [...msgs].reverse().find(
        (m) =>
          !knownMessageIds.has(m.messageId) &&
          m.senderId.trim() === normalizedUserId,
      );
      if (found) {
        clearTimeout(timeout);
        unsub();
        resolve(found);
      }
    };

    const timeout = setTimeout(() => {
      unsub();
      reject(new Error("Timed out waiting for message confirmation"));
    }, FILE_MESSAGE_WAIT_MS);

    unsub = useRealtimeChatStore.subscribe(tryResolve);
    tryResolve();
  });
}

/** Convert REST history row to the shape used by the realtime message store/UI. */
export function chatMessageToReceivePayload(
  message: ChatMessage,
): ReceiveMessagePayload {
  const messageType =
    typeof message.messageType === "number"
      ? message.messageType
      : message.messageType === "Text"
        ? 1
        : message.messageType === "File"
          ? 2
          : 0;

  const firstAttachment = message.attachments?.[0];

  return {
    messageId: message.id,
    conversationId: message.conversationId,
    senderId: message.senderId,
    senderDisplayName:
      message.senderDisplayName?.trim() ||
      message.senderFullName?.trim() ||
      null,
    text: message.text ?? "",
    messageType,
    fileUrl: message.fileUrl ?? firstAttachment?.fileUrl ?? null,
    attachmentFileName: firstAttachment?.fileName ?? null,
    attachmentFileType: firstAttachment?.fileType ?? null,
    replyToId: message.replyToId ?? null,
    createdAtUtc: message.createdAtUtc,
    isRead: message.isRead,
  };
}

export interface ConversationTitleOptions {
  messages?: Array<{
    senderId: string;
    senderDisplayName?: string | null;
  }>;
  onlineUsersById?: Record<
    string,
    { displayName?: string | null; fullName?: string | null }
  >;
  nameLookup?: Map<string, { displayName: string; role?: string }>;
}

function resolveParticipantName(
  userId: string,
  fullName?: string | null,
  displayName?: string | null,
  options?: ConversationTitleOptions,
): string {
  const direct = displayName?.trim() || fullName?.trim();
  if (direct) return direct;

  const known = options?.nameLookup?.get(userId)?.displayName?.trim();
  if (known) return known;

  const online = options?.onlineUsersById?.[userId];
  const fromOnline =
    online?.displayName?.trim() || online?.fullName?.trim();
  if (fromOnline) return fromOnline;

  return userId;
}

/** Resolve a human-readable title for a conversation row. */
export function getConversationTitle(
  conversation: {
    id: string;
    type: "Direct" | "Group";
    title?: string | null;
    participants?: Array<{
      userId: string;
      fullName?: string | null;
      displayName?: string | null;
    }>;
    lastMessage?: {
      text?: string | null;
      messageType?: string | number;
      createdAtUtc: string;
      senderUserId?: string;
      sender: { userId: string; fullName: string };
    } | null;
    createdByUser: { userId: string; fullName: string };
  },
  currentUserId: string,
  options?: ConversationTitleOptions,
): string {
  const title = conversation.title?.trim();
  if (conversation.type === "Group" && title && title !== "string") {
    return title;
  }

  const normalizedCurrentUserId = currentUserId.trim();
  const otherCandidates: Array<{
    userId: string;
    fullName?: string | null;
    displayName?: string | null;
  }> = [];

  for (const participant of conversation.participants ?? []) {
    if (participant.userId?.trim()) {
      otherCandidates.push(participant);
    }
  }

  if (conversation.lastMessage?.sender.userId || conversation.lastMessage?.senderUserId) {
    otherCandidates.push({
      userId:
        conversation.lastMessage.sender.userId ||
        conversation.lastMessage.senderUserId ||
        "",
      fullName: conversation.lastMessage.sender.fullName,
    });
  }

  if (conversation.createdByUser.userId) {
    otherCandidates.push(conversation.createdByUser);
  }

  if (options?.messages?.length) {
    for (let index = options.messages.length - 1; index >= 0; index -= 1) {
      const message = options.messages[index];
      if (!message?.senderId) continue;
      otherCandidates.push({
        userId: message.senderId,
        displayName: message.senderDisplayName,
      });
    }
  }

  for (const candidate of otherCandidates) {
    const userId = candidate.userId.trim();
    if (!userId || userId === normalizedCurrentUserId) continue;

    const name = resolveParticipantName(
      userId,
      candidate.fullName,
      candidate.displayName,
      options,
    );
    if (name !== userId) return name;
  }

  if (title && title !== "string") {
    return title;
  }
  return conversation.id.slice(0, 8);
}
