import { inject, injectable } from "inversify";
import { notificationsModuleNames } from "../names";
import { NotificationsFrontendClient } from "./client";
import {
  RegisterDeviceTokenParams,
  UnregisterDeviceTokenParams,
} from "./types";

@injectable()
class Service {
  @inject(notificationsModuleNames.client)
  private Client: NotificationsFrontendClient;

  async registerDeviceToken(params: RegisterDeviceTokenParams) {
    return this.Client.registerDeviceToken(params);
  }

  async unregisterDeviceToken(params: UnregisterDeviceTokenParams) {
    return this.Client.unregisterDeviceToken(params);
  }
}

export { Service as NotificationsFrontendService };
