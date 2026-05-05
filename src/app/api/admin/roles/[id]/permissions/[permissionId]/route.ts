import { NextRequest, NextResponse } from "next/server";
import { jsonError } from "@/lib/api/bff-errors";
import { backendContainer } from "@/container";
import { roleModuleNames, RoleBackendService } from "@/modules/role";
import { resolveAccessToken } from "@/lib/api/resolve-access-token";

const roleService = backendContainer.get<RoleBackendService>(roleModuleNames.service);

type RouteContext = {
  params: Promise<{ id: string; permissionId: string }>;
};

export async function DELETE(_req: NextRequest, context: RouteContext) {
  try {
    const token = await resolveAccessToken(_req);
    if (!token) {
      throw new Error("Missing authorization token");
    }
    const { id, permissionId } = await context.params;
    const res = await roleService.removePermission({ token, id, permissionId });
    return NextResponse.json(res);
  } catch (error: unknown) {
    return jsonError(error);
  }
}
