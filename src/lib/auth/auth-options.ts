import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { isUpstreamBackendReady } from "@/lib/api/upstream-config";
import type { UserRole } from "@/types/user";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      fullName: string;
      email: string;
      mobile: string;
      institutionId?: string;
    };
  }
  interface User {
    id: string;
    role: UserRole;
    fullName: string;
    email: string;
    mobile: string;
    institutionId?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
    fullName: string;
    email: string;
    mobile: string;
    institutionId?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        identifier: { label: "Email or Mobile", type: "text" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password || !credentials?.role) {
          return null;
        }

        try {
          const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";

          if (isUpstreamBackendReady()) {
            const res = await fetch(`${backendUrl}/auth/login`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                identifier: credentials.identifier,
                password: credentials.password,
                role: credentials.role,
              }),
            });

            if (!res.ok) return null;
            const user = await res.json();
            return {
              id: user.id,
              role: user.role,
              fullName: user.fullName,
              email: user.email,
              mobile: user.mobile,
              institutionId: user.institutionId,
            };
          }

          // Mock auth for development
          return {
            id: `mock-${credentials.role}-1`,
            role: credentials.role as UserRole,
            fullName: credentials.role === "patient" ? "أحمد محمد" : credentials.role === "doctor" ? "د. سارة أحمد" : credentials.role === "lab" ? "مخبر الشفاء" : "مدير النظام",
            email: credentials.identifier,
            mobile: "0991000000",
            institutionId: undefined,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.fullName = user.fullName;
        token.email = user.email;
        token.mobile = user.mobile;
        token.institutionId = user.institutionId;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        role: token.role,
        fullName: token.fullName,
        email: token.email,
        mobile: token.mobile,
        institutionId: token.institutionId,
      };
      return session;
    },
  },
  secret: process.env.AUTH_SECRET || "dev-secret-change-in-production",
};
