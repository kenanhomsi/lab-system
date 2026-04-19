import { backendContainer } from "@/container";
import {
  AuthBackendService,
  authModuleNames,
  ResetPasswordProps,
} from "@/modules/auth";
import { NextRequest, NextResponse } from "next/server";

const authService = backendContainer.get<AuthBackendService>(
  authModuleNames.service,
);

export async function POST(req: NextRequest) {
  try {
    const body: ResetPasswordProps = await req.json();
    const res = await authService.ResetPassword({ ...body });
    return NextResponse.json(res);
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json(error?.response?.data, { status: 400 });
  }
}
