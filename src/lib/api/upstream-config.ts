/**
 * Upstream (real backend) toggle — single switch for the whole app.
 *
 * EN: When `UPSTREAM_BACKEND_READY` is NOT set to `"true"`, all `/api/*` BFF routes
 * and NextAuth `authorize` use **mock data** only. No calls are made to `BACKEND_URL`.
 * Set `UPSTREAM_BACKEND_READY=true` in `.env.local` when your API is ready.
 *
 * AR: طالما المتغير مش `true`، كل مسارات الـ BFF وتسجيل الدخول بتشتغل ببيانات وهمية فقط
 * وما في طلبات على السيرفر الحقيقي. لما يجهز الـ backend حط:
 * `UPSTREAM_BACKEND_READY=true` في `.env.local`
 */
export function isUpstreamBackendReady(): boolean {
  return process.env.UPSTREAM_BACKEND_READY === "true";
}

/** Same flag; use for readability where "mock mode" is the focus. */
export function isMockBackendMode(): boolean {
  return !isUpstreamBackendReady();
}
