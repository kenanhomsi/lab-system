/**
 * Parses backend access expiry into milliseconds since epoch.
 * Handles ISO strings and Unix seconds / milliseconds (number or numeric string).
 */
function parseAccessExpiresAtMs(expiresAt: unknown): number | undefined {
  if (expiresAt == null) return undefined;

  if (typeof expiresAt === "number") {
    if (!Number.isFinite(expiresAt)) return undefined;
    return expiresAt < 1e12 ? expiresAt * 1000 : expiresAt;
  }

  if (typeof expiresAt === "string") {
    const t = expiresAt.trim();
    if (!t) return undefined;
    if (/^-?\d+(\.\d+)?$/.test(t)) {
      const n = Number(t);
      if (!Number.isFinite(n)) return undefined;
      return n < 1e12 ? n * 1000 : n;
    }
    const parsed = Date.parse(t);
    if (!Number.isNaN(parsed)) return parsed;
    return undefined;
  }

  return undefined;
}

/**
 * Fallback: reads `exp` from a JWT-shaped access token (no verification).
 */
function parseJwtExpMs(accessToken: unknown): number | undefined {
  if (typeof accessToken !== "string") return undefined;
  const parts = accessToken.split(".");
  if (parts.length < 2) return undefined;
  try {
    const b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
    const json = Buffer.from(padded, "base64").toString("utf8");
    const payload = JSON.parse(json) as { exp?: unknown };
    if (typeof payload.exp !== "number" || !Number.isFinite(payload.exp)) {
      return undefined;
    }
    return payload.exp * 1000;
  } catch {
    return undefined;
  }
}

function getAccessExpiryMs(expiresAt: unknown, accessToken: unknown): number | undefined {
  return (
    parseAccessExpiresAtMs(expiresAt) ?? parseJwtExpMs(accessToken)
  );
}

export { parseAccessExpiresAtMs, parseJwtExpMs, getAccessExpiryMs };
