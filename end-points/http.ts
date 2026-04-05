export const DEFAULT_LOCAL_API_URL = "http://localhost:3005";

export const NB_REFRESH_TOKEN_KEY = "nb_refresh_token";

/** Thrown when `/auth/refresh` returns 401 — session cleared, redirecting to `/logout`. */
export const AUTH_ERROR_SESSION_EXPIRED = "SESSION_EXPIRED";

/** Refresh token present but `/auth/refresh` failed (e.g. 5xx); access token may still work. */
export const AUTH_ERROR_REFRESH_FAILED = "REFRESH_FAILED";

export function getApiBaseUrl() {
  const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

  if (typeof window !== "undefined") {
    if (configuredApiUrl) {
      const isSecurePage = window.location.protocol === "https:";
      const isInsecureApiOrigin = configuredApiUrl.startsWith("http:");

      if (isSecurePage && isInsecureApiOrigin) {
        return "/api";
      }

      return configuredApiUrl;
    }

    return window.location.protocol === "https:" ? "/api" : DEFAULT_LOCAL_API_URL;
  }

  return configuredApiUrl || DEFAULT_LOCAL_API_URL;
}

export type RequestOptions = RequestInit & {
  token?: string;
  /** Internal: set after one refresh retry to avoid loops. */
  _authRetry?: boolean;
};

export function getStoredToken() {
  if (typeof window === "undefined") return undefined;
  return localStorage.getItem("nb_token") || undefined;
}

export function getStoredRefreshToken() {
  if (typeof window === "undefined") return undefined;
  return localStorage.getItem(NB_REFRESH_TOKEN_KEY) || undefined;
}

type RefreshOutcome = "ok" | "auth_invalid" | "failed";

let refreshInFlight: Promise<RefreshOutcome> | null = null;

function shouldAttemptRefresh(path: string, authRetry?: boolean): boolean {
  if (authRetry || typeof window === "undefined") return false;
  if (!getStoredRefreshToken()) return false;
  if (path === "/auth/refresh") return false;
  if (path === "/auth/logout") return false;
  if (path.startsWith("/auth/phone-otp")) return false;
  return true;
}

function handleSessionExpired() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem("nb_token");
    localStorage.removeItem(NB_REFRESH_TOKEN_KEY);
    localStorage.removeItem("nb_user");
  } catch {
    /* ignore */
  }
  window.location.assign("/logout");
}

async function refreshAccessToken(): Promise<RefreshOutcome> {
  const rt = getStoredRefreshToken();
  if (!rt) return "failed";

  try {
    const res = await fetch(`${getApiBaseUrl()}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: rt }),
    });

    if (res.status === 401) {
      try {
        localStorage.removeItem(NB_REFRESH_TOKEN_KEY);
      } catch {
        /* ignore */
      }
      return "auth_invalid";
    }

    if (!res.ok) return "failed";

    const data = (await res.json()) as { access_token: string; refresh_token?: string };
    try {
      localStorage.setItem("nb_token", data.access_token);
      if (data.refresh_token) {
        localStorage.setItem(NB_REFRESH_TOKEN_KEY, data.refresh_token);
      }
    } catch {
      /* ignore */
    }

    window.dispatchEvent(
      new CustomEvent("fmp-access-token-updated", { detail: { accessToken: data.access_token } }),
    );
    return "ok";
  } catch {
    return "failed";
  }
}

async function performTokenRefresh(): Promise<RefreshOutcome> {
  if (!refreshInFlight) {
    refreshInFlight = refreshAccessToken().finally(() => {
      refreshInFlight = null;
    });
  }
  return refreshInFlight;
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { token: explicitToken, _authRetry, ...init } = options;
  const headers = new Headers(init.headers);
  if (!(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const effectiveToken =
    explicitToken !== undefined ? explicitToken : typeof window !== "undefined" ? getStoredToken() : undefined;

  if (effectiveToken) {
    headers.set("Authorization", `Bearer ${effectiveToken}`);
  }

  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...init,
    headers,
  });

  if (response.status === 401 && shouldAttemptRefresh(path, _authRetry)) {
    const outcome = await performTokenRefresh();
    if (outcome === "ok") {
      return request<T>(path, { ...options, _authRetry: true });
    }
    if (outcome === "auth_invalid") {
      handleSessionExpired();
      throw new Error(AUTH_ERROR_SESSION_EXPIRED);
    }
    throw new Error(AUTH_ERROR_REFRESH_FAILED);
  }

  if (!response.ok) {
    let message = "Request failed";
    try {
      const errorBody = await response.json();
      if (Array.isArray(errorBody?.message)) {
        message = errorBody.message.join(", ");
      } else if (typeof errorBody?.message === "string") {
        message = errorBody.message;
      }
    } catch {
      message = response.statusText || message;
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
