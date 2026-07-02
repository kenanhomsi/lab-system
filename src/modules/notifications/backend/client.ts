import { injectable, injectFromBase } from "inversify";
import { BackendState } from "@/modules/axios";
import { NotificationsClient } from "../abstraction";
import { endpoint } from "./endpoint";
import {
  toUpstreamRegisterBody,
  toUpstreamSendBody,
  toUpstreamUnregisterBody,
} from "../upstream-body";
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
class Client extends NotificationsClient<BackendState> {
  async registerDeviceToken(params: RegisterDeviceTokenParams) {
    const { token, fcmToken, deviceType } = params;
    const res = await super
      .sharedPostJson({
        endpoint: endpoint.deviceTokens,
        body: toUpstreamRegisterBody({ fcmToken, deviceType }),
      })
      .withAuth(token)
      .perform();
    if (res.status !== 204 && res.status !== 200) {
      throw new Error(
        `Register device token failed with status ${String(res.status)}`,
      );
    }
    return res;
  }

  async unregisterDeviceToken(params: UnregisterDeviceTokenParams) {
    const { token, fcmToken } = params;
    const res = await super
      .sharedDeleteJson({
        endpoint: endpoint.deviceTokens,
        body: toUpstreamUnregisterBody(fcmToken),
      })
      .withAuth(token)
      .perform();
    if (res.status !== 204 && res.status !== 200) {
      throw new Error(
        `Unregister device token failed with status ${String(res.status)}`,
      );
    }
    return res;
  }

  async getNotifications(params: GetNotificationsParams) {
    const { token, page = 1, pageSize = 20 } = params;
    const res = await super
      .sharedGetJson({
        endpoint: appendQueryParams(endpoint.list, { page, pageSize }),
      })
      .withAuth(token)
      .perform<unknown>();
    return normalizeNotificationsResponse(res.data, page, pageSize);
  }

  async sendNotification(params: SendNotificationParams) {
    const { token, ...body } = params;
    const res = await super
      .sharedPostJson({
        endpoint: endpoint.send,
        body: toUpstreamSendBody(body),
      })
      .withAuth(token)
      .perform();
    if (res.status !== 204 && res.status !== 200) {
      throw new Error(
        `Send notification failed with status ${String(res.status)}`,
      );
    }
    return res;
  }

  async markNotificationRead(params: MarkNotificationReadParams) {
    const { token, id } = params;
    const res = await super
      .sharedPostJson({
        endpoint: endpoint.markRead(id),
        body: {},
      })
      .withAuth(token)
      .perform();
    if (res.status !== 204 && res.status !== 200) {
      throw new Error(
        `Mark notification read failed with status ${String(res.status)}`,
      );
    }
    return res;
  }
}

export { Client as NotificationsBackendClient };
