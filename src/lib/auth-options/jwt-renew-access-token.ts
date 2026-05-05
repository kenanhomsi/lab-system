import type { JWT } from "next-auth/jwt";
import type { RenewAccessTokenPayloadType } from "@/modules/auth/backend/schema/renew-access-token";

const renewalByRefreshToken = new Map<
  string,
  Promise<RenewAccessTokenPayloadType>
>();

/**
 * When several GET /api/auth/session calls run at once with the same JWT, each jwt
 * callback would call the backend refresh independently. Refresh-token rotation
 * makes the later call fail and leaves the JWT with an expired access token.
 */
function renewAccessTokenSingleFlight(
  refreshToken: string,
  renew: (params: { refreshToken: string }) => Promise<RenewAccessTokenPayloadType>,
): Promise<RenewAccessTokenPayloadType> {
  const existing = renewalByRefreshToken.get(refreshToken);
  if (existing) return existing;

  const pending = renew({ refreshToken }).finally(() => {
    renewalByRefreshToken.delete(refreshToken);
  });
  renewalByRefreshToken.set(refreshToken, pending);
  return pending;
}

function applyRenewalPayloadToJwt(token: JWT, refreshed: RenewAccessTokenPayloadType): void {
  token.accessToken = refreshed.accessToken;
  token.refreshToken = refreshed.refreshToken;
  token.expiresAt = refreshed.expiresAt;
  const u = refreshed.user;
  if (u) {
    token.id = u.id;
    token.email = u.email;
    token.fullName = u.fullName;
    token.roles = u.roles;
    token.permissions = u.permissions;
  }
}

export { applyRenewalPayloadToJwt, renewAccessTokenSingleFlight };
