import { isAxiosError } from "axios";
import { extractErrorMessage } from "@/lib/error";
import { frontendContainer } from "@/container/frontend";
import {
  NotificationsFrontendService,
  notificationsModuleNames,
} from "@/modules/notifications";
import { setStoredFcmToken } from "./fcm-token-storage";
import { requestFcmToken } from "../firebase/messaging";
import {
  requestNotificationPermission,
  type NotificationSupport,
} from "./native-notification";

const notificationsService =
  frontendContainer.get<NotificationsFrontendService>(
    notificationsModuleNames.service,
  );

export type RegisterPushResult =
  | { ok: true; fcmToken: string }
  | {
      ok: false;
      reason:
        | "permission_denied"
        | "permission_default"
        | "token_failed"
        | "api_failed";
      permission?: NotificationSupport;
      message?: string;
      httpStatus?: number;
    };

/**
 * Requests browser permission, obtains FCM token, and registers it with the backend.
 */
export async function registerDeviceTokenWithBackend(): Promise<RegisterPushResult> {
  const permission = await requestNotificationPermission();
  if (permission === "denied") {
    return { ok: false, reason: "permission_denied", permission };
  }
  if (permission !== "granted") {
    return { ok: false, reason: "permission_default", permission };
  }

  const fcmToken = await requestFcmToken();
  if (!fcmToken) {
    return {
      ok: false,
      reason: "token_failed",
      message:
        "Could not obtain FCM token. Check NEXT_PUBLIC_FIREBASE_VAPID_KEY (Web Push key pair in Firebase Console).",
    };
  }

  try {
    await notificationsService.registerDeviceToken({
      fcmToken,
      deviceType: "Web",
    });
    setStoredFcmToken(fcmToken);

    if (process.env.NODE_ENV === "development") {
      console.info("[FCM] device token registered", fcmToken);
    }

    return { ok: true, fcmToken };
  } catch (error: unknown) {
    const message = extractErrorMessage(
      error,
      "Failed to register device token",
    );
    const status = isAxiosError(error) ? error.response?.status : undefined;
    return {
      ok: false,
      reason: "api_failed",
      message,
      httpStatus: status,
    };
  }
}
