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

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const token = await resolveAccessToken(req);
    if (!token) {
      throw new Error("Missing authorization token");
    }
    const { id } = await context.params;
    const res = await subscriptionPackageService.findOne({ token, id });
    return NextResponse.json(res);
  } catch (error: unknown) {
    return jsonError(error);
  }
}

export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    const token = await resolveAccessToken(req);
    if (!token) {
      throw new Error("Missing authorization token");
    }
    const { id } = await context.params;
    const body = await req.json();
    const res = await subscriptionPackageService.update({ token, id, ...body });
    return NextResponse.json(res);
  } catch (error: unknown) {
    return jsonError(error, 400);
  }
}
