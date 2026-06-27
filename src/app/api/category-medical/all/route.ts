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

    const res = await categoryService.listAll({ token });
    return NextResponse.json(res);
  } catch (error: unknown) {
    return jsonError(error, 400);
  }
}
