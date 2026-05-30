import { inject, injectable } from "inversify";
import { notificationsModuleNames } from "../names";
import { NotificationsBackendClient } from "./client";
import {
  RegisterDeviceTokenParams,
  UnregisterDeviceTokenParams,
} from "./types";

@injectable()
class Service {
  @inject(notificationsModuleNames.client)
  private Client: NotificationsBackendClient;

  async registerDeviceToken(params: RegisterDeviceTokenParams) {
    return this.Client.registerDeviceToken(params);
  }

  async unregisterDeviceToken(params: UnregisterDeviceTokenParams) {
    return this.Client.unregisterDeviceToken(params);
  }
}

export { Service as NotificationsBackendService };
