import { injectable, injectFromBase } from "inversify";
import { BackendState } from "@/modules/axios";
import { NotificationsClient } from "../abstraction";
import { endpoint } from "./endpoint";
import {
  toUpstreamRegisterBody,
  toUpstreamUnregisterBody,
} from "../upstream-body";
import {
  RegisterDeviceTokenParams,
  UnregisterDeviceTokenParams,
} from "./types";

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
}

export { Client as NotificationsBackendClient };
