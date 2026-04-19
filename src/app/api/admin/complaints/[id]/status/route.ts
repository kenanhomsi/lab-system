import { NextRequest, NextResponse } from "next/server";
import { jsonError } from "@/lib/api/bff-errors";
import { backendContainer } from "@/container";
import { ComplaintBackendService, complaintModuleNames } from "@/modules/complaint";
import { resolveAccessToken } from "@/lib/api/resolve-access-token";

const complaintService = backendContainer.get<ComplaintBackendService>(
  complaintModuleNames.service,
);

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    const token = await resolveAccessToken(req);
    if (!token) {
      throw new Error("Missing authorization token");
    }

    const { id } = await context.params;
    const body = (await req.json()) as { status?: string };
    if (!body.status) {
      throw new Error("Missing complaint status");
    }

    await complaintService.updateStatus({ token, id, status: body.status });
    return new NextResponse(null, { status: 204 });
  } catch (error: unknown) {
    return jsonError(error, 400);
  }
}
