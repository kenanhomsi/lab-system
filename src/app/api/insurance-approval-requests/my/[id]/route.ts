import { NextRequest, NextResponse } from "next/server";
import { jsonError } from "@/lib/api/bff-errors";
import { resolveAccessToken } from "@/lib/api/resolve-access-token";
import { backendContainer } from "@/container";
import {
  InsuranceApprovalRequestBackendService,
  insuranceApprovalRequestModuleNames,
} from "@/modules/insurance-approval-request";

const insuranceApprovalService = backendContainer.get<InsuranceApprovalRequestBackendService>(
  insuranceApprovalRequestModuleNames.service,
);

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const token = await resolveAccessToken(req);
    if (!token) {
      throw new Error("Missing authorization token");
    }
    const { id } = await context.params;
    const data = await insuranceApprovalService.findMineOne({ token, id });
    return NextResponse.json(data);
  } catch (error: unknown) {
    return jsonError(error);
  }
}
