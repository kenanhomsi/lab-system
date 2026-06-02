import { NextRequest, NextResponse } from "next/server";
import { jsonError } from "@/lib/api/bff-errors";
import { backendContainer } from "@/container";
import { resolveAccessToken } from "@/lib/api/resolve-access-token";
import {
  SpecialAccountBackendService,
  specialAccountModuleNames,
} from "@/modules/special-account";

const service = backendContainer.get<SpecialAccountBackendService>(
  specialAccountModuleNames.service,
);

export async function GET(req: NextRequest) {
  try {
    const token = await resolveAccessToken(req);
    if (!token) throw new Error("Missing authorization token");
    const from = req.nextUrl.searchParams.get("from") ?? undefined;
    const to = req.nextUrl.searchParams.get("to") ?? undefined;
    const res = await service.getStatement({ token, query: { from, to } });
    return NextResponse.json(res);
  } catch (error: unknown) {
    return jsonError(error);
  }
}
