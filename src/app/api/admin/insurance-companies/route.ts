import { type NextRequest, NextResponse } from "next/server";
import { axiosInstanceBack } from "@/lib/clients/backend-instance";
import { resolveAccessToken } from "@/lib/api/resolve-access-token";
import { jsonError } from "@/lib/api/bff-errors";

const auth = async (request: NextRequest) => {
  const token = await resolveAccessToken(request);
  if (!token) throw new Error("Missing authorization token");
  return { Authorization: `Bearer ${token}` };
};

export async function GET(request: NextRequest) {
  try {
    const response = await axiosInstanceBack.get("/api/admin/insurance-companies", { headers: await auth(request) });
    return NextResponse.json(response.data);
  } catch (error: unknown) {
    return jsonError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const response = await axiosInstanceBack.post("/api/admin/insurance-companies", await request.json(), { headers: await auth(request) });
    return NextResponse.json(response.data, { status: 201 });
  } catch (error: unknown) {
    return jsonError(error, 400);
  }
}
