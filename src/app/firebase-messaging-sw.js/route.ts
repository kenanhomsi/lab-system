import { readFirebasePublicConfig } from "@/features/push-notifications/firebase/config";

const FIREBASE_CDN_VERSION = "12.0.0";

/**
 * Serves the Firebase Cloud Messaging service worker with runtime config from env.
 */
export async function GET() {
  const config = readFirebasePublicConfig();

  if (!config) {
    return new Response("// Firebase is not configured\n", {
      status: 200,
      headers: {
        "Content-Type": "application/javascript",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  }

  const script = `importScripts('https://www.gstatic.com/firebasejs/${FIREBASE_CDN_VERSION}/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/${FIREBASE_CDN_VERSION}/firebase-messaging-compat.js');

firebase.initializeApp(${JSON.stringify(config)});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notification = payload.notification || {};
  const data = payload.data || {};
  const title = notification.title || data.title || 'Notification';
  const body = notification.body || data.body || '';
  const icon = notification.icon || '/icons/home.svg';

  self.registration.showNotification(title, {
    body,
    icon,
    data: data,
  });
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data && event.notification.data.url
    ? event.notification.data.url
    : '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(targetUrl) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    }),
  );
});
`;

  return new Response(script, {
    headers: {
      "Content-Type": "application/javascript",
      "Service-Worker-Allowed": "/",
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  });
}
