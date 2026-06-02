import { NextRequest, NextResponse } from "next/server";
import { jsonError } from "@/lib/api/bff-errors";
import { backendContainer } from "@/container";
import { resolveAccessToken } from "@/lib/api/resolve-access-token";
import {
  AccountingBackendService,
  accountingModuleNames,
} from "@/modules/accounting";

const accountingService = backendContainer.get<AccountingBackendService>(
  accountingModuleNames.service,
);

export async function GET(req: NextRequest) {
  try {
    const token = await resolveAccessToken(req);
    if (!token) throw new Error("Missing authorization token");
    const labClientId = req.nextUrl.searchParams.get("labClientId") ?? "";
    if (!labClientId.trim()) {
      throw new Error("labClientId is required");
    }
    const from = req.nextUrl.searchParams.get("from") ?? undefined;
    const to = req.nextUrl.searchParams.get("to") ?? undefined;
    const res = await accountingService.getStatement({
      token,
      query: { labClientId, from, to },
    });
    return NextResponse.json(res);
  } catch (error: unknown) {
    return jsonError(error, 400);
  }
}
