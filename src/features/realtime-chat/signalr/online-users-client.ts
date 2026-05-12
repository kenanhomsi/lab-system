import type { HubConnection } from "@microsoft/signalr";
import type {
  OnlineUsersListPayload,
  UserOfflinePayload,
  UserOnlinePayload,
} from "./types";

export interface OnlineUsersClientHandlers {
  onUserOnline: (payload: UserOnlinePayload) => void;
  onUserOffline: (payload: UserOfflinePayload) => void;
  onOnlineUsersList: (payload: OnlineUsersListPayload) => void;
}

export function registerOnlineUsersHandlers(
  connection: HubConnection,
  handlers: OnlineUsersClientHandlers,
): () => void {
  const { onUserOnline, onUserOffline, onOnlineUsersList } = handlers;
  connection.on("UserOnline", onUserOnline);
  connection.on("UserOffline", onUserOffline);
  connection.on("OnlineUsersList", onOnlineUsersList);
  return () => {
    connection.off("UserOnline", onUserOnline);
    connection.off("UserOffline", onUserOffline);
    connection.off("OnlineUsersList", onOnlineUsersList);
  };
}

export async function invokeGetOnlineUsers(
  connection: HubConnection,
): Promise<void> {
  await connection.invoke("GetOnlineUsers");
}

export async function invokeGetOnlineUsersByRole(
  connection: HubConnection,
  role: string,
): Promise<void> {
  await connection.invoke("GetOnlineUsersByRole", role);
}
