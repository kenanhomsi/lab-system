import { type NextRequest, NextResponse } from "next/server";
import { axiosInstanceBack } from "@/lib/clients/backend-instance";
import { jsonError } from "@/lib/api/bff-errors";

export async function POST(request: NextRequest) {
  try {
    const response = await axiosInstanceBack.post("/api/auth/phone-otp/verify", await request.json());
    return NextResponse.json(response.data);
  } catch (error: unknown) {
    return jsonError(error, 400);
  }
}
