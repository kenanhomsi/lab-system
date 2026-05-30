"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useSession } from "next-auth/react";
import { notifications } from "@mantine/notifications";
import { useTranslations } from "next-intl";
import type { MessagePayload } from "firebase/messaging";
import {
  isFirebaseConfigured,
  isFirebasePublicConfigReady,
  isFirebaseVapidKeyReady,
} from "../firebase/config";
import {
  isFirebaseMessagingSupported,
  subscribeToForegroundMessages,
} from "../firebase/messaging";
import { getStoredFcmToken } from "../lib/fcm-token-storage";
import { registerDeviceTokenWithBackend } from "../lib/register-device-token";
import {
  readNotificationPermission,
  showNativeNotification,
} from "../lib/native-notification";

export type PushNotificationStatus =
  | "loading"
  | "not_configured"
  | "unsupported"
  | "default"
  | "denied"
  | "registered"
  | "registering";

type PushNotificationsContextValue = {
  status: PushNotificationStatus;
  lastError: string | null;
  enablePush: () => Promise<boolean>;
};

const PushNotificationsContext =
  createContext<PushNotificationsContextValue | null>(null);

function resolveMessageContent(payload: MessagePayload): {
  title: string;
  body: string;
} {
  const title =
    payload.notification?.title?.trim() ||
    (typeof payload.data?.title === "string" ? payload.data.title : "") ||
    "";
  const body =
    payload.notification?.body?.trim() ||
    (typeof payload.data?.body === "string" ? payload.data.body : "") ||
    "";
  return { title, body };
}

async function resolveInitialStatus(): Promise<PushNotificationStatus> {
  if (!isFirebasePublicConfigReady()) {
    return "not_configured";
  }
  if (!isFirebaseVapidKeyReady()) {
    return "not_configured";
  }
  if (!(await isFirebaseMessagingSupported())) {
    return "unsupported";
  }

  const permission = readNotificationPermission();
  if (permission === "denied") {
    return "denied";
  }
  if (permission === "granted" && getStoredFcmToken()) {
    return "registered";
  }
  if (permission === "granted") {
    return "default";
  }
  return "default";
}

/**
 * Provides push notification state and actions for the dashboard and navbar.
 */
export function PushNotificationsProvider({ children }: { children: ReactNode }) {
  const { status: sessionStatus } = useSession();
  const t = useTranslations("pushNotifications");
  const [status, setStatus] = useState<PushNotificationStatus>("loading");
  const [lastError, setLastError] = useState<string | null>(null);
  const foregroundBoundRef = useRef(false);

  const bindForegroundListener = useCallback(async () => {
    if (foregroundBoundRef.current) {
      return;
    }

    const unsubscribe = await subscribeToForegroundMessages((payload) => {
      const { title, body } = resolveMessageContent(payload);
      const displayTitle = title || t("defaultTitle");
      const displayBody = body || t("defaultBody");

      notifications.show({
        title: displayTitle,
        message: displayBody,
        color: "blue",
      });
      showNativeNotification(displayTitle, displayBody);
    });

    if (unsubscribe) {
      foregroundBoundRef.current = true;
    }
  }, [t]);

  const enablePush = useCallback(async (): Promise<boolean> => {
    if (!isFirebaseConfigured()) {
      setStatus("not_configured");
      setLastError(t("missingConfig"));
      return false;
    }

    setStatus("registering");
    setLastError(null);

    const result = await registerDeviceTokenWithBackend();

    if (!result.ok) {
      if (result.reason === "permission_denied") {
        setStatus("denied");
        setLastError(t("permissionDenied"));
      } else if (result.reason === "permission_default") {
        setStatus("default");
        setLastError(t("permissionNeeded"));
      } else {
        setStatus(
          result.reason === "token_failed" ? "not_configured" : "default",
        );
        if (result.httpStatus === 500) {
          setLastError(
            `${result.message ?? t("registerFailed")}. ${t("backendServerError")}`,
          );
        } else {
          setLastError(result.message ?? t("registerFailed"));
        }
      }
      return false;
    }

    setStatus("registered");
    await bindForegroundListener();
    return true;
  }, [bindForegroundListener, t]);

  useEffect(() => {
    if (sessionStatus !== "authenticated") {
      return;
    }

    let cancelled = false;

    const init = async () => {
      const initial = await resolveInitialStatus();
      if (cancelled) {
        return;
      }
      setStatus(initial);

      if (initial === "registered") {
        await bindForegroundListener();
        return;
      }

      if (initial === "default" && isFirebaseConfigured()) {
        if (readNotificationPermission() === "granted") {
          const ok = await enablePush();
          if (!cancelled && !ok) {
            setStatus("default");
          }
        }
      }
    };

    void init();

    return () => {
      cancelled = true;
    };
  }, [sessionStatus, bindForegroundListener, enablePush]);

  const value = useMemo(
    () => ({ status, lastError, enablePush }),
    [status, lastError, enablePush],
  );

  return (
    <PushNotificationsContext.Provider value={value}>
      {children}
    </PushNotificationsContext.Provider>
  );
}

export function usePushNotificationsContext(): PushNotificationsContextValue {
  const ctx = useContext(PushNotificationsContext);
  if (!ctx) {
    throw new Error(
      "usePushNotificationsContext must be used within PushNotificationsProvider",
    );
  }
  return ctx;
}
