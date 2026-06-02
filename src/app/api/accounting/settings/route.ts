import { NextRequest, NextResponse } from "next/server";
import { jsonError } from "@/lib/api/bff-errors";
import { backendContainer } from "@/container";
import { resolveAccessToken } from "@/lib/api/resolve-access-token";
import {
  AccountingBackendService,
  accountingModuleNames,
  updateAccountingSettingsSchema,
} from "@/modules/accounting";

const accountingService = backendContainer.get<AccountingBackendService>(
  accountingModuleNames.service,
);

export async function GET(req: NextRequest) {
  try {
    const token = await resolveAccessToken(req);
    if (!token) throw new Error("Missing authorization token");
    const res = await accountingService.getSettings({ token });
    return NextResponse.json(res);
  } catch (error: unknown) {
    return jsonError(error);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = await resolveAccessToken(req);
    if (!token) throw new Error("Missing authorization token");
    const body = updateAccountingSettingsSchema.parse(await req.json());
    const res = await accountingService.updateSettings({ token, ...body });
    return NextResponse.json(res);
  } catch (error: unknown) {
    return jsonError(error, 400);
  }
}
