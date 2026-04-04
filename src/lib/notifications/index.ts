export type NotificationSupport = "granted" | "denied" | "default" | "unsupported";

export async function requestNotificationPermission(): Promise<NotificationSupport> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "unsupported";
  }
  if (Notification.permission === "granted") {
    return "granted";
  }
  if (Notification.permission === "denied") {
    return "denied";
  }
  const result = await Notification.requestPermission();
  return result === "granted"
    ? "granted"
    : result === "denied"
      ? "denied"
      : "default";
}

export function showNotification(title: string, body: string): void {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return;
  }
  if (Notification.permission !== "granted") {
    return;
  }
  new Notification(title, { body });
}

export function registerServiceWorker(): void {
  console.log("Service worker registration placeholder");
}
