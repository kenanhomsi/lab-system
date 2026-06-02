import { NextRequest, NextResponse } from "next/server";
import { backendContainer } from "@/container";
import { jsonError, jsonOrNoContent } from "@/lib/api/bff-errors";
import { resolveAccessToken } from "@/lib/api/resolve-access-token";
import {
  storeModuleNames,
  StoreBackendService,
  upsertStoreProductSchema,
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
    const productId = Number(id);
    if (!Number.isFinite(productId)) throw new Error("Invalid product id");
    const res = await storeService.getProduct({ token, id: productId });
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
    const productId = Number(id);
    if (!Number.isFinite(productId)) throw new Error("Invalid product id");
    const body = upsertStoreProductSchema.parse(await req.json());
    const res = await storeService.updateProduct({ token, id: productId, ...body });
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
    const productId = Number(id);
    if (!Number.isFinite(productId)) throw new Error("Invalid product id");
    await storeService.deleteProduct({ token, id: productId });
    return jsonOrNoContent(null);
  } catch (error: unknown) {
    return jsonError(error, 400);
  }
}
