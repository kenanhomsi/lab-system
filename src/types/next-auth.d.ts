import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    fullName: string;
    roles: string[];
    permissions: string[];
    accessToken: string;
    refreshToken: string;
    expiresAt: string;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      fullName: string;
      roles: string[];
      permissions: string[];
      accessToken: string;
    };
    expires: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    fullName: string;
    roles: string[];
    permissions: string[];
    accessToken: string;
    refreshToken: string;
    expiresAt: string;
  }
}
