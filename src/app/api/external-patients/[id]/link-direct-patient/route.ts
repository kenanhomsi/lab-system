import { NextRequest, NextResponse } from "next/server";
import { jsonError } from "@/lib/api/bff-errors";
import { backendContainer } from "@/container";
import { resolveAccessToken } from "@/lib/api/resolve-access-token";
import {
  ExternalPatientsBackendService,
  externalPatientsModuleNames,
} from "@/modules/ExternalPatients";

const externalPatientsService = backendContainer.get<ExternalPatientsBackendService>(
  externalPatientsModuleNames.service,
);

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(req: NextRequest, context: RouteContext) {
  try {
    const token = await resolveAccessToken(req);
    if (!token) {
      throw new Error("Missing authorization token");
    }
    const { id } = await context.params;
    const body = (await req.json()) as { directPatientUserId?: string };
    const directPatientUserId = body.directPatientUserId?.trim() ?? "";
    if (!directPatientUserId) {
      return NextResponse.json(
        { error: "directPatientUserId is required" },
        { status: 400 },
      );
    }
    await externalPatientsService.linkDirectPatient({
      token,
      id,
      directPatientUserId,
    });
    return new NextResponse(null, { status: 204 });
  } catch (error: unknown) {
    return jsonError(error, 400);
  }
}
