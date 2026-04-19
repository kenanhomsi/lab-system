import { NextRequest, NextResponse } from "next/server";
import { jsonError } from "@/lib/api/bff-errors";
import { backendContainer } from "@/container";
import { UserBackendService, userModuleNames } from "@/modules/user";
import { getToken } from "next-auth/jwt";

const userService = backendContainer.get<UserBackendService>(userModuleNames.service);

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req }).then((res) => res?.accessToken);
    if (!token) {
      throw new Error("Missing authorization token");
    }
    const res = await userService.requestDeletionMe({ token });
    return NextResponse.json(res);
  } catch (error: unknown) {
    return jsonError(error, 400);
  }
}

