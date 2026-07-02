import { injectable, injectFromBase } from "inversify";
import { AxiosState } from "@/modules/axios";
import { NotificationsClient } from "../abstraction";
import { endpoint } from "./endpoint";
import { normalizeNotificationsResponse } from "../normalize";
import type {
  GetNotificationsParams,
  MarkNotificationReadParams,
  RegisterDeviceTokenParams,
  SendNotificationParams,
  UnregisterDeviceTokenParams,
} from "./types";

const appendQueryParams = (
  path: string,
  query?: Record<string, string | number | boolean | undefined>,
): string => {
  if (!query) return path;
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  });
  const qs = params.toString();
  return qs ? `${path}?${qs}` : path;
};

@injectable()
@injectFromBase({ extendProperties: true })
class Client extends NotificationsClient<AxiosState> {
  async registerDeviceToken(params: RegisterDeviceTokenParams) {
    const res = await super
      .sharedPostJson({
        endpoint: endpoint.deviceTokens,
        body: params,
      })
      .perform();
    return res;
  }

  async unregisterDeviceToken(params: UnregisterDeviceTokenParams) {
    const res = await super
      .sharedDeleteJson({
        endpoint: endpoint.deviceTokens,
        body: { fcmToken: params.fcmToken },
      })
      .perform();
    return res;
  }

  async getNotifications(params?: GetNotificationsParams) {
    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? 20;
    const res = await super
      .sharedGetJson({
        endpoint: appendQueryParams(endpoint.list, { page, pageSize }),
      })
      .perform<unknown>();
    return normalizeNotificationsResponse(res.data, page, pageSize);
  }

  async sendNotification(params: SendNotificationParams) {
    const res = await super
      .sharedPostJson({
        endpoint: endpoint.send,
        body: params,
      })
      .perform();
    return res;
  }

  async markNotificationRead(params: MarkNotificationReadParams) {
    const res = await super
      .sharedPostJson({
        endpoint: endpoint.markRead(params.id),
        body: {},
      })
      .perform();
    return res;
  }
}

export { Client as NotificationsFrontendClient };
