import axios, {
  AxiosError,
  AxiosHeaders,
  InternalAxiosRequestConfig,
} from "axios";
import { getCsrfToken, getSession } from "next-auth/react";

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

const axiosInstanceFront = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

let sessionTouchDeduped: Promise<boolean> | undefined;
let sessionForceRefreshDeduped: Promise<boolean> | undefined;

/**
 * Touches GET /api/auth/session so NextAuth runs the jwt callback (proactive refresh
 * when the access token is near expiry). Deduped for parallel API calls.
 */
async function touchSession(): Promise<boolean> {
  if (typeof window === "undefined") {
    return false;
  }

  if (!sessionTouchDeduped) {
    sessionTouchDeduped = (async () => {
      try {
        const res = await fetch(`${window.location.origin}/api/auth/session`, {
          method: "GET",
          credentials: "include",
          cache: "no-store",
          headers: { Accept: "application/json" },
        });
        return res.ok;
      } catch {
        return false;
      }
    })().finally(() => {
      sessionTouchDeduped = undefined;
    });
  }

  return sessionTouchDeduped;
}

/**
 * Forces access-token renewal via NextAuth session update. Renewed tokens stay in the
 * httpOnly JWT cookie and are not exposed in the session JSON (BFF pattern).
 */
async function forceRefreshSession(): Promise<boolean> {
  if (typeof window === "undefined") {
    return false;
  }

  if (!sessionForceRefreshDeduped) {
    sessionForceRefreshDeduped = (async () => {
      try {
        const csrfToken = await getCsrfToken();
        if (!csrfToken) {
          return false;
        }
        const res = await fetch(`${window.location.origin}/api/auth/session`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            csrfToken,
            data: { forceRefresh: true },
          }),
        });
        if (res.ok) {
          void getSession();
        }
        return res.ok;
      } catch {
        return false;
      }
    })().finally(() => {
      sessionForceRefreshDeduped = undefined;
    });
  }

  return sessionForceRefreshDeduped;
}

/** Ensures BFF routes read the access token from the session cookie, not a stale header. */
const stripAuthorizationHeader = (
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig => {
  const headers = AxiosHeaders.from(config.headers ?? {});
  headers.delete("Authorization");
  config.headers = headers;
  return config;
};

axiosInstanceFront.interceptors.request.use(async (config) => {
  await touchSession();
  return stripAuthorizationHeader(config);
});

axiosInstanceFront.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableRequestConfig | undefined;
    const shouldRetry =
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/");

    if (!shouldRetry || !originalRequest) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;
    const refreshed = await forceRefreshSession();

    if (!refreshed) {
      return Promise.reject(error);
    }

    return axiosInstanceFront(stripAuthorizationHeader(originalRequest));
  },
);

export { axiosInstanceFront };
