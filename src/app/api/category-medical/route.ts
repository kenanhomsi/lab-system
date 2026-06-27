import { NextRequest, NextResponse } from "next/server";
import { backendContainer } from "@/container";
import { jsonError } from "@/lib/api/bff-errors";
import { resolveAccessToken } from "@/lib/api/resolve-access-token";
import {
  MedicalTestCategoryBackendService,
  medicalTestCategoryModuleNames,
} from "@/modules/medical-test-categories";

const categoryService = backendContainer.get<MedicalTestCategoryBackendService>(
  medicalTestCategoryModuleNames.service,
);

export async function GET(req: NextRequest) {
  try {
    const token = await resolveAccessToken(req);
    if (!token) {
      throw new Error("Missing authorization token");
    }

    const query = Object.fromEntries(req.nextUrl.searchParams.entries());
    const res = await categoryService.list({ token, query });
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
    const res = await categoryService.create({ token, ...body });
    return NextResponse.json(res);
  } catch (error: unknown) {
    return jsonError(error, 400);
  }
}
