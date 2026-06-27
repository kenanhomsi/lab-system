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

type RouteContext = { params: Promise<{ id: string }> };

const parseId = (raw: string): number => {
  const id = Number(raw);
  if (!Number.isFinite(id)) {
    throw new Error("Invalid category id");
  }
  return id;
};

export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const token = await resolveAccessToken(req);
    if (!token) {
      throw new Error("Missing authorization token");
    }

    const { id: rawId } = await context.params;
    const res = await categoryService.get({ token, id: parseId(rawId) });
    return NextResponse.json(res);
  } catch (error: unknown) {
    return jsonError(error, 400);
  }
}

export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    const token = await resolveAccessToken(req);
    if (!token) {
      throw new Error("Missing authorization token");
    }

    const { id: rawId } = await context.params;
    const body = await req.json();
    const res = await categoryService.update({ token, id: parseId(rawId), ...body });
    return NextResponse.json(res);
  } catch (error: unknown) {
    return jsonError(error, 400);
  }
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    const token = await resolveAccessToken(req);
    if (!token) {
      throw new Error("Missing authorization token");
    }

    const { id: rawId } = await context.params;
    await categoryService.delete({ token, id: parseId(rawId) });
    return new NextResponse(null, { status: 204 });
  } catch (error: unknown) {
    return jsonError(error, 400);
  }
}
