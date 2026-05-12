import {
  HubConnection,
  HubConnectionBuilder,
  HttpTransportType,
} from "@microsoft/signalr";

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.replace(/\/+$/, "");
}

export function createOnlineUsersConnection(
  baseUrl: string,
  accessTokenFactory: () => string,
): HubConnection {
  const base = normalizeBaseUrl(baseUrl);
  return new HubConnectionBuilder()
    .withUrl(`${base}/hubs/online-users`, {
      accessTokenFactory,
      transport:
        HttpTransportType.WebSockets | HttpTransportType.ServerSentEvents,
    })
    .withAutomaticReconnect()
    .build();
}

export function createChatConnection(
  baseUrl: string,
  accessTokenFactory: () => string,
): HubConnection {
  const base = normalizeBaseUrl(baseUrl);
  return new HubConnectionBuilder()
    .withUrl(`${base}/hubs/chat`, {
      accessTokenFactory,
      transport:
        HttpTransportType.WebSockets | HttpTransportType.ServerSentEvents,
    })
    .withAutomaticReconnect()
    .build();
}
