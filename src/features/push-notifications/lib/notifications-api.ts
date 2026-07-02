import { frontendContainer } from "@/container/frontend";
import {
  NotificationsFrontendService,
  notificationsModuleNames,
} from "@/modules/notifications";

export function getNotificationsService(): NotificationsFrontendService {
  return frontendContainer.get<NotificationsFrontendService>(
    notificationsModuleNames.service,
  );
}
