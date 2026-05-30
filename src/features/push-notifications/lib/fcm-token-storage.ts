const FCM_TOKEN_STORAGE_KEY = "doctor_system_fcm_device_token";

export function getStoredFcmToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  const token = window.localStorage.getItem(FCM_TOKEN_STORAGE_KEY)?.trim();
  return token || null;
}

export function setStoredFcmToken(token: string): void {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(FCM_TOKEN_STORAGE_KEY, token);
}

export function clearStoredFcmToken(): void {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.removeItem(FCM_TOKEN_STORAGE_KEY);
}
