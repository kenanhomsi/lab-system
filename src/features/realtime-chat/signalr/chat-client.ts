import type { HubConnection } from "@microsoft/signalr";
import type {
  ConversationUpdatedPayload,
  ReadReceiptPayload,
  ReceiveMessagePayload,
  SendMessageRequest,
  StopTypingPayload,
  TypingPayload,
} from "./types";

export interface ChatClientHandlers {
  onReceiveMessage: (payload: ReceiveMessagePayload) => void;
  onTyping: (payload: TypingPayload) => void;
  onStopTyping: (payload: StopTypingPayload) => void;
  onReadReceipt: (payload: ReadReceiptPayload) => void;
  onConversationUpdated: (payload: ConversationUpdatedPayload) => void;
}

export function registerChatHandlers(
  connection: HubConnection,
  handlers: ChatClientHandlers,
): () => void {
  const {
    onReceiveMessage,
    onTyping,
    onStopTyping,
    onReadReceipt,
    onConversationUpdated,
  } = handlers;
  connection.on("ReceiveMessage", onReceiveMessage);
  connection.on("Typing", onTyping);
  connection.on("StopTyping", onStopTyping);
  connection.on("ReadReceipt", onReadReceipt);
  connection.on("ConversationUpdated", onConversationUpdated);

  return () => {
    connection.off("ReceiveMessage", onReceiveMessage);
    connection.off("Typing", onTyping);
    connection.off("StopTyping", onStopTyping);
    connection.off("ReadReceipt", onReadReceipt);
    connection.off("ConversationUpdated", onConversationUpdated);
  };
}

export async function invokeJoinConversation(
  connection: HubConnection,
  conversationId: string,
): Promise<void> {
  await connection.invoke("JoinConversation", conversationId);
}

export async function invokeLeaveConversation(
  connection: HubConnection,
  conversationId: string,
): Promise<void> {
  await connection.invoke("LeaveConversation", conversationId);
}

export async function invokeSendMessage(
  connection: HubConnection,
  conversationId: string,
  text: string,
): Promise<void> {
  const request: SendMessageRequest = {
    conversationId,
    text,
    messageType: 1,
    fileUrl: null,
    replyToId: null,
  };
  await connection.invoke("SendMessage", request);
}

export async function invokeTyping(
  connection: HubConnection,
  conversationId: string,
): Promise<void> {
  await connection.invoke("Typing", conversationId);
}

export async function invokeStopTyping(
  connection: HubConnection,
  conversationId: string,
): Promise<void> {
  await connection.invoke("StopTyping", conversationId);
}
