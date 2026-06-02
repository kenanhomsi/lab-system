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

export async function GET(req: NextRequest) {
  try {
    const token = await resolveAccessToken(req);
    if (!token) {
      throw new Error("Missing authorization token");
    }
    const query = Object.fromEntries(req.nextUrl.searchParams.entries());
    const data = await insuranceApprovalService.findMine({ token, query });
    return NextResponse.json(data);
  } catch (error: unknown) {
    return jsonError(error);
  }
}
