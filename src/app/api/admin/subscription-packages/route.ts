import { NextRequest, NextResponse } from "next/server";
import { jsonError } from "@/lib/api/bff-errors";
import { backendContainer } from "@/container";
import {
  subscriptionPackageModuleNames,
  SubscriptionPackageBackendService,
} from "@/modules/subscription-package";
import { resolveAccessToken } from "@/lib/api/resolve-access-token";

const subscriptionPackageService =
  backendContainer.get<SubscriptionPackageBackendService>(
    subscriptionPackageModuleNames.service,
  );

export async function GET(req: NextRequest) {
  try {
    const token = await resolveAccessToken(req);
    if (!token) {
      throw new Error("Missing authorization token");
    }
    const query = Object.fromEntries(req.nextUrl.searchParams.entries());
    const res = await subscriptionPackageService.findAll({ token, query });
    return NextResponse.json(res);
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
    const body = await req.json();
    const res = await subscriptionPackageService.create({ token, ...body });
    return NextResponse.json(res, { status: 201 });
  } catch (error: unknown) {
    return jsonError(error, 400);
  }
}
