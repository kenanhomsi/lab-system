import { NextRequest, NextResponse } from "next/server";
import { jsonError } from "@/lib/api/bff-errors";
import { backendContainer } from "@/container";
import {
  AccessPolicyBackendService,
  accessPolicyModuleNames,
} from "@/modules/access-policy";
import { resolveAccessToken } from "@/lib/api/resolve-access-token";

const accessPolicyService = backendContainer.get<AccessPolicyBackendService>(
  accessPolicyModuleNames.service,
);

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(_req: NextRequest, context: RouteContext) {
  try {
    const token = await resolveAccessToken(_req);
    if (!token) {
      throw new Error("Missing authorization token");
    }
    const { id } = await context.params;
    const res = await accessPolicyService.enable({ token, id });
    return NextResponse.json(res);
  } catch (error: unknown) {
    return jsonError(error);
  }
}
