import { NextRequest, NextResponse } from "next/server";
import { jsonError, jsonOrNoContent } from "@/lib/api/bff-errors";
import { backendContainer } from "@/container";
import { resolveAccessToken } from "@/lib/api/resolve-access-token";
import {
  AccountingBackendService,
  accountingModuleNames,
  updatePaymentSchema,
} from "@/modules/accounting";

const accountingService = backendContainer.get<AccountingBackendService>(
  accountingModuleNames.service,
);

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const token = await resolveAccessToken(req);
    if (!token) throw new Error("Missing authorization token");
    const { id } = await params;
    const paymentId = Number(id);
    if (!Number.isFinite(paymentId)) {
      throw new Error("Invalid payment id");
    }
    const body = updatePaymentSchema.parse(await req.json());
    const res = await accountingService.updatePayment({
      token,
      id: paymentId,
      ...body,
    });
    return NextResponse.json(res);
  } catch (error: unknown) {
    return jsonError(error, 400);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const token = await resolveAccessToken(req);
    if (!token) throw new Error("Missing authorization token");
    const { id } = await params;
    const paymentId = Number(id);
    if (!Number.isFinite(paymentId)) {
      throw new Error("Invalid payment id");
    }
    await accountingService.deletePayment({ token, id: paymentId });
    return jsonOrNoContent(null);
  } catch (error: unknown) {
    return jsonError(error, 400);
  }
}
