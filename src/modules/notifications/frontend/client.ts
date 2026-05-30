import { injectable, injectFromBase } from "inversify";
import { AxiosState } from "@/modules/axios";
import { NotificationsClient } from "../abstraction";
import { endpoint } from "./endpoint";
import {
  RegisterDeviceTokenParams,
  UnregisterDeviceTokenParams,
} from "./types";

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
}

export { Client as NotificationsFrontendClient };
