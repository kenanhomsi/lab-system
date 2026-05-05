import { backendContainer } from "@/container";
import { AuthBackendService, authModuleNames } from "@/modules/auth";
import { jsonError } from "@/lib/api/bff-errors";
import { NextRequest, NextResponse } from "next/server";
import { resetPasswordBodySchema } from "../schemas";

const authService = backendContainer.get<AuthBackendService>(
  authModuleNames.service,
);

export async function POST(req: NextRequest) {
  try {
    const body = resetPasswordBodySchema.parse(await req.json());
    const res = await authService.ResetPassword({ ...body });
    return NextResponse.json(res);
  } catch (error: unknown) {
    return jsonError(error, 400);
  }
}
