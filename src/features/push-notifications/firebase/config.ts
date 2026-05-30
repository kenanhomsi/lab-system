import { getApps, initializeApp, type FirebaseApp } from "firebase/app";

export type FirebasePublicConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
};

/** Reads Firebase web config from `NEXT_PUBLIC_FIREBASE_*` env vars. */
export function readFirebasePublicConfig(): FirebasePublicConfig | null {
  const config: FirebasePublicConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim() ?? "",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN?.trim() ?? "",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim() ?? "",
    storageBucket:
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?.trim() ?? "",
    messagingSenderId:
      process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID?.trim() ?? "",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID?.trim() ?? "",
  };

  const values = Object.values(config);
  if (values.some((value) => !value)) {
    return null;
  }

  return config;
}

/**
 * Web Push VAPID public key from Firebase Console → Project settings →
 * Cloud Messaging → Web Push certificates → Key pair (copy the full string).
 */
export function readFirebaseVapidKey(): string | null {
  const vapidKey =
    process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY?.trim() ??
    process.env.NEXT_PUBLIC_FIREBASE_WEB_PUSH_KEY?.trim() ??
    "";
  return vapidKey || null;
}

export function isFirebasePublicConfigReady(): boolean {
  return readFirebasePublicConfig() !== null;
}

export function isFirebaseVapidKeyReady(): boolean {
  return readFirebaseVapidKey() !== null;
}

export function isFirebaseConfigured(): boolean {
  return isFirebasePublicConfigReady() && isFirebaseVapidKeyReady();
}

/** Returns a singleton Firebase app in the browser, or null when not configured. */
export function getFirebaseApp(): FirebaseApp | null {
  if (typeof window === "undefined") {
    return null;
  }

  const config = readFirebasePublicConfig();
  if (!config) {
    return null;
  }

  if (getApps().length > 0) {
    return getApps()[0] ?? null;
  }

  return initializeApp(config);
}
