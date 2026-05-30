import { Container } from "inversify";
import {
  notificationsModuleNames,
  NotificationsBackendClient,
  NotificationsBackendService,
  NotificationsFrontendClient,
  NotificationsFrontendService,
} from "@/modules/notifications";

const bindFront = (container: Container) => {
  container
    .bind(notificationsModuleNames.client)
    .to(NotificationsFrontendClient);
  container
    .bind(notificationsModuleNames.service)
    .to(NotificationsFrontendService);
  return container;
};

const bindBack = (container: Container) => {
  container.bind(notificationsModuleNames.client).to(NotificationsBackendClient);
  container
    .bind(notificationsModuleNames.service)
    .to(NotificationsBackendService);
  return container;
};

export {
  bindBack as bindBackNotificationsDependencies,
  bindFront as bindFrontNotificationsDependencies,
};
