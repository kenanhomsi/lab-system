import { NextRequest, NextResponse } from "next/server";
import { backendContainer } from "@/container";
import { jsonError, jsonOrNoContent } from "@/lib/api/bff-errors";
import { resolveAccessToken } from "@/lib/api/resolve-access-token";
import {
  storeModuleNames,
  StoreBackendService,
  upsertStoreCategorySchema,
} from "@/modules/store";

const storeService = backendContainer.get<StoreBackendService>(storeModuleNames.service);

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const token = await resolveAccessToken(req);
    if (!token) throw new Error("Missing authorization token");
    const { id } = await params;
    const categoryId = Number(id);
    if (!Number.isFinite(categoryId)) throw new Error("Invalid category id");
    const res = await storeService.getCategory({ token, id: categoryId });
    return NextResponse.json(res);
  } catch (error: unknown) {
    return jsonError(error, 400);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const token = await resolveAccessToken(req);
    if (!token) throw new Error("Missing authorization token");
    const { id } = await params;
    const categoryId = Number(id);
    if (!Number.isFinite(categoryId)) throw new Error("Invalid category id");
    const body = upsertStoreCategorySchema.parse(await req.json());
    const res = await storeService.updateCategory({ token, id: categoryId, ...body });
    return NextResponse.json(res);
  } catch (error: unknown) {
    return jsonError(error, 400);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const token = await resolveAccessToken(req);
    if (!token) throw new Error("Missing authorization token");
    const { id } = await params;
    const categoryId = Number(id);
    if (!Number.isFinite(categoryId)) throw new Error("Invalid category id");
    await storeService.deleteCategory({ token, id: categoryId });
    return jsonOrNoContent(null);
  } catch (error: unknown) {
    return jsonError(error, 400);
  }
}
