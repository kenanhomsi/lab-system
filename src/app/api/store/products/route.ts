import { NextRequest, NextResponse } from "next/server";
import { backendContainer } from "@/container";
import { jsonError } from "@/lib/api/bff-errors";
import { resolveAccessToken } from "@/lib/api/resolve-access-token";
import {
  createStoreProductSchema,
  storeModuleNames,
  StoreBackendService,
} from "@/modules/store";

const storeService = backendContainer.get<StoreBackendService>(storeModuleNames.service);

export async function GET(req: NextRequest) {
  try {
    const token = await resolveAccessToken(req);
    if (!token) throw new Error("Missing authorization token");
    const query = Object.fromEntries(req.nextUrl.searchParams.entries());
    const res = await storeService.listProducts({ token, query });
    return NextResponse.json(res);
  } catch (error: unknown) {
    return jsonError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = await resolveAccessToken(req);
    if (!token) throw new Error("Missing authorization token");
    const body = createStoreProductSchema.parse(await req.json());
    const res = await storeService.createProduct({ token, ...body });
    return NextResponse.json(res, { status: 201 });
  } catch (error: unknown) {
    return jsonError(error, 400);
  }
}
