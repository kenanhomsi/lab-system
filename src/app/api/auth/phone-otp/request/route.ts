import { type NextRequest, NextResponse } from "next/server";
import { axiosInstanceBack } from "@/lib/clients/backend-instance";
import { jsonError } from "@/lib/api/bff-errors";

export async function POST(request: NextRequest) {
  try {
    await axiosInstanceBack.post("/api/auth/phone-otp/request", await request.json());
    return new NextResponse(null, { status: 204 });
  } catch (error: unknown) {
    return jsonError(error, 400);
  }
}
