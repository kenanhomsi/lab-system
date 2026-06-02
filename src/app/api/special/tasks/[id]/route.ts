import { NextRequest, NextResponse } from "next/server";
import { jsonError, jsonOrNoContent } from "@/lib/api/bff-errors";
import { backendContainer } from "@/container";
import { resolveAccessToken } from "@/lib/api/resolve-access-token";
import {
  SpecialAccountBackendService,
  patchTaskSchema,
  specialAccountModuleNames,
} from "@/modules/special-account";

const service = backendContainer.get<SpecialAccountBackendService>(
  specialAccountModuleNames.service,
);

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const token = await resolveAccessToken(req);
    if (!token) throw new Error("Missing authorization token");
    const { id } = await params;
    const body = patchTaskSchema.parse(await req.json());
    const res = await service.patchTask({ token, id, body });
    return NextResponse.json(res);
  } catch (error: unknown) {
    return jsonError(error, 400);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const token = await resolveAccessToken(req);
    if (!token) throw new Error("Missing authorization token");
    const { id } = await params;
    await service.deleteTask({ token, id });
    return jsonOrNoContent(null);
  } catch (error: unknown) {
    return jsonError(error, 400);
  }
}
