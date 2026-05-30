import { frontendContainer } from "@/container/frontend";
import {
  NotificationsFrontendService,
  notificationsModuleNames,
} from "@/modules/notifications";
import { clearStoredFcmToken, getStoredFcmToken } from "./fcm-token-storage";

const notificationsService =
  frontendContainer.get<NotificationsFrontendService>(
    notificationsModuleNames.service,
  );

/** Unregisters the stored FCM token from the backend before logout. */
export async function unregisterDeviceTokenIfStored(): Promise<void> {
  const fcmToken = getStoredFcmToken();
  if (!fcmToken) {
    return;
  }

  try {
    await notificationsService.unregisterDeviceToken({ fcmToken });
  } catch {
    // Best-effort cleanup; logout should still proceed.
  } finally {
    clearStoredFcmToken();
  }
}
