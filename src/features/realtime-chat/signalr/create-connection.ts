import {
  HubConnection,
  HubConnectionBuilder,
  HttpTransportType,
} from "@microsoft/signalr";

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.replace(/\/+$/, "");
}

/** Root-absolute hub URL so next-intl locale paths cannot affect negotiation. */
function hubEndpoint(baseUrl: string, hubPath: string): string {
  const base = normalizeBaseUrl(baseUrl);
  const path = hubPath.startsWith("/") ? hubPath : `/${hubPath}`;
  if (!base) return path;
  return new URL(path, `${base}/`).href;
}

export function createOnlineUsersConnection(
  baseUrl: string,
  accessTokenFactory: () => string,
): HubConnection {
  console.log('the baseUrl here is', baseUrl)
  return new HubConnectionBuilder()
    .withUrl(hubEndpoint(baseUrl, "/hubs/online-users"), {
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
  return new HubConnectionBuilder()
    .withUrl(hubEndpoint(baseUrl, "/hubs/chat"), {
      accessTokenFactory,
      transport:
        HttpTransportType.WebSockets | HttpTransportType.ServerSentEvents,
    })
    .withAutomaticReconnect()
    .build();
}
