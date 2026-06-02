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
    const items = await service.listDescriptions({ token });
    return NextResponse.json({ items });
  } catch (error: unknown) {
    return jsonError(error);
  }
}
