import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { AuthBackendService, authModuleNames } from "@/modules/auth";
import { backendContainer } from "@/container";
import { AuthOptions } from "next-auth/";
import { getAuthSecret } from "@/lib/auth-secret";

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
        const res = await authService.login({
          email: credentials?.identifier ?? "",
          password: credentials?.password ?? "",
        });
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
    async jwt({ token, user, account }) {
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

      if (!token.refreshToken) {
        return token;
      }

      const now = Date.now();
      const expiresAt = token.expiresAt
        ? new Date(token.expiresAt).getTime()
        : 0;
      const shouldRefresh = expiresAt - now < 5 * 60 * 1000;

      if (!shouldRefresh) {
        return token;
      }

      try {
        const refreshed = await authService.renewAccessToken({
          refreshToken: token.refreshToken,
        });
        token.accessToken = refreshed.accessToken;
        token.refreshToken = refreshed.refreshToken;
        token.expiresAt = refreshed.expiresAt;
      } catch {
        token.accessToken = "";
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
          accessToken: token.accessToken,
        },
        expires: session.expires,
      };
    },
  },
};

export { authConfig as serverAuthConfig };
