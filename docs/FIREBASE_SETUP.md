# Firebase Cloud Messaging (Web) Setup

## 1. Firebase Console (project: medical-test)

1. Open [Firebase Console](https://console.firebase.google.com/) → project **medical-test**.
2. **Project settings** → **General** → **Your apps** → Web app (`react-test`).
3. Copy the `firebaseConfig` values into environment variables (see section 3).
4. **Project settings** → **Cloud Messaging** → tab **Web configuration** → **Web Push certificates**.
5. Copy the full **Key pair** string from the table (starts with `B`, e.g. `BM7...`). Paste it into `NEXT_PUBLIC_FIREBASE_VAPID_KEY`.
   - This is **not** the **Sender ID** (`422246677447`) shown at the top of Cloud Messaging.
   - If no key exists, click **Generate key pair**, then copy the new value.
6. **Build** → ensure **Cloud Messaging API** is enabled for the project.
7. **Authentication** → **Settings** → **Authorized domains**: add `localhost` and your production domain.

## 2. Local environment

Create or update `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_VAPID_KEY=
```

Restart `npm run dev` after changing these values.

## 3. Docker / production

- Copy variables from [`.env.docker.example`](../.env.docker.example).
- Add the same keys as **GitHub Actions secrets** (see [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml)).
- Rebuild the image after changing any `NEXT_PUBLIC_*` value:

```bash
docker compose build --no-cache web
```

## 4. Verify in the app

1. Log in and open any dashboard route.
2. Click the **bell icon** in the navbar → **Enable push notifications** → accept the browser permission prompt.
3. In DevTools → **Network**, confirm `POST /api/notifications/device-tokens` returns **204**.
4. In Firebase Console → **Messaging** → **Send test message**, paste the FCM token from the browser console (logged in dev) or from your backend.
5. On logout, confirm `DELETE /api/notifications/device-tokens` returns **204**.

## 5. Troubleshooting `500 Internal Server Error`

If the browser shows **Request failed with status code 500** when calling `POST /api/notifications/device-tokens`:

1. The **FCM token and Firebase setup on the frontend are usually fine** — the request reached your API.
2. Check the **Next.js terminal** (development): the BFF logs the upstream response from `BACKEND_URL`.
3. Ask the **backend team** to inspect logs for `POST /api/notifications/device-tokens` (database migration, Firebase Admin SDK config, null reference, etc.).
4. Confirm `BACKEND_URL` in `.env.local` points to the environment where notifications are deployed (e.g. `https://api.syrian-medical.tech`).

## 6. Notes

- Web push requires **HTTPS** in production (localhost is exempt).
- The service worker is served at `/firebase-messaging-sw.js` with config injected from env at runtime.
- Push sending is done by the backend via Firebase Admin; the frontend only registers device tokens.
