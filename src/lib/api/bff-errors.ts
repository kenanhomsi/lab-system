import { NextResponse } from "next/server";
import { isAxiosError } from "axios";

export function jsonError(
  error: unknown,
  fallbackStatus = 500,
): NextResponse<{ error: unknown }> {
  if (isAxiosError(error)) {
    const status = error.response?.status ?? fallbackStatus;
    const data = error.response?.data ?? error.message;
    return NextResponse.json({ error: data }, { status });
  }
  if (error instanceof Error) {
    const status =
      error.message === "Missing authorization token" ? 401 : fallbackStatus;
    return NextResponse.json({ error: error.message }, { status });
  }
  return NextResponse.json({ error: "Unknown error" }, { status: fallbackStatus });
}

export function extractBearerToken(
  authorization: string | null,
): string | undefined {
  if (!authorization?.startsWith("Bearer ")) {
    return undefined;
  }
  return authorization.slice(7);
}
