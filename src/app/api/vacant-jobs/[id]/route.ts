import { NextRequest, NextResponse } from "next/server";
import { resolveAccessToken } from "@/lib/api/resolve-access-token";
import { VacantJobBackendService, vacantJobModuleNames } from "@/modules/vacant-jobs";
import { backendContainer } from "@/container";
import { jsonError } from "@/lib/api/bff-errors";

const vacantJobService = backendContainer.get<VacantJobBackendService>(
  vacantJobModuleNames.service,
);

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const token = await resolveAccessToken(req);
    if (!token) {
      throw new Error("Missing authorization token");
    }
    const res = await vacantJobService.findOne({ token, id });
    return NextResponse.json(res);
  } catch (error: unknown) {
    return jsonError(error, 400);
  }
}

export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const token = await resolveAccessToken(req);
    if (!token) {
      throw new Error("Missing authorization token");
    }
    const body = await req.json();
    const res = await vacantJobService.update({ token, id, ...body });
    return NextResponse.json(res);
  } catch (error: unknown) {
    return jsonError(error, 400);
  }
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const token = await resolveAccessToken(req);
    if (!token) {
      throw new Error("Missing authorization token");
    }
    await vacantJobService.delete({ token, id });
    return new NextResponse(null, { status: 204 });
  } catch (error: unknown) {
    return jsonError(error, 400);
  }
}
