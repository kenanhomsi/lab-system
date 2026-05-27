import type { NextApiRequest } from "next";
import { cookies } from "next/headers";
import { getToken } from "next-auth/jwt";
import { getAuthSecret } from "@/lib/auth-secret";

/**
 * Reads the access token from the encrypted NextAuth JWT cookie on the server.
 * next-auth `getToken` reads session cookies via `req.cookies.getAll()`, not the Cookie header string.
 */
export async function getServerAccessToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  const token = await getToken({
    req: {
      cookies: cookieStore,
      headers: {},
    } as unknown as NextApiRequest,
    secret: getAuthSecret(),
  });

  const accessToken = token?.accessToken;
  return typeof accessToken === "string" && accessToken.trim()
    ? accessToken
    : undefined;
}
