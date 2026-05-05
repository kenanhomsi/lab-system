import axios, {
  AxiosError,
  AxiosHeaders,
  InternalAxiosRequestConfig,
} from "axios";
import { getCsrfToken, getSession } from "next-auth/react";

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

type SessionPayload = {
  user?: {
    accessToken?: string | null;
  } | null;
};

const axiosInstanceFront = axios.create({ baseURL: "/api" });

let sessionFetchDeduped: Promise<SessionPayload | null> | undefined;

/**
 * Dedupes concurrent reads of /api/auth/session so parallel API calls hit the
 * session endpoint once; that prevents duplicate JWT refresh work and avoids
 * refresh-token rotation races.
 */
async function fetchSessionPayload(): Promise<SessionPayload | null> {
  if (typeof window === "undefined") {
    return null;
  }

  if (!sessionFetchDeduped) {
    sessionFetchDeduped = (async () => {
      try {
        const res = await fetch(`${window.location.origin}/api/auth/session`, {
          method: "GET",
          credentials: "include",
          cache: "no-store",
          headers: { Accept: "application/json" },
        });
        if (!res.ok) {
          return null;
        }
        return (await res.json()) as SessionPayload;
      } catch {
        return null;
      }
    })().finally(() => {
      sessionFetchDeduped = undefined;
    });
  }

  return sessionFetchDeduped;
}

async function sessionAccessTokenFromFetch(): Promise<string | undefined> {
  const payload = await fetchSessionPayload();
  const access = payload?.user?.accessToken;
  return typeof access === "string" && access.trim() ? access : undefined;
}

async function forceRefreshAccessToken(): Promise<string | undefined> {
  if (typeof window === "undefined") {
    return undefined;
  }
  try {
    const csrfToken = await getCsrfToken();
    if (!csrfToken) {
      return undefined;
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
    if (!res.ok) {
      return undefined;
    }
    const data = (await res.json()) as SessionPayload;
    const access = data.user?.accessToken;
    const token =
      typeof access === "string" && access.trim() ? access : undefined;
    if (token) {
      void getSession();
    }
    return token;
  } catch {
    return undefined;
  }
}

const applyAccessToken = (
  config: InternalAxiosRequestConfig,
  token?: string,
): InternalAxiosRequestConfig => {
  if (!token) {
    return config;
  }

  const headers = AxiosHeaders.from(config.headers ?? {});
  headers.set("Authorization", `Bearer ${token}`);
  config.headers = headers;
  return config;
};

const syncAccessToken = async (force = false): Promise<string | undefined> => {
  if (typeof window === "undefined") {
    return undefined;
  }

  if (force) {
    const rotated = await forceRefreshAccessToken();
    if (rotated) {
      return rotated;
    }
    const fallback = await sessionAccessTokenFromFetch();
    void getSession();
    return fallback;
  }

  return sessionAccessTokenFromFetch();
};

axiosInstanceFront.interceptors.request.use(async (config) => {
  const accessToken = await syncAccessToken();
  return applyAccessToken(config, accessToken);
});

axiosInstanceFront.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableRequestConfig | undefined;
    const shouldRetry =
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh-token");

    if (!shouldRetry || !originalRequest) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;
    const accessToken = await syncAccessToken(true);

    if (!accessToken) {
      return Promise.reject(error);
    }

    return axiosInstanceFront(applyAccessToken(originalRequest, accessToken));
  },
);

export { axiosInstanceFront };
