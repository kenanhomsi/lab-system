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

export async function POST(req: NextRequest) {
  try {
    const token = await resolveAccessToken(req);
    if (!token) {
      throw new Error("Missing authorization token");
    }
    const body = await req.json();
    const res = await accessPolicyService.validate({ token, ...body });
    return NextResponse.json(res);
  } catch (error: unknown) {
    return jsonError(error, 400);
  }
}
