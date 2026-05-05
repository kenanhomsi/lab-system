import { NextRequest, NextResponse } from "next/server";
import { jsonError } from "@/lib/api/bff-errors";
import { backendContainer } from "@/container";
import { UserBackendService, userModuleNames } from "@/modules/user";
import { getToken } from "next-auth/jwt";

const userService = backendContainer.get<UserBackendService>(userModuleNames.service);

type RouteContext = {
  params: Promise<{ id: string; permission: string }>;
};

export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
     const token = await getToken({ req }).then((res) => res?.accessToken);
    if (!token) {
      throw new Error("Missing authorization token");
    }
    const { id, permission } = await context.params;
    const res = await userService.removePermission({ token, id, permission });
    return NextResponse.json(res);
  } catch (error: unknown) {
    return jsonError(error);
  }
}
