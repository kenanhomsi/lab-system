import { NextRequest, NextResponse } from "next/server";
import { jsonError } from "@/lib/api/bff-errors";
import { backendContainer } from "@/container";
import { resolveAccessToken } from "@/lib/api/resolve-access-token";
import {
  SpecialAccountBackendService,
  createExpenseSchema,
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
    const res = await service.listExpenses({ token, query: { from, to } });
    return NextResponse.json(res);
  } catch (error: unknown) {
    return jsonError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = await resolveAccessToken(req);
    if (!token) throw new Error("Missing authorization token");
    const body = createExpenseSchema.parse(await req.json());
    const res = await service.createExpense({ token, ...body });
    return NextResponse.json(res, { status: 201 });
  } catch (error: unknown) {
    return jsonError(error, 400);
  }
}
