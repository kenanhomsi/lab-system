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
    const data = await insuranceApprovalService.findAll({ token, query });
    return NextResponse.json(data);
  } catch (error: unknown) {
    return jsonError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = await resolveAccessToken(req);
    if (!token) {
      throw new Error("Missing authorization token");
    }
    const formData = await req.formData();
    const { data, status } = await insuranceApprovalService.create({
      token,
      formData,
    });
    return NextResponse.json(data, {
      status: status === 201 ? 201 : 200,
    });
  } catch (error: unknown) {
    return jsonError(error, 400);
  }
}
