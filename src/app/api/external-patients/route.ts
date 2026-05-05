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

export async function GET(req: NextRequest) {
  try {
    const token = await resolveAccessToken(req);
    if (!token) {
      throw new Error("Missing authorization token");
    }
    const res = await externalPatientsService.findAll({ token });
    return NextResponse.json(res.data);
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
    const body = (await req.json()) as {
      fullName?: string;
      age?: number;
      gender?: string;
      phoneNumber?: string;
      externalId?: string;
    };
    const res = await externalPatientsService.create({
      token,
      fullName: body.fullName ?? "",
      age: Number(body.age ?? 0),
      gender: body.gender ?? "",
      phoneNumber: body.phoneNumber ?? "",
      externalId: body.externalId ?? "",
    });
    return NextResponse.json(res);
  } catch (error: unknown) {
    return jsonError(error, 400);
  }
}
