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

type StatusBody = {
  status?: string;
  notes?: string;
  rejectionReason?: string;
};

export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    const token = await resolveAccessToken(req);
    if (!token) {
      throw new Error("Missing authorization token");
    }
    const { id } = await context.params;
    const body = (await req.json()) as StatusBody;
    if (!body.status) {
      throw new Error("Missing status");
    }
    const data = await insuranceApprovalService.updateStatus({
      token,
      id,
      status: body.status,
      notes: body.notes,
      rejectionReason: body.rejectionReason,
    });
    return NextResponse.json(data);
  } catch (error: unknown) {
    return jsonError(error, 400);
  }
}
