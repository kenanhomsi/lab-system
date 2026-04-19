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
    const res = await userService.deactivate({ token, id });
    return NextResponse.json(res);
  } catch (error: unknown) {
    return jsonError(error);
  }
}
