import { type NextRequest, NextResponse } from "next/server";
import { axiosInstanceBack } from "@/lib/clients/backend-instance";
import { resolveAccessToken } from "@/lib/api/resolve-access-token";
import { jsonError } from "@/lib/api/bff-errors";

export async function GET(request: NextRequest) {
  try {
    const token = await resolveAccessToken(request);
    const response = await axiosInstanceBack.get("/api/insurance-companies", {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    return NextResponse.json(response.data);
  } catch (error: unknown) {
    return jsonError(error);
  }
}
