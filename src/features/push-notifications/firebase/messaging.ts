import {
  getMessaging,
  getToken,
  isSupported,
  onMessage,
  type MessagePayload,
  type Messaging,
} from "firebase/messaging";
import {
  getFirebaseApp,
  isFirebaseConfigured,
  readFirebaseVapidKey,
} from "./config";

const SERVICE_WORKER_URL = "/firebase-messaging-sw.js";

export function isPushEnvironmentSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "Notification" in window &&
    "PushManager" in window
  );
}

export async function isFirebaseMessagingSupported(): Promise<boolean> {
  if (!isPushEnvironmentSupported() || !isFirebaseConfigured()) {
    return false;
  }
  try {
    return await isSupported();
  } catch {
    return false;
  }
}

export async function registerMessagingServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!isPushEnvironmentSupported()) {
    return null;
  }

  try {
    return await navigator.serviceWorker.register(SERVICE_WORKER_URL, {
      scope: "/",
    });
  } catch {
    return null;
  }
}

let messagingInstance: Messaging | null = null;

export async function getFirebaseMessaging(): Promise<Messaging | null> {
  if (!(await isFirebaseMessagingSupported())) {
    return null;
  }

  if (messagingInstance) {
    return messagingInstance;
  }

  const app = getFirebaseApp();
  if (!app) {
    return null;
  }

  messagingInstance = getMessaging(app);
  return messagingInstance;
}

export async function requestFcmToken(): Promise<string | null> {
  const vapidKey = readFirebaseVapidKey();
  if (!vapidKey) {
    return null;
  }

  const messaging = await getFirebaseMessaging();
  if (!messaging) {
    return null;
  }

  const registration = await registerMessagingServiceWorker();
  if (!registration) {
    return null;
  }

  try {
    const token = await getToken(messaging, {
      vapidKey,
      serviceWorkerRegistration: registration,
    });
    return token?.trim() || null;
  } catch {
    return null;
  }
}

export async function subscribeToForegroundMessages(
  handler: (payload: MessagePayload) => void,
): Promise<(() => void) | null> {
  const messaging = await getFirebaseMessaging();
  if (!messaging) {
    return null;
  }

  return onMessage(messaging, handler);
}
