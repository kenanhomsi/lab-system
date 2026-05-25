import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { AuthBackendService, authModuleNames } from "@/modules/auth";
import { backendContainer } from "@/container";
import { AuthOptions } from "next-auth/";
import { getAuthSecret } from "@/lib/auth-secret";
import { getAccessExpiryMs } from "@/lib/parse-access-expires-at";
import {
  applyRenewalPayloadToJwt,
  renewAccessTokenSingleFlight,
} from "@/lib/auth-options/jwt-renew-access-token";

const authService = backendContainer.get<AuthBackendService>(
  authModuleNames.service,
);

const authConfig: AuthOptions = {
  secret: getAuthSecret(),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const res = await authService.Login({
          email: credentials?.identifier ?? "",
          password: credentials?.password ?? "",
        });
        if (!res.user?.id) {
          throw new Error("Invalid login response: missing user id");
        }
        return {
          id: res.user.id,
          email: res.user.email,
          fullName: res.user.fullName,
          roles: res.user.roles,
          permissions: res.user.permissions,
          accessToken: res.accessToken,
          refreshToken: res.refreshToken,
          expiresAt: res.expiresAt,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user, account, trigger, session: updatePayload }) {
      if (user && account?.provider === "google") {
        token.id = user.id ?? "";
        token.email = user.email ?? "";
        token.fullName = user.name ?? "";
        token.roles = [];
        token.permissions = [];
        token.accessToken = "";
        token.refreshToken = "";
        token.expiresAt = "";
        return token;
      }

      if (user) {
        token.id = user.id;
        token.email = user.email ?? "";
        token.fullName = user.fullName;
        token.roles = user.roles;
        token.permissions = user.permissions;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.expiresAt = user.expiresAt;
        return token;
      }

      if (
        trigger === "update" &&
        updatePayload &&
        typeof updatePayload === "object" &&
        "forceRefresh" in updatePayload &&
        (updatePayload as { forceRefresh?: boolean }).forceRefresh === true
      ) {
        if (token.refreshToken) {
          try {
            const refreshed = await renewAccessTokenSingleFlight(
              token.refreshToken,
              (p) => authService.renewAccessToken(p),
            );
            applyRenewalPayloadToJwt(token, refreshed);
          } catch {
            /* keep existing token */
          }
        }
        return token;
      }

      if (!token.refreshToken) {
        return token;
      }

      const now = Date.now();
      const expiresAtMs = getAccessExpiryMs(token.expiresAt, token.accessToken);
      const shouldRefresh =
        expiresAtMs !== undefined &&
        expiresAtMs - now < 5 * 60 * 1000;

      if (!shouldRefresh) {
        return token;
      }

      try {
        const refreshed = await renewAccessTokenSingleFlight(
          token.refreshToken,
          (p) => authService.renewAccessToken(p),
        );
        applyRenewalPayloadToJwt(token, refreshed);
      } catch {
        return token;
      }

      return token;
    },

    async session({ session, token }) {
      return {
        user: {
          id: token.id,
          email: token.email,
          fullName: token.fullName,
          roles: token.roles,
          permissions: token.permissions,
          // accessToken is intentionally kept only in the encrypted JWT cookie
          // and never exposed to client-side JS (BFF pattern)
        },
        expires: session.expires,
      };
    },
  },
};

export { authConfig as serverAuthConfig };
