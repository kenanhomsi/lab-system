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
  params: Promise<{ tableName: string }>;
};

export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const token = await resolveAccessToken(req);
    if (!token) {
      throw new Error("Missing authorization token");
    }

    const { tableName } = await context.params;
    const response = await accessPolicyService.findTableFields({
      token,
      tableName,
    });
    return NextResponse.json(response);
  } catch (error: unknown) {
    return jsonError(error);
  }
}
