/** Cookie set on login for `proxy.ts` role checks (must match server-readable name). */
export const FMP_ROLE_COOKIE = "fmp-role";

/** Reference (access) token cookie for `proxy.ts` — must be present on protected routes. */
export const FMP_RT_COOKIE = "fmp-rt";

const ONE_YEAR_S = 60 * 60 * 24 * 365;

/** Client-side: persist role for edge/proxy routing. */
export function setFmpRoleCookieClient(role: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${FMP_ROLE_COOKIE}=${encodeURIComponent(role)};path=/;max-age=${ONE_YEAR_S};SameSite=Lax`;
}

/** Client-side: persist reference token for edge/proxy (same value as `nb_token`). */
export function setFmpRtCookieClient(token: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${FMP_RT_COOKIE}=${encodeURIComponent(token)};path=/;max-age=${ONE_YEAR_S};SameSite=Lax`;
}

export function clearFmpRoleCookieClient() {
  if (typeof document === "undefined") return;
  document.cookie = `${FMP_ROLE_COOKIE}=;path=/;max-age=0`;
}

export function clearFmpRtCookieClient() {
  if (typeof document === "undefined") return;
  document.cookie = `${FMP_RT_COOKIE}=;path=/;max-age=0`;
}
