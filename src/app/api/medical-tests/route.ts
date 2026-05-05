import { NextRequest, NextResponse } from "next/server";
import { jsonError } from "@/lib/api/bff-errors";
import { backendContainer } from "@/container";
import { MedicalTestBackendService, medicalTestModuleNames } from "@/modules/medical-tests";
import { resolveAccessToken } from "@/lib/api/resolve-access-token";

const medicalTestService = backendContainer.get<MedicalTestBackendService>(
  medicalTestModuleNames.service,
);

export async function GET(req: NextRequest) {
  try {
    const token = await resolveAccessToken(req);
    if (!token) {
      throw new Error("Missing authorization token");
    }
    console.log("token in next route", token);
    const query = Object.fromEntries(req.nextUrl.searchParams.entries());
    console.log("query in next route", query);
    const res = await medicalTestService.findAll({ token, query });
    console.log("res in next route", res);
    return NextResponse.json(res);
  } catch (error: unknown) {
    console.log("error in next route", error);
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
    const res = await medicalTestService.create({ token, ...body });
    return NextResponse.json(res);
  } catch (error: unknown) {
    return jsonError(error, 400);
  }
}
