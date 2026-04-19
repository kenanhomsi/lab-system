import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { getAuthSecret } from "@/lib/auth-secret";
import { extractBearerToken } from "./bff-errors";

export async function resolveAccessToken(
  request: NextRequest,
): Promise<string | undefined> {
  const sessionToken = await getToken({
    req: request,
    secret: getAuthSecret(),
  }).then((token) => token?.accessToken);

  return sessionToken ?? extractBearerToken(request.headers.get("authorization"));
}
