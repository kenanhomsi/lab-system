import { backendContainer } from "@/container";
import { AuthBackendService, authModuleNames } from "@/modules/auth";
import { jsonError, jsonOrNoContent } from "@/lib/api/bff-errors";
import { NextRequest } from "next/server";
import { registerBodySchema } from "../schemas";

const authService = backendContainer.get<AuthBackendService>(
  authModuleNames.service,
);

export async function POST(req: NextRequest) {
  try {
    const body = registerBodySchema.parse(await req.json());
    const res = await authService.Register({ ...body });
    return jsonOrNoContent(res, { successStatus: 201 });
  } catch (error: unknown) {
    return jsonError(error, 400);
  }
}
