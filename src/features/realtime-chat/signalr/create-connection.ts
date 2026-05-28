import {
  HubConnection,
  HubConnectionBuilder,
  HttpTransportType,
} from "@microsoft/signalr";
import { SIGNALR_HUB_PROXY_PREFIX } from "@/lib/api/hub-proxy";

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
  return new HubConnectionBuilder()
    .withUrl(
      hubEndpoint(baseUrl, `${SIGNALR_HUB_PROXY_PREFIX}/online-users`),
      {
        accessTokenFactory,
        // HTTP-only transports: proxied through `/api/hubs/*` at runtime.
        transport:
          HttpTransportType.LongPolling | HttpTransportType.ServerSentEvents,
      },
    )
    .withAutomaticReconnect()
    .build();
}

export function createChatConnection(
  baseUrl: string,
  accessTokenFactory: () => string,
): HubConnection {
  return new HubConnectionBuilder()
    .withUrl(hubEndpoint(baseUrl, `${SIGNALR_HUB_PROXY_PREFIX}/chat`), {
      accessTokenFactory,
      transport:
        HttpTransportType.LongPolling | HttpTransportType.ServerSentEvents,
    })
    .withAutomaticReconnect()
    .build();
}
