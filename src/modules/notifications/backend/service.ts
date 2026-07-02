import { inject, injectable } from "inversify";
import { notificationsModuleNames } from "../names";
import { NotificationsBackendClient } from "./client";
import type {
  GetNotificationsParams,
  MarkNotificationReadParams,
  RegisterDeviceTokenParams,
  SendNotificationParams,
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

  async getNotifications(params: GetNotificationsParams) {
    return this.Client.getNotifications(params);
  }

  async sendNotification(params: SendNotificationParams) {
    return this.Client.sendNotification(params);
  }

  async markNotificationRead(params: MarkNotificationReadParams) {
    return this.Client.markNotificationRead(params);
  }
}

export { Service as NotificationsBackendService };
