import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { backendContainer } from "@/container";
import { jsonError } from "@/lib/api/bff-errors";
import { AuthBackendService, authModuleNames } from "@/modules/auth";

const authService = backendContainer.get<AuthBackendService>(
  authModuleNames.service,
);

const loginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = loginRequestSchema.parse(await request.json());
    const response = await authService.Login(body);
    return NextResponse.json(response);
  } catch (error: unknown) {
    return jsonError(error, 400);
  }
}
