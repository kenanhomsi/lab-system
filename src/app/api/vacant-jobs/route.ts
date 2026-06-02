import { NextRequest, NextResponse } from "next/server";
import { jsonError } from "@/lib/api/bff-errors";
import { backendContainer } from "@/container";
import { VacantJobBackendService, vacantJobModuleNames } from "@/modules/vacant-jobs";
import { resolveAccessToken } from "@/lib/api/resolve-access-token";

const vacantJobService = backendContainer.get<VacantJobBackendService>(
  vacantJobModuleNames.service,
);

export async function GET(req: NextRequest) {
  try {
    const token = await resolveAccessToken(req);
    if (!token) {
      throw new Error("Missing authorization token");
    }
    const query = Object.fromEntries(req.nextUrl.searchParams.entries());
    const res = await vacantJobService.findAll({ token, query });
    return NextResponse.json(res);
  } catch (error: unknown) {
    return jsonError(error, 400);
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = await resolveAccessToken(req);
    if (!token) {
      throw new Error("Missing authorization token");
    }
    const body = await req.json();
    const res = await vacantJobService.create({ token, ...body });
    return NextResponse.json(res, { status: 201 });
  } catch (error: unknown) {
    return jsonError(error, 400);
  }
}
