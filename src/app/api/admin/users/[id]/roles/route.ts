import { NextRequest, NextResponse } from "next/server";
import { jsonError } from "@/lib/api/bff-errors";
import { backendContainer } from "@/container";
import { UserBackendService, userModuleNames } from "@/modules/user";
import { getToken } from "next-auth/jwt";

const userService = backendContainer.get<UserBackendService>(userModuleNames.service);

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(req: NextRequest, context: RouteContext) {
  try {
     const token = await getToken({ req }).then((res) => res?.accessToken);
    if (!token) {
      throw new Error("Missing authorization token");
    }
    const { id } = await context.params;
    const body = await req.json();
    const res = await userService.assignRoles({ token, id, roles: body.roles ?? [] });
    return NextResponse.json(res);
  } catch (error: unknown) {
    return jsonError(error, 400);
  }
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
     const token = await getToken({ req }).then((res) => res?.accessToken);
    if (!token) {
      throw new Error("Missing authorization token");
    }
    const { id } = await context.params;
    const body = await req.json();
    const res = await userService.removeRoles({ token, id, roles: body.roles ?? [] });
    return NextResponse.json(res);
  } catch (error: unknown) {
    return jsonError(error, 400);
  }
}
