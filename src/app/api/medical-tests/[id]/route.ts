import { NextRequest, NextResponse } from "next/server";    
import { resolveAccessToken } from "@/lib/api/resolve-access-token";
import { MedicalTestBackendService, medicalTestModuleNames } from "@/modules/medical-tests";
import { backendContainer } from "@/container";
import { jsonError } from "@/lib/api/bff-errors";

const medicalTestService = backendContainer.get<MedicalTestBackendService>(
  medicalTestModuleNames.service,
);

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, context: RouteContext) {
 try {
  const { id } = await context.params;
  const token = await resolveAccessToken(req);
    if (!token) {
      throw new Error("Missing authorization token");
    }

  const res = await medicalTestService.findOne({ token, id });
  return NextResponse.json(res);
 } catch (error: unknown) {
  return jsonError(error, 400);
 }
}
