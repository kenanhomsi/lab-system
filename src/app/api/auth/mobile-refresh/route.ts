import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { backendContainer } from "@/container";
import { jsonError } from "@/lib/api/bff-errors";
import { AuthBackendService, authModuleNames } from "@/modules/auth";

const authService = backendContainer.get<AuthBackendService>(
  authModuleNames.service,
);

const refreshRequestSchema = z.union([
  z.object({
    refreshToken: z.string().min(1),
  }),
  z.object({
    token: z.string().min(1),
  }),
]);

export async function POST(request: NextRequest) {
  try {
    const body = refreshRequestSchema.parse(await request.json());
    const refreshToken = "refreshToken" in body ? body.refreshToken : body.token;
    const response = await authService.renewAccessToken({ refreshToken });
    return NextResponse.json(response);
  } catch (error: unknown) {
    return jsonError(error, 400);
  }
}
