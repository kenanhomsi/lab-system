import { backendContainer } from "@/container";
import { AuthBackendService, authModuleNames } from "@/modules/auth";
import { RegisterProps } from "@/modules/auth/backend/client";
import { NextRequest, NextResponse } from "next/server";

const authService = backendContainer.get<AuthBackendService>(
  authModuleNames.service,
);

export async function POST(req: NextRequest) {
  try {
    const body: RegisterProps = await req.json();
    const res = await authService.Register({ ...body });
    return NextResponse.json(res);
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json(error?.response?.data, { status: 400 });
  }
}
