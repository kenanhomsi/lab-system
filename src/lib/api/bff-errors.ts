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

function isEmptyUpstreamBody(data: unknown): boolean {
  if (data === undefined || data === null || data === "") return true;
  if (typeof data === "object" && !Array.isArray(data) && Object.keys(data).length === 0) {
    return true;
  }
  return false;
}

/** Returns 204 when upstream has no body; otherwise JSON with the given status. */
export function jsonOrNoContent(
  data: unknown,
  options?: { successStatus?: number },
): NextResponse {
  const successStatus = options?.successStatus ?? 200;
  if (isEmptyUpstreamBody(data)) {
    return new NextResponse(null, { status: successStatus === 201 ? 201 : 204 });
  }
  return NextResponse.json(data, { status: successStatus });
}

export function extractBearerToken(
  authorization: string | null,
): string | undefined {
  if (!authorization?.startsWith("Bearer ")) {
    return undefined;
  }
  return authorization.slice(7);
}
